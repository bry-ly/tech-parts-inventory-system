"use client";

import Image from "next/image";

const members = [
  {
    name: "Bryan Palay",
    role: "Leader",
    avatar: "/avatars/PALAY.jpg",
  },
  {
    name: "John Ernie Diao",
    role: "Members",
    avatar: "/avatars/DIAO.jpg",
  },
  {
    name: "John Christian Dimpas",
    role: "Members",
    avatar: "/avatars/DIMPAS.jpg",
  },
  {
    name: "Jhonard Familara",
    role: "Members",
    avatar: "/avatars/FAMILARA.jpg",
  },
  {
    name: "Ashley Lalican",
    role: "Members",
    avatar: "",
  },
];

const AvatarWithFallback = ({ src, alt }: { src: string; alt: string }) => {
  const imageSrc = src && src.trim() !== "" ? src : "/placeholder.svg";

  return (
    <Image
      className="aspect-square rounded-full object-cover"
      src={imageSrc}
      alt={alt}
      height="460"
      width="460"
      loading="lazy"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "/placeholder.svg";
      }}
    />
  );
};

export default function TeamSection() {
  const topMembers = members.slice(0, 3);
  const bottomMembers = members.slice(3, 5);

  return (
    <section className="py-12 md:py-32" id="team">
      <div className="mx-auto max-w-3xl px-8 lg:px-0">
        <h2 className="mb-8 text-4xl font-bold md:mb-16 lg:text-5xl">
          Our team
        </h2>

        <div>
          <h3 className="mb-6 text-lg font-medium"></h3>
          <div className="border-t py-6">
            {/* Mobile: show all 5 with last one centered */}
            <div className="flex flex-wrap justify-center gap-4 md:hidden">
              {members.map((member, index) => (
                <div key={index} className="w-[calc(50%-0.5rem)]">
                  <div className="flex flex-col items-center">
                    <div className="bg-background size-32 rounded-full border p-0.5 shadow shadow-zinc-950/5">
                      <AvatarWithFallback
                        src={member.avatar}
                        alt={member.name}
                      />
                    </div>
                    <span className="mt-2 block text-sm text-center">
                      {member.name}
                    </span>
                    <span className="text-muted-foreground block text-xs text-center">
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet: show all 5 in a row */}
            <div className="hidden md:grid md:grid-cols-5 gap-4 lg:hidden">
              {members.map((member, index) => (
                <div key={index}>
                  <div className="bg-background size-32 rounded-full border p-0.5 shadow shadow-zinc-950/5 mx-auto">
                    <AvatarWithFallback src={member.avatar} alt={member.name} />
                  </div>
                  <span className="mt-2 block text-sm text-center">
                    {member.name}
                  </span>
                  <span className="text-muted-foreground block text-xs text-center">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>

            {/* Large screens: 3 on top, 2 centered below */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-3 gap-4 justify-items-center">
                {topMembers.map((member, index) => (
                  <div key={index}>
                    <div className="bg-background size-32 rounded-full border p-0.5 shadow shadow-zinc-950/5">
                      <AvatarWithFallback
                        src={member.avatar}
                        alt={member.name}
                      />
                    </div>
                    <span className="mt-2 block text-sm">{member.name}</span>
                    <span className="text-muted-foreground block text-xs">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 max-w-md mx-auto justify-items-center">
                {bottomMembers.map((member, index) => (
                  <div key={index}>
                    <div className="bg-background size-32 rounded-full border p-0.5 shadow shadow-zinc-950/5">
                      <AvatarWithFallback
                        src={member.avatar}
                        alt={member.name}
                      />
                    </div>
                    <span className="mt-2 block text-sm">{member.name}</span>
                    <span className="text-muted-foreground block text-xs">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
