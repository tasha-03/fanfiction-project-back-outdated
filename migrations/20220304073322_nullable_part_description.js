/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema.alterTable("parts", (table) => {
      table.text("description").nullable().alter()
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
    await knex.schema.alterTable("parts", (table) => {
        table.text("description").notNullable().defaultTo("").alter()
    })
};
