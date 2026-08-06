const http = require("http");
const fs = require("fs");
const path = require("path");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ttf": "font/ttf"
};

http.createServer((request, response) => {
  const requested = decodeURIComponent(request.url.split("?")[0]);
  const relative = requested === "/" ? "/index.html" : requested;
  const filePath = path.resolve(process.cwd(), `.${relative}`);
  if (!filePath.startsWith(path.resolve(process.cwd()))) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": mime[path.extname(filePath).toLowerCase()] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(response);
  });
}).listen(4173, "127.0.0.1", () => console.log("SDDI local server: http://127.0.0.1:4173/"));
