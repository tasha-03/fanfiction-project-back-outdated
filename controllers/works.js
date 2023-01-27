const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");
const tagsController = require("./tags");
const fandomsController = require("./fandoms");
const warningsController = require("./warnings");
const usersController = require("./users");

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
    console.log("work created");
    for (let i = 0; i < tags.length; i++) {
      await knex("tag_to_work").insert([
        {
          tag_id: tags[i],
          work_id: workId,
        },
      ]);
    }
    console.log("tags assigned", tags);
    for (let i = 0; i < fandoms.length; i++) {
      await knex("fandom_to_work").insert([
        {
          fandom_id: fandoms[i],
          work_id: workId,
        },
      ]);
    }
    console.log("fandoms assigned", fandoms);
    for (let i = 0; i < warnings.length; i++) {
      await knex("warning_to_work").insert([
        {
          warning_id: warnings[i],
          work_id: workId,
        },
      ]);
    }
    console.log("warnings assigned", warnings);
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
  isVisible,
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
      if (isVisible !== undefined) {
        patch.is_visible = isVisible;
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
  const worksIds = await knex("works")
    .select(["id as workId"])
    .orderBy([
      { column: orderby, order: order },
      { column: "updated_at", order: "desc" },
    ])
    .where({ is_visible: true })
    .limit(limit)
    .offset(limit * (page - 1));
  const [{ pageCount }] = await knex("works")
    .count("* as pageCount")
    .where({ is_visible: true });
  const works = [];
  for (let i = 0; i < worksIds.length; i++) {
    const work = await this.getWorkById({ workId: worksIds[i].workId });
    works.push(work);
  }
  return {
    works,
    pageCount:
      Math.floor(Number(pageCount) / limit) < 1
        ? 1
        : Math.floor(Number(pageCount) / limit) + 1,
  };
};

exports.getWorkById = async ({ workId }) => {
  const [work] = await knex("works")
    .select([
      "id as workId",
      "title",
      "author_id as authorId",
      "rating",
      "category",
      "language",
      "description",
      "note",
      "finished",
      "created_at as createdAt",
      "updated_at as updatedAt",
    ])
    .where({ id: workId, is_visible: true });
  if (!work) {
    return {};
  } else {
    const authorName = (
      await usersController.getUserById({ userId: work.authorId })
    ).login;
    work.author = {};
    if (!authorName) {
      work.author.id = work.authorId;
      work.author.login = "Deleted Profile";
    }
    work.author.id = work.authorId;
    work.author.login = authorName;
    delete work.authorId;
    const parts = await knex("parts")
      .select()
      .where({ work_id: workId, is_visible: true })
      .orderBy("order", "asc");
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

exports.getWorksByAuthorLogin = async ({ login, limit = 20, page = 1 }) => {
  const user = await usersController.getUserByLogin({ login });
  const worksIds = await knex("works")
    .select("id as workId")
    .where({ author_id: user.userId, is_visible: true })
    .orderBy("updated_at", "desc")
    .limit(limit)
    .offset(limit * (page - 1));
  const works = [];
  for (let i = 0; i < worksIds.length; i++) {
    const work = await this.getWorkById({ workId: worksIds[i].workId });
    works.push(work);
  }
  return works;
};

exports.getMyDrafts = async ({ userId, limit = 20, page = 1 }) => {
  const worksIds = await knex("works")
    .select("id as workId")
    .where({ author_id: userId, is_visible: false })
    .orderBy("updated_at", "desc")
    .limit(limit)
    .offset(limit * (page - 1));
  const works = [];
  for (let i = 0; i < worksIds.length; i++) {
    const work = await this.getMyWorkById({
      workId: worksIds[i].workId,
      userId,
    });
    works.push(work);
  }
  return works;
};

exports.getMyWorkById = async ({ workId, userId }) => {
  const [work] = await knex("works")
    .select([
      "id as workId",
      "title",
      "author_id as authorId",
      "rating",
      "category",
      "language",
      "description",
      "note",
      "finished",
      "created_at as createdAt",
      "updated_at as updatedAt",
      "is_visible as isVisible",
    ])
    .where({ id: workId, author_id: userId });
  if (!work) {
    return {};
  } else {
    const authorName = (
      await usersController.getUserById({ userId: work.authorId })
    ).login;
    work.author = {};
    if (!authorName) {
      work.author.id = work.authorId;
      work.author.login = "Deleted Profile";
    }
    work.author.id = work.authorId;
    work.author.login = authorName;
    delete work.authorId;
    const parts = await knex("parts")
      .select()
      .where({ work_id: workId, is_visible: true })
      .orderBy("order", "asc");
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
