/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema.createTable("fandom_category", (table) => {
    table
      .enu("category", [
        "anime_manga",
        "books_literature",
        "cartoons_comics_graphnovels",
        "celebrities_realpeople",
        "movies",
        "music_bands",
        "other",
        "theater",
        "tv",
        "videogames",
      ])
      .notNullable();
    table.integer("fandom_id").notNullable();
  });
  await knex.schema.alterTable("fandom_category", (table) => {
    table.primary(["category", "fandom_id"]);
    table
      .foreign("fandom_id")
      .references("fandoms.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("fandom_category");
};
