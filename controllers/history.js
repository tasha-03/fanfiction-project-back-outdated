const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");
const worksController = require("./works");

exports.createRecord = async ({ userId, workId }) => {
  const [record] = await knex("history")
    .select()
    .where({ user_id: userId, work_id: workId });
  if (!record) {
    const work = await worksController.getWorkById({ workId });
    if (!work) return {};
    await knex("history").insert([
      {
        user_id: userId,
        work_id: workId,
        timestamp: knex.fn.now(),
      },
    ]);
  } else {
    await knex("history")
      .update({ timestamp: knex.fn.now() })
      .where({ user_id: userId, work_id: workId });
  }
  return {};
};

exports.deleteRecord = async ({ recordId, userId }) => {
  const [record] = await knex("history")
    .select()
    .where({ id: recordId, user_id: recUserId });
  if (!record) {
    throw new ControllerException(
      "RECORD_NOT_FOUND",
      "Record has not been found"
    );
  } else {
    if (userId !== recUserId) {
      throw new ControllerException("ACCESS_DENIED", "Access denied");
    } else {
      await knex("history").where({ id: recordId }).del();
      return {};
    }
  }
};

exports.returnHistory = async ({ userId, limit = 20, page = 1 }) => {
  const worksIds = await knex("history")
    .select("work_id as workId", "timestamp")
    .where({ user_id: userId })
    .orderBy("timestamp", "desc")
    .limit(limit)
    .offset(limit * (page - 1));
  console.log(worksIds);
  const works = [];
  for (let i = 0; i < worksIds.length; i++) {
    const work = await worksController.getWorkById({
      workId: worksIds[i].workId,
    });
    if (!work) continue;
    work.visited = worksIds[i].timestamp;
    works.push(work);
  }
  return works;
};
