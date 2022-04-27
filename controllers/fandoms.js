const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

exports.createFandom = async ({ name, categories = [] }) => {
  try {
    const [{ id: fandomId }] = await knex("fandoms")
      .insert([
        {
          name,
        },
      ])
      .returning("id");
    for (let i = 0; i < categories.length; i++) {
      await knex("fandom_category").insert([
        { category: categories[i], fandom_id: fandomId },
      ]);
    }
  } catch (err) {
    throw new ControllerException(
      "CATEGORY_NOT_FOUND",
      "Category has not been found"
    );
  }
  return {};
};

exports.updateFandom = async ({ fandomId, name, categories }) => {
  const [fandom] = await knex("fandoms").select("id").where({ id: fandomId });
  if (!fandom) {
    throw new ControllerException(
      "FANDOM_NOT_FOUND",
      "Fandom has not been found"
    );
  } else {
    const patch = {};
    if (name !== undefined) {
      patch.name = name;
    }
    patch.updated_at = knex.fn.now();
    await knex("fandoms").where({ id: fandomId }).update(patch);
    const records = await knex("fandom_category")
      .select()
      .where({ fandom_id: fandomId });
    for (let i = 0; i < records.length; i++) {
      if (!categories.includes(records[i].category)) {
        await knex("fandom_category")
          .where({ category: records[i].category, fandom_id: fandomId })
          .del();
      }
    }
    for (let i = 0; i < categories.length; i++) {
      const [record2] = await knex("fandom_category")
        .select()
        .where({ category: categories[i], fandom_id: fandomId });
      if (!record2) {
        await knex("fandom_category").insert([
          { category: categories[i], fandom_id: fandomId },
        ]);
      }
    }
    return {};
  }
};

exports.deleteFandom = async ({ fandomId }) => {
  const [fandom] = await knex("fandoms").select("id").where({ id: fandomId });
  if (!fandom) {
    throw new ControllerException(
      "FANDOM_NOT_FOUND",
      "Fandom has not been found"
    );
  }
  await knex("fandoms").where({ id: fandomId }).del();
  return {};
};

exports.getFandomById = async ({ fandomId }) => {
  const [fandom] = await knex("fandoms").select().where({ id: fandomId });
  if (!fandom) {
    throw new ControllerException(
      "FANDOM_NOT_FOUND",
      "Fandom has not been found"
    );
  } else {
    return fandom;
  }
};

exports.getFandomsByName = async ({ name }) => {
  const fandoms = await knex("fandoms")
    .select()
    .where("name", "ilike", `%${name}%`)
    .limit(20);
  return fandoms;
};

exports.getFandomByCategory = async ({ category, limit = 100, page = 1 }) => {
  const ids = await knex("fandom_category")
    .select("fandom_id as fandomId")
    .where({ category: category });
  const fandoms = [];
  for (let i = 0; i < ids.length; i++) {
    const [fandom] = await knex("fandoms")
      .select()
      .where({ id: ids[i].fandomId });
    fandoms.push(fandom);
  }
  fandoms.sort((a, b) => {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else if (a === b) {
      return 0;
    }
  });
  return fandoms.slice((page - 1) * limit, (page - 1) * limit + limit);
};

exports.getAllFandoms = async () => {
  const fandoms = await knex("fandoms").select();
  return fandoms;
};
