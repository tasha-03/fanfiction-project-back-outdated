const db = require("../../../utils/db");

const ControllerException = require("../../../utils/ControllerException");
const usersController = require("../../users");

const users = {
  reg0: {
    login: "fANFICTION_lOVER139",
    email: "tatyana.pavl5@gmail.com",
    password: "123456789",
  },
  reg1: {
    login: "test_user1",
    email: "fanfiction-project@mail.ru",
    password: "123456789",
  },
  reg2: {
    login: "Fanfiction-Project",
    email: "tatyana.pavl04@gmail.com",
    password: "123456789",
  },
  reg3: {
    login: "test_user2",
    email: "tatyana.pavl5@gmail.com",
    password: "123456789",
  },
  reg4: {
    login: "test_user3",
    email: "tatyana.pavl5@gmail.com",
    password: "123456789",
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

test("#1 Registering", async () => {
  expect(await usersController.register(users.reg0)).toMatchObject({
    userId: expect.any(Number),
  });
});

test("#2 Registering with existing email", async () => {
  const result = await usersController.register(users.reg1).catch((err) => err);
  expect(result).toEqual(expect.any(ControllerException));
  expect(result.exceptionCode).toBe("EMAIL_IN_USE");
});

test("#3 Registering with existing login", async () => {
  const result = await usersController.register(users.reg2).catch((err) => err);
  expect(result).toEqual(expect.any(ControllerException));
  expect(result.exceptionCode).toBe("LOGIN_IN_USE");
});
