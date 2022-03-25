const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

exports.createRecord = async ({ userId, workId }) => {
  await knex("history").insert([
    {
      user_id: userId,
      work_id: workId,
      timestamp: knex.fn.now(),
    },
  ]);
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
