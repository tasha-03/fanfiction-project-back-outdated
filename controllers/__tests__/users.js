const db = require("../../utils/db");

const ControllerException = require("../../utils/ControllerException");
const usersController = require("../users");

const users = [
    {login: "Fanfiction-Project", email: "tatyana.pavl5@gmail.com", password: "123456789"},
    {login: "test_user1", email: "fanfiction-project@mail.ru", password: "123456789"},
    {login: "fANFICTION_lOVER139", email: "@bamibi.com", password: "123456789"},
    {login: "test_user1", email: "wanoya4442@bamibi.com", password: "123456789"},
    {login: "test_user1", email: "wanoya4442@bamibi.com", password: "123456789"},
]

beforeEach(async () => {
    await db.seed.run({"specific": "admin_account.js"})
})

test("test", () => {
    expect(true).toBe(true);
})