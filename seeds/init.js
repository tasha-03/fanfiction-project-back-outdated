/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("users").del();
  await knex("users").insert([
    {
      id: 1,
      login: "example",
      email: "example@example.example",
      password: "example",
    },
  ]);

  await knex("works").del();
  await knex("works").insert([
    {
      id: 1,
      title: "example",
      author_id: 1,
      rating: "general",
      category: "gen",
      description: "example description",
      finished: true,
    },
  ]);
};
