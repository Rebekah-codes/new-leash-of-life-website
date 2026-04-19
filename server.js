const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const rootDir = __dirname;

app.use(express.static(rootDir));

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
