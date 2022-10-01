const request = require("supertest");
const app = require("../../app");

describe("Test GET /launches", () => {
  test("It should respond 200 success", async () => {
    const response = await request(app).get("/launches");
    expect(response.statusCode).toBe(200);
  });
});

describe("Test POST /launches", () => {
  const complateLaunchData = {
    mission: "USS 4321 -D",
    rocket: "KDD 32E2",
    target: "Kepler-32 S",
    launchDate: "july 30, 2034",
  };
  const complateLaunchDataWithInvalidDate = {
    mission: "USS 4321 -D",
    rocket: "KDD 32E2",
    target: "Kepler-32 S",
    launchDate: "abc",
  };
  const launchDataWithoutDate = {
    mission: "USS 4321 -D",
    rocket: "KDD 32E2",
    target: "Kepler-32 S",
  };

  test("It should respond with status code 201 Created", async () => {
    const response = await request(app)
      .post("/launches")
      .send(complateLaunchData)
      .expect("Content-Type", /json/)
      .expect(201);

    const requestDate = new Date(complateLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();
    expect(requestDate).toBe(responseDate);
    expect(response.body).toMatchObject(launchDataWithoutDate);
  });

  test("It should catch missing properies 400 Bad Request", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithoutDate)
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toStrictEqual({
      error: "Missing required launch property",
    });
  });

  test("It should catch invalid input Date 400 Bad Request", async () => {
    const response = await request(app)
      .post("/launches")
      .send(complateLaunchDataWithInvalidDate)
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toStrictEqual({ error: "Invalid Date" });
  });
});
