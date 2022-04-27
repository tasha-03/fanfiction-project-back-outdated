const db = require("../../../utils/db");

const ControllerException = require("../../../utils/ControllerException");
const usersController = require("../../users");

const users = {
  log0: {
    login: "fanfiction-project",
    password: "fanfiction-project",
  },
  log1: {
    login: "fanfiction-project",
    password: "Fanfiction-project",
  },
  log2: {
    login: "FANFICTION-PROJECT",
    password: "fanfiction-project",
  },
  log3: {
    login: "randomlogin",
    password: "1234567890",
  },
};

beforeEach(async () => {
  await db.seed.run({ specific: "wipe.js" }, (e) => console.log(e));
  await db.seed.run({ specific: "admin_account.js" }, (e) => console.log(e));
});

afterAll(async () => {
  await db.seed.run({ specific: "wipe.js" }, (e) => console.log(e));
  await db.seed.run({ specific: "admin_account.js" }, (e) => console.log(e));
});

test("#1 Logging in", async () => {
  expect(await usersController.login(users.log0)).toMatchObject({
    userId: expect.any(Number),
  });
});

test("#2 Logging in with wrongly cased password", async () => {
  const result = await usersController.login(users.log1).catch((err) => err);
  expect(result).toEqual(expect.any(ControllerException));
  expect(result.exceptionCode).toBe("WRONG_CREDENTIALS");
});

test("#3 Logging in with wrongly cased login", async () => {
  expect(await usersController.login(users.log2)).toMatchObject({
    userId: expect.any(Number),
  });
});

test("#4 Logging in with non-existing login", async () => {
  const result = await usersController.login(users.log3).catch((err) => err);
  expect(result).toEqual(expect.any(ControllerException));
  expect(result.exceptionCode).toBe("WRONG_CREDENTIALS");
});
