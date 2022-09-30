const { parse } = require("csv-parse");
const fs = require("fs");

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
    fs.createReadStream("./data/003 kepler-data.csv")
      .pipe(parse({ comment: "#", columns: true }))
      .on("data", (data) => {
        if (isHabitablePlanet(data)) {
          habitablePlanet.push(data);
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

function getAllPlanets() {
  return habitablePlanet;
}

module.exports = { loadPlanetData, getAllPlanets };
