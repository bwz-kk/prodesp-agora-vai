import { defineComputeConfig } from "@prisma/compute-sdk/config";

export default defineComputeConfig({
  app: {
    name: "Prodesp",
    region: "us-east-1",
    framework: "custom",
    httpPort: 3000,
    build: {
      command: "npm run build",
      outputDirectory: "dist",
      entrypoint: "server.js",
    },
  },
});
