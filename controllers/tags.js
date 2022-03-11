const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

exports.createTag = async ({ name, category = "other" }) => {
  try {
    await knex("tags").insert([
      {
        name,
        category,
      },
    ]);
    return {};
  } catch (err) {
    throw new ControllerException(
      "CATEGORY_NOT_FOUND",
      "Category has not been found"
    );
  }
};

exports.updateTag = async ({ tagId, name, category }) => {
  const [record] = await knex("tags").select("id").where({ id: tagId });
  if (!record) {
    throw new ControllerException("TAG_NOT_FOUND", "Tag has not been found");
  } else {
    const patch = {};
    if (name !== undefined) {
      patch.name = name;
    }
    if (category !== undefined) {
      patch.category = category;
    }
    patch.updated_at = knex.fn.now();
    await knex("tags").where({ id: tagId }).update(patch);
    return {};
  }
};

exports.deleteTag = async ({ tagId }) => {
  const [record] = await knex("tags").select("id").where({ id: tagId });
  if (!record) {
    throw new ControllerException("TAG_NOT_FOUND", "Tag has not been found");
  }
  await knex("tags").where({ id: tagId }).del();
  return {};
};

exports.getTagById = async ({ tagId }) => {
  const [record] = await knex("tags").select().where({ id: tagId });
  if (!record) {
    throw new ControllerException("TAG_NOT_FOUND", "Tag has not been found");
  } else {
    return record;
  }
};

exports.getTagsByName = async ({ name, category = "all" }) => {
  if (["character", "relationship", "other", "all"].includes(category)) {
    if (category === "all") {
      const records = await knex("tags")
        .select()
        .where("name", "ilike", `%${name}%`);
      return records;
    } else {
      const records = await knex("tags")
        .select()
        .where("name", "ilike", `%${name}%`)
        .andWhere("category", category);
      return records;
    }
  } else {
    throw new ControllerException(
      "CATEGORY_NOT_FOUND",
      "Category has not been found"
    );
  }
};
