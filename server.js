// Startup file for Hostinger's Node.js hosting (Phusion Passenger).
// Passenger boots this file directly and supplies the port via process.env.PORT,
// so we start Next.js in production mode rather than shelling out to `next start`.
const { createServer } = require("http");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev: false });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => handle(req, res)).listen(port, () => {
      console.log(`tawwerni ready on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start Next.js:", err);
    process.exit(1);
  });
