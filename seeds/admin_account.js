const { hashPass } = require("../utils/passHashing");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("users").where({login: "fanfiction-project"}).del();
  await knex("users").insert({
    login: "Fanfiction-Project".toLowerCase(),
    email: "fanfiction-project@mail.ru".toLowerCase(),
    password: await hashPass("fanfiction-project"),
    role: "ADMIN",
    email_is_confirmed: true,
  });
};
