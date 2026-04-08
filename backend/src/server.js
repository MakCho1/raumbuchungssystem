const app = require("./app");

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});