/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema.alterTable("users", (table) => {
    table.string("login").unique().alter();
    table.string("email").unique().alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  await knex.schema.alterTable("users", (table) => {
    table.dropUnique("login");
    table.dropUnique("email");
  });
};
