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
  const [tag] = await knex("tags").select("id").where({ id: tagId });
  if (!tag) {
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
  const [tag] = await knex("tags").select("id").where({ id: tagId });
  if (!tag) {
    throw new ControllerException("TAG_NOT_FOUND", "Tag has not been found");
  }
  await knex("tags").where({ id: tagId }).del();
  return {};
};

exports.getTagById = async ({ tagId }) => {
  const [tag] = await knex("tags")
    .select("id", "name", "category")
    .where({ id: tagId });
  if (!tag) {
    throw new ControllerException("TAG_NOT_FOUND", "Tag has not been found");
  } else {
    return tag;
  }
};

exports.getTagsByName = async ({ name, category = "all" }) => {
  if (["character", "relationship", "other", "all"].includes(category)) {
    if (category === "all") {
      const tags = await knex("tags")
        .select()
        .where("name", "ilike", `%${name}%`);
      return tags;
    } else {
      const tags = await knex("tags")
        .select()
        .where("name", "ilike", `%${name}%`)
        .andWhere("category", category);
      return tags;
    }
  } else {
    throw new ControllerException(
      "CATEGORY_NOT_FOUND",
      "Category has not been found"
    );
  }
};

exports.getAllTags = async () => {
  const tags = await knex("tags").select();
  return tags;
};
