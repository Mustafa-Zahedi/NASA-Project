const launchesDatabse = require("./launches.mongo");
const planets = require("./planet.mongo");
const axios = require("axios");

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100, //flight_number
  mission: "Kepler Exploration X", // name
  rocket: "Explorer IS1", // rocket.name
  launchDate: new Date("September 30, 2025"), // date_local
  target: "Kepler-442 b", // new feature
  customers: ["Z", "NASA"], // payload.customers
  upcoming: true, // upcoming
  success: true, // success
};

saveLaunch(launch);

async function findLaunch(filter) {
  return await launchesDatabse.findOne(filter);
}

async function launchDoesExist(id) {
  return (await findLaunch({ flightNumber: id })) ? true : false;
}

const SPACEX_API_URL = "https://api.spacexdata.com/v5/launches/query";

async function laodLaunchesData() {
  const firstLaunch = await findLaunch({
    flight_number: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  console.log("first", firstLaunch);

  if (firstLaunch) console.log("launches already loaded");
  else loadLaunches();
}

async function loadLaunches() {
  console.log("loading launches data...");
  const response = await axios(SPACEX_API_URL, {
    method: "post",
    data: {
      query: {},
      options: {
        pagination: false,
        populate: [
          { path: "rocket", select: { name: 1 } },
          { path: "payloads", select: { customers: 1 } },
        ],
      },
    },
  });
  const launchesDocs = response.data.docs
    .map((launchDoc) => ({
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers: launchDoc.payloads.flatMap((payload) => payload.customers),
    }))
    .map((launch) => saveLaunch(launch));
}

async function getLatestFligtNumber() {
  const latestLaunch = await launchesDatabse.findOne().sort("-flightNumber");
  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;
  return +latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return Array.from(await launchesDatabse.find({}, "-__v"));
}

async function saveLaunch(launch) {
  return await launchesDatabse.updateOne(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
}

async function addNewLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });
  if (!planet) throw new Error();

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
  let aborted = launchesDatabse.updateOne(
    { flightNumber: +id },
    { upcoming: false, success: false }
  );
  return aborted;
}

module.exports = {
  laodLaunchesData,
  launchDoesExist,
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
};
