// const launches = require("./launches.mongo");

const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("September 30, 2025"),
  target: "Kepler-442 b",
  customers: ["Z", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function launchDoesExist(id) {
  return launches.has(+id);
}

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customers: ["Space X", "NASA"],
      upcoming: true,
      success: true,
    })
  );
}

function abortLaunch(id) {
  let aborted = launches.get(id);
  (aborted.upcoming = false), (aborted.success = false);
  return aborted;
}

module.exports = {
  launchDoesExist,
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
};
