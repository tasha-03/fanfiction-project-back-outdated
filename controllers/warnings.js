const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

exports.createWarning = async ({ name }) => {
  const [warning] = await knex("warnings").select().where({ name: name });
  if (!warning) {
    await knex("warnings").insert([
      {
        name,
      },
    ]);
  } else {
    throw new ControllerException(
      "WARNING_ALREADY_EXISTS",
      "Warning already exists"
    );
  }
  return {};
};

exports.updateWarning = async ({ warningId, name }) => {
  const [warning] = await knex("warnings").select().where({ id: warningId });
  if (!warning) {
    throw new ControllerException(
      "WARNING_NOT_FOUND",
      "Warning has not been found"
    );
  } else {
    const patch = {};
    if (name !== undefined) {
      patch.name = name;
    }
    patch.updated_at = knex.fn.now();
    await knex("warnings").where({ id: warningId }).update(patch);
    return {};
  }
};

exports.deleteWarning = async ({ warningId }) => {
  const [warning] = await knex("warnings").select().where({ id: warningId });
  if (!warning) {
    throw new ControllerException(
      "WARNING_NOT_FOUND",
      "Warning has not been found"
    );
  } else {
    await knex("warnings").where({ id: warningId }).del();
    return {};
  }
};

exports.getWarningById = async ({ warningId }) => {
  const [warning] = await knex("warnings").select().where({ id: warningId });
  if (!warning) {
    throw new ControllerException(
      "WARNING_NOT_FOUND",
      "Warning has not been found"
    );
  } else {
    return warning;
  }
};

exports.getWarningsByName = async ({ name }) => {
  const warnings = await knex("warnings")
    .select()
    .where("name", "ilike", `%${name}%`);
  return warnings;
};

exports.getAllWarnings = async () => {
  const warnings = await knex("warnings").select();
  return warnings;
};
