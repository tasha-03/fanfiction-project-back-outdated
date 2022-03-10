const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

exports.createWork = async ({ // handle tags, fandoms, warnings
  title,
  authorId,
  rating = null,
  category = null,
  language = "english",
  description,
  note = null,
  finished = false,
}) => {
  try {
    const [{ id: workId }] = await knex("works")
      .insert([
        {
          title,
          author_id: authorId,
          rating,
          category,
          language,
          description,
          note,
          finished,
        },
      ])
      .returning("id");
    return { workId };
  } catch (error) {
    throw new ControllerException(
      "INTERNAL_SERVER_ERROR",
      "Internal server error"
    );
  }
};

exports.updateWork = async ({ // handle tags, fandoms, warnings
  workId,
  title,
  rating,
  category,
  language,
  description,
  note,
  finished,
}) => {
  const [work] = await knex("works").select("id").where({ id: workId });
  if (!work) {
    throw new ControllerException("WORK_NOT_FOUND", "Work has not been found");
  } else {
    const patch = {};
    if (title !== undefined) {
      patch.title = title;
    }
    if (rating !== undefined) {
      patch.rating = rating;
    }
    if (category !== undefined) {
      patch.category = category;
    }
    if (language !== undefined) {
      patch.language = language;
    }
    if (description !== undefined) {
      patch.description = description;
    }
    if (note !== undefined) {
      patch.note = note;
    }
    if (finished !== undefined) {
      patch.finished = finished;
    }
    await knex("works").where({ id: workId }).update(patch);
    return {};
  }
};

exports.deleteWork = async ({ workId }) => {
  const [work] = await knex("works").select("id").where({ id: workId });
  if (!work) {
    throw new ControllerException("WORK_NOT_FOUND", "Work has not been found");
  } else {
    await knex("works").where({ id: workId }).del();
    return {};
  }
};

exports.getAllWorks = async ({ limit = 20, page = 1 }) => { // handle tags, fandoms, warnings
  const works = await knex("works")
    .select()
    .limit(limit)
    .offset(limit * (page - 1));
  return works;
};

exports.getWorkById = async ({ workId }) => { // handle tags, fandoms, warnings
  const [work] = await knex("works").select("*").where({ id: workId });
  if (!work) {
    throw new ControllerException("WORK_NOT_FOUND", "Work has not been found");
  } else {
    const parts = await knex("parts")
      .select("id", "title", "order")
      .where({ work_id: workId });
    work.parts = parts;
    return work.parts;
  }
};
