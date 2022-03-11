/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema.alterTable("tags", (table) => {
      table.enu("category", ["character", "relationship", "other"]).notNullable().defaultTo("other");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  await knex.schema.alterTable("tags", (table) => {
      table.dropColumn("category");
  })
};
