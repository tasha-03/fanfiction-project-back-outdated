/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  // creating main tables

  await knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("login").notNullable();
    table.string("email").notNullable();
    table.boolean("email_is_confirmed").notNullable().defaultTo(false);
    table.string("email_confirmation_code", 6);
    table.string("password");
    table.boolean("active").notNullable().defaultTo(true);
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    table.enu("role", ["USER", "ADMIN"]).notNullable().defaultTo("USER");
  });

  await knex.schema.createTable("works", (table) => {
    table.increments("id");
    table.string("title").notNullable();
    table.integer("author_id").notNullable();
    table.enu("rating", ["general", "teenage", "mature", "explicit"]);
    table.enu("category", ["gen", "f/m", "m/m", "f/f", "other"]);
    table
      .enu("language", [
        "russian",
        "english",
        "german",
        "spanish",
        "chinese",
        "arabic",
        "japanese",
        "portuguese",
        "turkish",
        "korean",
        "french",
        "italian",
        "polish",
        "sindarin",
        "klingon",
        "gallifreyan",
      ])
      .notNullable()
      .defaultTo("english");
    table.text("description").notNullable();
    table.text("note");
    table.boolean("finished").notNullable().defaultTo(false);
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("news", (table) => {
    table.increments("id");
    table.integer("author_id").notNullable();
    table.text("text").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("parts", (table) => {
    table.increments("id");
    table.integer("work_id").notNullable();
    table.text("description").notNullable();
    table.text("note");
    table.text("text").notNullable();
    table.integer("order").notNullable();
    table.boolean("is_visible").notNullable().defaultTo(false);
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("comments", (table) => {
    table.increments("id");
    table.integer("part_id").notNullable();
    table.integer("author_id").notNullable();
    table.text("text").notNullable();
    table.integer("parent_id");
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("tags", (table) => {
    table.increments("id");
    table.string("name").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("fandoms", (table) => {
    table.increments("id");
    table.string("name").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("warnings", (table) => {
    table.increments("id");
    table.string("name").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("series", (table) => {
    table.increments("id");
    table.string("title").notNullable();
    table.integer("owner_id").notNullable();
    table.text("description").notNullable();
    table.text("note");
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("collections", (table) => {
    table.increments("id");
    table.string("title").notNullable();
    table.integer("owner_id").notNullable();
    table.text("description").notNullable();
    table.text("note");
    table.boolean("is_visible").notNullable().defaultTo(true);
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  // altering main tables

  await knex.schema.alterTable("news", (table) => {
    table
      .foreign("author_id")
      .references("users.id")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
  });

  await knex.schema.alterTable("works", (table) => {
    table
      .foreign("author_id")
      .references("users.id")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
  });

  await knex.schema.alterTable("parts", (table) => {
    table
      .foreign("work_id")
      .references("works.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });

  await knex.schema.alterTable("comments", (table) => {
    table
      .foreign("part_id")
      .references("parts.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .foreign("parent_id")
      .references("comments.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });

  await knex.schema.alterTable("series", (table) => {
    table
      .foreign("owner_id")
      .references("users.id")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
  });

  await knex.schema.alterTable("collections", (table) => {
    table
      .foreign("owner_id")
      .references("users.id")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
  });

  // creating subsequent tables

  await knex.schema.createTable("history", (table) => {
    table.increments("id");
    table.integer("user_id").notNullable();
    table.integer("work_id").notNullable();
    table.timestamp("timestamp").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable("history", (table) => {
    table
      .foreign("user_id")
      .references("users.id")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
    table
      .foreign("work_id")
      .references("works.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });

  await knex.schema.createTable("favourite_authors", (table) => {
    table.integer("user_id").notNullable();
    table.integer("author_id").notNullable();
  });

  await knex.schema.alterTable("favourite_authors", (table) => {
    table.primary(["user_id", "author_id"]);
    table
      .foreign("user_id")
      .references("users.id")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
    table
      .foreign("author_id")
      .references("users.id")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
  });

  await knex.schema.createTable("favourite_works", (table) => {
    table.integer("user_id").notNullable();
    table.integer("work_id").notNullable();
  });

  await knex.schema.alterTable("favourite_works", (table) => {
    table.primary(["user_id", "work_id"]);
    table
      .foreign("user_id")
      .references("users.id")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
    table
      .foreign("work_id")
      .references("works.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });

  await knex.schema.createTable("favourite_series", (table) => {
    table.integer("user_id").notNullable();
    table.integer("series_id").notNullable();
  });

  await knex.schema.alterTable("favourite_series", (table) => {
    table.primary(["user_id", "series_id"]);
    table
      .foreign("user_id")
      .references("users.id")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
    table
      .foreign("series_id")
      .references("series.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });

  await knex.schema.createTable("favourite_collections", (table) => {
    table.integer("user_id").notNullable();
    table.integer("collection_id").notNullable();
  });

  await knex.schema.alterTable("favourite_collections", (table) => {
    table.primary(["user_id", "collection_id"]);
    table
      .foreign("user_id")
      .references("users.id")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
    table
      .foreign("collection_id")
      .references("collections.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });

  await knex.schema.createTable("tag_to_work", (table) => {
    table.integer("tag_id").notNullable();
    table.integer("work_id").notNullable();
  });

  await knex.schema.alterTable("tag_to_work", (table) => {
    table.primary(["tag_id", "work_id"]);
    table
      .foreign("tag_id")
      .references("tags.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .foreign("work_id")
      .references("works.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });

  await knex.schema.createTable("tag_to_series", (table) => {
    table.integer("tag_id").notNullable();
    table.integer("series_id").notNullable();
  });

  await knex.schema.alterTable("tag_to_series", (table) => {
    table.primary(["tag_id", "series_id"]);
    table
      .foreign("tag_id")
      .references("tags.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .foreign("series_id")
      .references("series.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });

  await knex.schema.createTable("tag_to_collection", (table) => {
    table.integer("tag_id").notNullable();
    table.integer("collection_id").notNullable();
  });

  await knex.schema.alterTable("tag_to_collection", (table) => {
    table.primary(["tag_id", "collection_id"]);
    table
      .foreign("tag_id")
      .references("tags.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .foreign("collection_id")
      .references("collections.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });

  await knex.schema.createTable("warning_to_work", (table) => {
    table.integer("warning_id").notNullable();
    table.integer("work_id").notNullable();
  });

  await knex.schema.alterTable("warning_to_work", (table) => {
    table.primary(["warning_id", "work_id"]);
    table
      .foreign("warning_id")
      .references("warnings.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .foreign("work_id")
      .references("works.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });

  await knex.schema.createTable("fandom_to_work", (table) => {
    table.integer("fandom_id").notNullable();
    table.integer("work_id").notNullable();
  });

  await knex.schema.alterTable("fandom_to_work", (table) => {
    table.primary(["fandom_id", "work_id"]);
    table
      .foreign("fandom_id")
      .references("fandoms.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .foreign("work_id")
      .references("works.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });

  await knex.schema.createTable("work_to_series", (table) => {
    table.integer("series_id").notNullable();
    table.integer("work_id").notNullable();
    table.integer("order").notNullable();
  });

  await knex.schema.alterTable("work_to_series", (table) => {
    table.primary(["series_id", "work_id"]);
    table
      .foreign("series_id")
      .references("series.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .foreign("work_id")
      .references("works.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });

  await knex.schema.createTable("work_to_collection", (table) => {
    table.integer("collection_id").notNullable();
    table.integer("work_id").notNullable();
    table.integer("order").notNullable();
  });

  await knex.schema.alterTable("work_to_collection", (table) => {
    table.primary(["collection_id", "work_id"]);
    table
      .foreign("collection_id")
      .references("collections.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .foreign("work_id")
      .references("works.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("work_to_collection");
  await knex.schema.dropTableIfExists("work_to_series");
  await knex.schema.dropTableIfExists("warning_to_work");
  await knex.schema.dropTableIfExists("fandom_to_work");
  await knex.schema.dropTableIfExists("tag_to_collection");
  await knex.schema.dropTableIfExists("tag_to_series");
  await knex.schema.dropTableIfExists("tag_to_work");
  await knex.schema.dropTableIfExists("favourite_collections");
  await knex.schema.dropTableIfExists("favourite_series");
  await knex.schema.dropTableIfExists("favourite_works");
  await knex.schema.dropTableIfExists("favourite_authors");
  await knex.schema.dropTableIfExists("history");
  await knex.schema.dropTableIfExists("collections");
  await knex.schema.dropTableIfExists("series");
  await knex.schema.dropTableIfExists("warnings");
  await knex.schema.dropTableIfExists("fandoms");
  await knex.schema.dropTableIfExists("tags");
  await knex.schema.dropTableIfExists("comments");
  await knex.schema.dropTableIfExists("parts");
  await knex.schema.dropTableIfExists("news");
  await knex.schema.dropTableIfExists("works");
  await knex.schema.dropTableIfExists("users");
};
