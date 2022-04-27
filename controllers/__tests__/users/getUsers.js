const db = require("../../../utils/db");

const ControllerException = require("../../../utils/ControllerException");
const usersController = require("../../users");
const { checkPass } = require("../../../utils/passHashing");

var userId;

const users = {
  reg0: {
    login: "fANFICTION_lOVER139",
    email: "tanya.sha5@gmail.com",
    password: "123456789",
  },
  reg1: {
    login: "test_user1",
    email: "tatyana.pavl5@gmail.com",
    password: "123456789",
  },
  reg2: {
    login: "test_user2",
    email: "tatyana.pavl02@gmail.com",
    password: "123456789",
  },
  reg3: {
    login: "test_user3",
    email: "tatyana.pavl03@gmail.com",
    password: "123456789",
  },
  reg4: {
    login: "test_user4",
    email: "tatyana.pavl04@gmail.com",
    password: "123456789",
  },
};

beforeAll(async () => {
  await db.seed.run({ specific: "wipe.js" }, (e) => console.log(e));
  await db.seed.run({ specific: "admin_account.js" }, (e) => console.log(e));
  await usersController.register(users.reg0);
  await usersController.register(users.reg1);
  await usersController.register(users.reg2);
  await usersController.register(users.reg3);
  await usersController.register(users.reg4);
  userId = (
    await db
      .select("id as userId")
      .from("users")
      .where({ login: "fanfiction-project" })
  )[0].userId;
});

afterAll(async () => {
  await db.seed.run({ specific: "wipe.js" }, (e) => console.log(e));
  await db.seed.run({ specific: "admin_account.js" }, (e) => console.log(e));
});

test("#1 Get all users", async () => {
  const result = await usersController.getUsersByLogin({ limit: 3 });
  expect(result).toContainEqual({
    userId: expect.any(Number),
    login: expect.any(String),
  });
  expect(result.length).toBeLessThanOrEqual(3);
});

test("#2 Get user by id", async () => {
  expect(await usersController.getUserById({ userId })).toMatchObject({
    userId: expect.any(Number),
    login: expect.any(String),
    role: expect.stringMatching(/ADMIN|USER/),
    emailIsConfirmed: expect.any(Boolean),
    createdAt: expect.any(Object),
  });
});

test("#3 Get users by login", async () => {
  const result = await usersController.getUsersByLogin({ login: "est_use" });
  expect(result).toHaveLength(4);
  expect(result[0].login).toBe(users.reg1.login);
});

test("#4 Get non-existing user", async () => {
  const result = await usersController
    .getUserById({ userId: userId - 1 })
    .catch((err) => err);
  expect(result).toEqual(expect.any(ControllerException));
  expect(result.exceptionCode).toBe("USER_NOT_FOUND");
});
