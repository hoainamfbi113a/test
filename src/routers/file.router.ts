import compression from "compression";

export const fileRouter = {
  aliases: {
    "POST /delete": "file.delete",
    "POST /upload": "multipart:file.upload",
  },
  authentication: true,
  bodyParsers: {
    json: true,
    urlencoded: false,
  },
  path: "/v2/file",
  use: [compression()],
  whitelist: ["file.*"],
};
