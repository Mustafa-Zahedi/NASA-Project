const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require("./planet.mongo");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] >= 0.36 &&
    planet["koi_insol"] <= 1.11 &&
    planet["koi_prad"] <= 1.6
  );
}

const habitablePlanet = [];
function loadPlanetData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "003 kepler-data.csv")
    )
      .pipe(parse({ comment: "#", columns: true }))
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          // habitablePlanet.push(data);
          // TODO: replace below create with insert + update = upsert
          // await planets.create({ keplerName: data.kepler_name });
        }
      })
      .on("error", (error) => {
        console.log(error);
        reject(error);
      })
      .on("end", () => {
        resolve();
      });
  });
}

async function getAllPlanets() {
  return await planets.find({});
}

module.exports = { loadPlanetData, getAllPlanets };
