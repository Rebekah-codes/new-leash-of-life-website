const compression = require("compression");
const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const rootDir = __dirname;

app.use(compression());

app.use(
  express.static(rootDir, {
    etag: true,
    lastModified: true,
    maxAge: "1d",
    setHeaders: (res, filePath) => {
      // Avoid caching HTML so content updates are visible immediately.
      if (path.extname(filePath) === ".html") {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  }),
);

// Keep explicit routes for clean app behavior on Heroku.
app.get("/", (_req, res) => {
  res.sendFile(path.join(rootDir, "index.html"));
});

app.get("/pages/:page", (req, res) => {
  res.sendFile(path.join(rootDir, "pages", req.params.page));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
