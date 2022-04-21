/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("work_to_collection").del();
  await knex("work_to_series").del();
  await knex("warning_to_work").del();
  await knex("fandom_to_work").del();
  await knex("tag_to_collection").del();
  await knex("tag_to_series").del();
  await knex("tag_to_work").del();
  await knex("favourite_collections").del();
  await knex("favourite_series").del();
  await knex("favourite_works").del();
  await knex("favourite_authors").del();
  await knex("history").del();
  await knex("collections").del();
  await knex("series").del();
  await knex("warnings").del();
  await knex("fandoms").del();
  await knex("tags").del();
  await knex("comments").del();
  await knex("parts").del();
  await knex("news").del();
  await knex("works").del();
  await knex("users").del();
};
