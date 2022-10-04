const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const { loadPlanetData } = require("./models/planets.model");

/* Setting the port number to the environment variable PORT or 8000 if the environment variable is not
set. */
const PORT = process.env.PORT || 8000;

const MONGO_URL =
  "mongodb+srv://nasa:DB2fjrv6CXbgg8oi@cluster0.aypan.mongodb.net/nasa?retryWrites=true&w=majority";

/* Creating a server that is listening to the port. */
const server = http.createServer(app);

mongoose.connection.once("open", () =>
  console.log("mongo connection is ready!")
);

mongoose.connection.on("error", (err) => console.error(err));

(async function () {
  /* Connecting to the MongoDB database. */
  await mongoose.connect(MONGO_URL);

  /* Loading the data from the JSON file into the database. */
  await loadPlanetData();

  /* Listening to the port and logging the port number. */
  server.listen(PORT, () => {
    console.log("Listening on port " + PORT);
  });
})();
