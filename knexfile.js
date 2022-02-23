require('dotenv').config();

module.exports = {
  client: "pg",
  connection: {
    host: process.env.DB_CUSTOM_HOST,
    port: process.env.DB_CUSTOM_PORT,
    user: process.env.DB_CUSTOM_USER,
    password: process.env.DB_CUSTOM_PASSWORD,
    database: process.env.DB_CUSTOM_DATABASE,
  },
  migrations: {
    tableName: "knex_migrations",
  },
  seeds: {
    directory: "./seeds",
  }
};
