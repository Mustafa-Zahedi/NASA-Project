const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () =>
  console.log("mongo connection is ready!")
);

mongoose.connection.on("error", (err) => console.error(err));

async function mongoConnect() {
  mongoose.connect(MONGO_URL);
}
async function mongoDisConnect() {
  mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisConnect };
