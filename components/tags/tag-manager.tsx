"use client";

import { useState, useTransition } from "react";
import { createTag, updateTag, deleteTag } from "@/lib/action/tag";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconSearch,
  IconTag,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface Tag {
  id: string;
  name: string;
  _count?: {
    products: number;
  };
}

interface TagManagerProps {
  tags: Tag[];
}

export function TagManager({ tags }: TagManagerProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [tagName, setTagName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    if (!tagName.trim()) {
      toast.error("Tag name is required");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", tagName.trim());
      const result = await createTag(formData);

      if (result.success) {
        toast.success(result.message);
        setIsCreateOpen(false);
        setTagName("");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleUpdate = () => {
    if (!selectedTag || !tagName.trim()) {
      toast.error("Tag name is required");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", selectedTag.id);
      formData.append("name", tagName.trim());
      const result = await updateTag(formData);

      if (result.success) {
        toast.success(result.message);
        setIsEditOpen(false);
        setSelectedTag(null);
        setTagName("");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleDelete = () => {
    if (!selectedTag) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", selectedTag.id);
      const result = await deleteTag(formData);

      if (result.success) {
        toast.success(result.message);
        setIsDeleteOpen(false);
        setSelectedTag(null);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">Tags</CardTitle>
            <CardDescription>
              Manage your product tags and categories
            </CardDescription>
          </div>
          <Button
            onClick={() => {
              setTagName("");
              setIsCreateOpen(true);
            }}
            className="gap-2"
          >
            <IconPlus className="h-4 w-4" />
            Create Tag
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <div className="relative w-full max-w-sm">
              <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Name</TableHead>
                  <TableHead className="text-center">Products</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTags.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {searchTerm ? (
                        <div className="flex flex-col items-center gap-1">
                          <p>No tags found matching &quot;{searchTerm}&quot;</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <IconTag className="h-8 w-8 opacity-50" />
                          <p>No tags created yet</p>
                          <Button
                            variant="link"
                            onClick={() => setIsCreateOpen(true)}
                            className="h-auto p-0"
                          >
                            Create your first tag
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="px-2 py-1 text-sm"
                        >
                          {tag.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className="ml-auto mr-auto w-fit"
                        >
                          {tag._count?.products ?? 0} products
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedTag(tag);
                              setTagName(tag.name);
                              setIsEditOpen(true);
                            }}
                          >
                            <IconEdit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              setSelectedTag(tag);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <IconTrash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Showing {filteredTags.length} of {tags.length} tags
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
            <DialogDescription>
              Add a new tag to organize your products.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Tag Name</Label>
              <Input
                id="tag-name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="e.g. Electronics, Furniture"
                disabled={isPending}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isPending}>
              {isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>Update the tag name.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-tag-name">Tag Name</Label>
              <Input
                id="edit-tag-name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="e.g. Electronics, Furniture"
                disabled={isPending}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUpdate();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isPending}>
              {isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedTag?.name}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
