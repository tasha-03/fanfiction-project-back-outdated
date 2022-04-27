const { hashPass } = require("../utils/passHashing");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("users").where({ login: "test_user1" }).del();
  await knex("users").where({ login: "test_user2" }).del();
  await knex("users").where({ login: "test_user3" }).del();
  await knex("users").where({ login: "test_user4" }).del();
  await knex("users").insert([
    {
      login: "test_user1".toLowerCase(),
      email: "tatyana.pavl5@gmail.com".toLowerCase(),
      password: await hashPass("QWESZXCqweszxc123!"),
      role: "USER",
      email_is_confirmed: true,
    },
    {
      login: "test_user2".toLowerCase(),
      email: "tatyana.pavl02@gmail.com".toLowerCase(),
      password: await hashPass("QWESZXCqweszxc123!"),
      role: "USER",
      email_is_confirmed: true,
    },

    {
      login: "test_user3".toLowerCase(),
      email: "tatyana.pavl03@gmail.com".toLowerCase(),
      password: await hashPass("QWESZXCqweszxc123!"),
      role: "USER",
      email_is_confirmed: true,
    },
    {
      login: "test_user4".toLowerCase(),
      email: "tatyana.pavl04@gmail.com".toLowerCase(),
      password: await hashPass("QWESZXCqweszxc123!"),
      role: "USER",
      email_is_confirmed: true,
    },
  ]);
};
