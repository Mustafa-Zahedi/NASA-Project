const {
  getAllLaunches,
  addNewLaunch,
  launchDoesExist,
  abortLaunch,
} = require("../../models/launches.model");

async function httpGetAllLaunches(_, res) {
  return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
  let launch = req.body;
  if (
    !launch.mission ||
    !launch.target ||
    !launch.rocket ||
    !launch.launchDate
  ) {
    return res.status(400).json({ error: "Missing required launch property" });
  }

  launch.launchDate = new Date(req.body.launchDate);

  if (isNaN(launch.launchDate))
    return res.status(400).json({ error: "Invalid Date" });

  const respons = await addNewLaunch(launch);
  console.log("res..", respons);
  if (respons) return res.status(201).json(launch);
  else return res.status(400).json({ error: "planet doesn't exist!" });
}

async function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;

  if (!(await launchDoesExist(launchId))) {
    return res.status(404).json("launches not found!");
  }
  const aborted = await abortLaunch(launchId);
  if (!aborted) return res.status(400).json({ error: "launch not aborted" });
  return res.status(200).json({ ok: true });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
