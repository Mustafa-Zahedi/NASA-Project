const http = require("http");

const app = require("./app");
const { mongoConnect } = require("../services/mongo");
const { loadPlanetData } = require("./models/planets.model");

/* Setting the port number to the environment variable PORT or 8000 if the environment variable is not
set. */
const PORT = process.env.PORT || 8000;

/* Creating a server that is listening to the port. */
const server = http.createServer(app);

(async function () {
  /* Connecting to the MongoDB database. */
  await mongoConnect;

  /* Loading the data from the JSON file into the database. */
  await loadPlanetData();

  /* Listening to the port and logging the port number. */
  server.listen(PORT, () => {
    console.log("Listening on port " + PORT);
  });
})();
