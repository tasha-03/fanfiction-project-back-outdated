const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

exports.createPart = async ({
  // DONE
  workId,
  authorId,
  title,
  description = null,
  note = null,
  text,
  order,
  isVisible = false,
}) => {
  const recAuthorId = (
    await knex("works").select("author_id").where({ id: workId })
  )[0].author_id;
  if (authorId !== recAuthorId) {
    throw new ControllerException("ACCESS_DENIED", "Access denied");
  }
  const [part] = await knex("parts")
    .select("id", "order")
    .where({ work_id: workId, order: order });
  if (part) {
    const parts = await knex("parts")
      .select("id as partId", "order")
      .where({ work_id: workId })
      .where("order", ">", part.order - 1)
      .orderBy("order", "desc");
    for (let i = 0; i < parts.length; i++) {
      await knex("parts")
        .where({ id: parts[i].partId })
        .update({ order: parts[i].order + 1 });
    }
    console.log("order changed");
  }
  const [{ id: partId }] = await knex("parts")
    .insert([
      {
        work_id: workId,
        title,
        description,
        note,
        text,
        order,
        is_visible: isVisible,
      },
    ])
    .returning("id");
  await knex("works")
    .where({ id: workId })
    .update({ updated_at: knex.fn.now() });
  return { partId };
};

exports.updatePart = async ({
  // DONE
  partId,
  authorId,
  title,
  description,
  note,
  text,
  isVisible,
}) => {
  const [part] = await knex("parts").select("id").where({ id: partId });
  const recAuthorId = await knex("works")
    .select("author_id")
    .where({ id: part.work_id });
  if (authorId !== recAuthorId) {
    throw new ControllerException("ACCESS_DENIED", "Access denied");
  }
  if (!part) {
    throw new ControllerException("PART_NOT_FOUND", "Part has not been found");
  } else {
    const patch = {};
    if (title !== undefined) {
      patch.title = title;
    }
    if (description !== undefined) {
      patch.description = description;
    }
    if (note !== undefined) {
      patch.note = note;
    }
    if (text !== undefined) {
      patch.text = text;
    }
    if (isVisible !== undefined) {
      patch.is_visible = isVisible;
    }
    await knex("parts").where({ id: partId }).update(patch);
    return {};
  }
};

exports.deletePart = async ({ partId, authorId }) => {
  // DONE
  const [part] = await knex("parts").select("id").where({ id: partId });
  const recAuthorId = await knex("works")
    .select("author_id")
    .where({ id: part.work_id });
  if (authorId !== recAuthorId) {
    throw new ControllerException("ACCESS_DENIED", "Access denied");
  }
  if (!part) {
    throw new ControllerException("PART_NOT_FOUND", "Part has not been found");
  } else {
    await knex("works").where({ id: partId }).del();
    return {};
  }
};

exports.getPartById = async ({ partId }) => {
  // DONE
  const [part] = await knex("parts")
    .select("*")
    .where({ id: partId, is_visible: true });
  if (!part) {
    throw new ControllerException("PART_NOT_FOUND", "Part has not been found");
  } else {
    return part;
  }
};

exports.getPartsByWorkId = async ({ workId }) => {
  // DONE
  const [work] = await knex("works").select("id").where({ id: workId });
  if (!work) {
    throw new ControllerException("WORK_NOT_FOUND", "Work has not been found");
  } else {
    const parts = await knex("parts")
      .select("*")
      .where({ work_id: workId, is_visible: true });
    return parts;
  }
};

exports.getAllPartsByWorkId = async ({ workId, authorId }) => {
  // DONE
  const [work] = await knex("works")
    .select("id", "author_id")
    .where({ id: workId });
  if (!work) {
    throw new ControllerException("WORK_NOT_FOUND", "Work has not been found");
  } else {
    if (authorId !== work.author_id) {
      throw new ControllerException("ACCESS_DENIED", "Access denied");
    }
    const parts = await knex("parts")
      .select("*")
      .where({ work_id: workId })
      .orderBy([{ column: "order", order: "asc" }]);
    return parts;
  }
};

exports.setPartsOrder = async ({ workId, order, authorId }) => {
  // DONE
  const recAuthorId = await knex("works")
    .select("author_id")
    .where({ id: workId });
  if (authorId !== recAuthorId) {
    throw new ControllerException("ACCESS_DENIED", "Access denied");
  }
  const [work] = await knex("works").select("id").where({ id: workId });
  if (!work) {
    throw new ControllerException("WORK_NOT_FOUND", "Work has not been found");
  } else {
    for (let i = 0; i < order.length; i++) {
      await knex("parts")
        .where({ id: order[i].partId })
        .update({ order: order[i].position });
    }
    return {};
  }
};
