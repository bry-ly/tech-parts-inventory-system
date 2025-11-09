import { S3Client } from "@aws-sdk/client-s3";
import {
  createUploadRouteHandler,
  route,
  type Router,
} from "better-upload/server";

const S3 = new S3Client();

const router: Router = {
  client: S3,
  bucketName: "my-bucket",
  routes: {
    demo: route({
      fileTypes: ["image/*"],
      maxFileSize: 1024 * 1024 * 4, // 4MB
    }),
  },
};

export const { POST } = createUploadRouteHandler(router);
