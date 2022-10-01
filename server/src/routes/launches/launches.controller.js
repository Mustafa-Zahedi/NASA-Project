const {
  getAllLaunches,
  addNewLaunch,
  launchDoesExist,
  abortLaunch,
} = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  let launch = req.body;
  if (
    !launch.mission ||
    !launch.target ||
    !launch.rocket ||
    !launch.launchDate
  ) {
    return res.status(400).json({ error: "Invalid inputs" });
  }

  launch.launchDate = new Date(req.body.launchDate);

  if (isNaN(launch.launchDate))
    return res.status(400).json({ error: "Invalid Date" });

  addNewLaunch(launch);
  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;

  if (!launchDoesExist(launchId)) {
    return res.status(404).json("launches not found!");
  }
  return res.status(200).json(abortLaunch(launchId));
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
