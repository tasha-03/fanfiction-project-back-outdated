/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema.alterTable("users", (table) => {
    table.boolean("dark_theme").notNullable().defaultTo(false);
    table.boolean("email_notifications_on").notNullable().defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  knex.schema.alterTable("users", (table) => {
    table.dropColumns(["dark_theme", "email_notifications_on"]);
  });
};
