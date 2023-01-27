const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");
const worksController = require("./works");

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
    console.log(err)
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

exports.getTagsByName = async ({
  name,
  category = "all",
  limit = 20,
  page = 1,
}) => {
  if (["character", "relationship", "other", "all"].includes(category)) {
    if (category === "all") {
      const tags = await knex("tags")
        .select()
        .where("name", "ilike", `%${name}%`)
        .limit(limit)
        .offset(limit * (page - 1))
        .orderBy([{ column: "name", order: "asc" }]);
      return tags;
    } else {
      const tags = await knex("tags")
        .select()
        .where("name", "ilike", `%${name}%`)
        .andWhere("category", category)
        .limit(limit)
        .offset(limit * (page - 1))
        .orderBy([{ column: "name", order: "asc" }]);
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

exports.getWorksByTagId = async ({ tagId, limit, page }) => {
  const worksIds = await knex("tag_to_work")
    .select("work_id as workId")
    .where({ tag_id: tagId })
    .limit(limit)
    .offset(limit * (page - 1));
  const works = [];
  for (let i = 0; i < worksIds.length; i++) {
    const work = await worksController.getWorkById({
      workId: worksIds[i].workId,
    });
    if (!work) continue;
    works.push(work);
  }
  return works;
};
