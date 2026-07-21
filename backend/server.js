const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = process.env.PORT || 3000;
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    "-" +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

function sendJSON(res, code, data) {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

async function serveStatic(req, res) {
  const pathname = url.parse(req.url).pathname;
  let filePath = path.join(ROOT, pathname === "/" ? "index.html" : pathname);

  if (pathname.startsWith("/frontend/") && pathname.endsWith(".html")) {
    filePath = path.join(ROOT, pathname);
  }

  const ext = path.extname(filePath).toLowerCase();

  try {
    const stat = await fs.promises.stat(filePath);
    if (!stat.isFile()) {
      sendJSON(res, 404, { error: "Not Found" });
      return;
    }
    const content = await fs.promises.readFile(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(content);
  } catch {
    sendJSON(res, 404, { error: "Not Found" });
  }
}

function handleBackup(req, res) {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    try {
      JSON.parse(body);
      const fileName = `docs-${timestamp()}.json`;
      const filePath = path.join(DATA_DIR, fileName);
      fs.writeFileSync(filePath, body, "utf8");
      sendJSON(res, 200, { ok: true, file: fileName });
    } catch {
      sendJSON(res, 400, { error: "Invalid JSON" });
    }
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/backup") {
    return handleBackup(req, res);
  }
  if (req.method === "GET" && req.url === "/api/backup/check") {
    return sendJSON(res, 200, { ok: true });
  }
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`DocsCMS Server running at http://localhost:${PORT}`);
});
