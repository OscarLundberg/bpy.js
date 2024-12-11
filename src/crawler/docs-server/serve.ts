import express from "express";
import path from "path";
//@ts-ignore
import staticZip from "express-static-zip";

const SUPPORTED_VERSIONS = {
  "v3.6": "blender_python_reference_3_6/"
}

export function serveDocs(api_version: keyof typeof SUPPORTED_VERSIONS = "v3.6", fileserver_port = 3123) {
  const app = express();
  const zip = path.join(process.cwd(), 'assets', `${api_version}.zip`);
  console.log("Serving",)
  app.use(staticZip(zip, { zipRoot: SUPPORTED_VERSIONS[api_version] }));

  return new Promise<{ stop(): void }>(res => {
    const server = app.listen(fileserver_port, "localhost", () => {
      console.log("Server listening on port ", fileserver_port)
      res({
        stop() {
          server.close();
        }
      })
    });
  })
}