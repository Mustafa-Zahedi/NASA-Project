const launchesD = require("./launches.mongo");
const planets = require("./planet.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

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

saveLaunch(launch);

async function launchDoesExist(id) {
  return (await launchesD.findOne({ flightNumber: id })) ? true : false;
}

async function getLatestFligtNumber() {
  const latestLaunch = await launchesD.findOne().sort("-flightNumber");
  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;
  return +latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return Array.from(await launchesD.find({}, "-__v"));
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });
  if (!planet) return undefined;

  return await launchesD.updateOne(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
}

async function addNewLaunch(launch) {
  let newFlightNumber = (await getLatestFligtNumber()) + 1;
  return await saveLaunch(
    Object.assign(launch, {
      flightNumber: newFlightNumber,
      customers: ["Space X", "NASA"],
      upcoming: true,
      success: true,
    })
  );
}

function abortLaunch(id) {
  let aborted = launchesD.updateOne(
    { flightNumber: +id },
    { upcoming: false, success: false }
  );
  return aborted;
}

module.exports = {
  launchDoesExist,
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
};
