const launchesDatabse = require("./launches.mongo");
const planets = require("./planet.mongo");
const axios = require("axios");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v5/launches/query";

async function findLaunch(filter) {
  return await launchesDatabse.findOne(filter);
}

async function launchDoesExist(id) {
  return (await findLaunch({ flightNumber: id })) ? true : false;
}

async function laodLaunchesData() {
  const firstLaunch = await findLaunch({
    flight_number: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

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
  response.data.docs
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
  if (response.status !== 200)
    throw new Error("some problemt with downloding launch data");
}

async function getLatestFligtNumber() {
  const latestLaunch = await launchesDatabse.findOne().sort("-flightNumber");
  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;
  return +latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
  return Array.from(
    await launchesDatabse
      .find({}, "-__v")
      .sort({ flightNumber: 1 })
      .skip(skip)
      .limit(limit)
  );
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
