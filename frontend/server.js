// server.js (dentro de tu carpeta frontend)
const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  // Aquí ajustamos la ruta para ir un nivel arriba (..) y luego a 'backend'
  key: fs.readFileSync(
    path.join(__dirname, "..", "backend/cert", "private.key")
  ),
  cert: fs.readFileSync(
    path.join(__dirname, "..", "backend/cert", "certificate.crt")
  ),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3001, (err) => {
    if (err) throw err;
    console.log("> Ready on https://localhost:3001");
  });
});

// key: fs.readFileSync(path.resolve(certPath, 'private.key')),
//     cert: fs.readFileSync(path.resolve(certPath, 'certificate.crt')),
