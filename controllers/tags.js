const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

exports.createTag = async ({ name }) => {
  await knex("tags").insert([
    {
      name,
    },
  ]);
  return {}
};

exports.updateTag = async ({ tagId, name }) => {
  const [record] = await knex("tags").select("id").where({ id: tagId });
  if (!record) {
    throw new ControllerException("TAG_NOT_FOUND", "Tag has not been found");
  }
  await knex("tags").where({ id: tagId }).update({ name });
  return {}
};

exports.deleteTag = async ({ tagId }) => {
    const [record] = await knex("tags").select("id").where({ id: tagId });
  if (!record) {
    throw new ControllerException("TAG_NOT_FOUND", "Tag has not been found");
  }
  await knex("tags").where({ id: tagId }).del();
  return {}
};

exports.getTagById = async ({ tagId }) => {};

exports.getTagByName = async ({ name }) => {};

exports.getAllTags = async () => {};
