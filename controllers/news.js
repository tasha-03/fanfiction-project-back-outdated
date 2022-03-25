const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

exports.createNews = async ({ authorId, text }) => {
  await knex("news").insert({ author_id: authorId, text: text });
  return {};
};

exports.updateNews = async ({ newsId, text }) => {
  const [news] = await knex("news").select("id").where({ id: newsId });
  if (!news) {
    throw new ControllerException("NEWS_NOT_FOUND", "News have not been found");
  }
  await knex("news")
    .where({ id: newsId })
    .update({ text: text, updated_at: knex.fn.now() });
  return {};
};

exports.deleteNews = async ({ newsId }) => {
  const [news] = await knex("news").select("id").where({ id: newsId });
  if (!news) {
    throw new ControllerException(
      "INTERNAL_SERVER_ERROR",
      "Internal server error"
    );
  }
  await knex("news").where({ id: newsId }).del();
  return {};
};

exports.getAllNews = async ({ limit = 20, page = 1 }) => {
  const news = await knex("news")
    .select()
    .limit(limit)
    .offset(limit * (page - 1));
  if (!news) {
    throw new ControllerException("NEWS_NOT_FOUND", "News have not been found");
  } else {
    return news;
  }
};

exports.getNewsById = async ({ newsId }) => {
  const [news] = await knex("news").select().where({ id: newsId });
  if (!news) {
    throw new ControllerException("NEWS_NOT_FOUND", "News have not been found");
  } else {
    return news;
  }
};

exports.getNewsByAuthorId = async ({ authorId, limit = 20, page = 1 }) => {
  const [author] = await knex("users").select().where({ id: authorId });
  if (!author) {
    throw new ControllerException(
      "INTERNAL_SERVER_ERROR",
      "Internal server error"
    );
  } else {
    const news = await knex("news")
      .select()
      .where({ author_id: authorId })
      .limit(limit)
      .offset(limit * (page - 1));
    return news;
  }
};
