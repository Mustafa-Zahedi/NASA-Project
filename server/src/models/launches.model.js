const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("September 30, 2025"),
  target: "Kepler-442 b",
  customer: ["Z", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customer: ["Space X", "NASA"],
      upcoming: true,
      success: true,
    })
  );
}

function deleteLaunch(id) {
  let launch = [...launches.values()].filter(
    (launch) => +launch.flightNumber === 100
  )[0];
  [...launches.values()].filter((launch) =>
    console.log(launch.flightNumber, "ll")
  );

  if (launches.delete(+id)) return launch;
  else return { error: "can't delete this launch" };
}

module.exports = { getAllLaunches, addNewLaunch, deleteLaunch };
