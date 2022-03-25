const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");
const tagsController = require("./tags");
const fandomsController = require("./fandoms");
const warningsController = require("./warnings");

exports.createWork = async ({
  title,
  authorId,
  rating = null,
  category = null,
  language = "english",
  description,
  note = null,
  finished = false,
  tags = [],
  fandoms = [],
  warnings = [],
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
    for (let i = 0; i < tags.length; i++) {
      await knex("tag_to_work").insert([
        {
          tag_id: tags[i],
          work_id: workId,
        },
      ]);
    }
    for (let i = 0; i < fandoms.length; i++) {
      await knex("fandom_to_work").insert([
        {
          fandom_id: fandoms[i],
          work_id: workId,
        },
      ]);
    }
    for (let i = 0; i < warnings.length; i++) {
      await knex("warning_to_work").insert([
        {
          warning_id: warnings[i],
          work_id: workId,
        },
      ]);
    }
    return { workId };
  } catch (error) {
    throw new ControllerException(
      "INTERNAL_SERVER_ERROR",
      "Internal server error"
    );
  }
};

exports.updateWork = async ({
  workId,
  authorId,
  title,
  rating,
  category,
  language,
  description,
  note,
  finished,
  tags,
  fandoms,
  warnings,
}) => {
  const [work] = await knex("works").select().where({ id: workId });
  if (!work) {
    throw new ControllerException("WORK_NOT_FOUND", "Work has not been found");
  } else {
    if (authorId !== work.author_id) {
      throw new ControllerException("ACCESS_DENIED", "Access denied");
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
      patch.updated_at = knex.fn.now();
      await knex("works").where({ id: workId }).update(patch);
      if (!tags === undefined) {
        const tagToWork = await knex("tag_to_work")
          .select()
          .where({ work_id: workId });
        for (let i = 0; i < tagToWork.length; i++) {
          if (!tags.includes(tagToWork[i].tag_id)) {
            await knex("tag_to_work")
              .where({ tag_id: tagToWork[i].tag_id, work_id: workId })
              .del();
          }
        }
        for (let i = 0; i < tags.length; i++) {
          const [tagToWork2] = await knex("tag_to_work")
            .select()
            .where({ tag_id: tags[i], work_id: workId });
          if (!tagToWork2) {
            await knex("tag_to_work").insert([
              { tag_id: tags[i], work_id: workId },
            ]);
          }
        }
      }
      if (!fandoms === undefined) {
        const fandomToWork = await knex("fandom_to_work")
          .select()
          .where({ work_id: workId });
        for (let i = 0; i < fandomToWork.length; i++) {
          if (!fandoms.includes(fandomToWork[i].fandom_id)) {
            await knex("fandom_to_work")
              .where({ fandom_id: fandomToWork[i].fandom_id, work_id: workId })
              .del();
          }
        }
        for (let i = 0; i < fandoms.length; i++) {
          const [fandomToWork2] = await knex("fandom_to_work")
            .select()
            .where({ fandom_id: fandoms[i], work_id: workId });
          if (!fandomToWork2) {
            await knex("fandom_to_work").insert([
              { fandom_id: fandoms[i], work_id: workId },
            ]);
          }
        }
      }
      if (!warnings === undefined) {
        const warningToWork = await knex("warning_to_work")
          .select()
          .where({ work_id: workId });
        for (let i = 0; i < warningToWork.length; i++) {
          if (!warnings.includes(warningToWork[i].warning_id)) {
            await knex("warning_to_work")
              .where({
                warning_id: warningToWork[i].warning_id,
                work_id: workId,
              })
              .del();
          }
        }
        for (let i = 0; i < warnings.length; i++) {
          const [warningToWork2] = await knex("warning_to_work")
            .select()
            .where({ warning_id: warnings[i], work_id: workId });
          if (!warningToWork2) {
            await knex("warning_to_work").insert([
              { warning_id: warnings[i], work_id: workId },
            ]);
          }
        }
      }
      return {};
    }
  }
};

exports.deleteWork = async ({ workId, authorId }) => {
  const [work] = await knex("works").select().where({ id: workId });
  if (!work) {
    throw new ControllerException("WORK_NOT_FOUND", "Work has not been found");
  } else {
    if (authorId !== work.author_id) {
      throw new ControllerException("ACCESS_DENIED", "Access denied");
    } else {
      await knex("works").where({ id: workId }).del();
      return {};
    }
  }
};

exports.getAllWorks = async ({
  limit = 20,
  page = 1,
  orderby = "updated_at",
  order = "desc",
}) => {
  const works = await knex("works")
    .select()
    .orderBy([
      { column: orderby, order: order },
      { column: "updated_at", order: "desc" },
    ])
    .limit(limit)
    .offset(limit * (page - 1));
  return works;
};

exports.getWorkById = async ({ workId }) => {
  const [work] = await knex("works").select().where({ id: workId });
  if (!work) {
    throw new ControllerException("WORK_NOT_FOUND", "Work has not been found");
  } else {
    const parts = await knex("parts").select().where({ work_id: workId });
    work.parts = parts;
    const tags = await knex("tag_to_work")
      .select("tag_id")
      .where({ work_id: workId });
    work.tags = [];
    for (let i = 0; i < tags.length; i++) {
      work.tags.push(
        await tagsController.getTagById({ tagId: tags[i].tag_id })
      );
    }
    const fandoms = await knex("fandom_to_work")
      .select("fandom_id")
      .where({ work_id: workId });
    work.fandoms = [];
    for (let i = 0; i < fandoms.length; i++) {
      work.fandoms.push(
        await fandomsController.getFandomById({
          fandomId: fandoms[i].fandom_id,
        })
      );
    }
    const warnings = await knex("warning_to_work")
      .select("warning_id")
      .where({ work_id: workId });
    work.warnings = [];
    for (let i = 0; i < warnings.length; i++) {
      work.warnings.push(
        await warningsController.getWarningById({
          warningId: warnings[i].warning_id,
        })
      );
    }
    return work;
  }
};

exports.getWorksByAuthorId = async ({ authorId }) => {
  const works = await knex("works").select().where({ author_id: authorId });
  return works;
};
