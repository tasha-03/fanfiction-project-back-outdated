const db = require("../../utils/db");

const ControllerException = require("../../utils/ControllerException");
const usersController = require("../users");

const users = [
  {
    login: "Fanfiction-Project",
    email: "tatyana.pavl5@gmail.com",
    password: "123456789",
  },
  {
    login: "test_user1",
    email: "fanfiction-project@mail.ru",
    password: "123456789",
  },
  {
    login: "fANFICTION_lOVER139",
    email: "tatyana.pavl5@gmail.com",
    password: "123456789",
  },
  {
    login: "test_user2",
    email: "tatyana.pavl5@gmail.com",
    password: "123456789",
  },
  {
    login: "test_user3",
    email: "tatyana.pavl5@gmail.com",
    password: "123456789",
  },
];

beforeEach(async () => {
  await db.seed.run({ specific: "wipe.js" }, (e) => console.log(e));
  await db.seed.run({ specific: "admin_account.js" }, (e) => console.log(e));
});

test("#1 Logging in", async () => {
  expect(
    await usersController.login({
      login: "FANFICTION-PROJECT",
      password: "fanfiction-project",
    })
  ).toMatchObject({ userId: expect.any(Number) });
});

test("#2 Logging in with wrongly cased password", async () => {
  const result = await usersController
    .login({
      login: "FANFICTION-PROJECT",
      password: "Fanfiction-project",
    })
    .catch((err) => err);
  console.log(result);
  expect(result).toEqual(expect.any(ControllerException));
  expect(result.exceptionCode).toBe("WRONG_CREDENTIALS");
});
