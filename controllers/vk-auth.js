const { buildQueryString } = require("../utils/buildQueryString");
const axios = require("axios");
const knex = require("../utils/db");

exports.getAccessToken = async (code) => {
  const response = await axios
    .get(
      `https://oauth.vk.com/access_token${buildQueryString([
        { code: code },
        { client_id: process.env.VK_APP_CLIENT_ID },
        { client_secret: process.env.VK_APP_SECURE_KEY },
        { redirect_uri: "http://localhost:3000/vk-confirm" },
      ])}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .catch((err) => console.error(err.request.data.error));

  console.log("response:\n", response.data);

  const data = await axios
    .get(
      `https://api.vk.com/method/users.get${buildQueryString([
        { access_token: response.data.access_token },
        { fields: ["screen_name", "nickname", "name"].join(",") },
      ])}&v=5.103`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .catch((err) => console.error(err.request.data.error));

  console.log(data.data);

  const { id, first_name, screen_name } = data.data.response[0];
  try {
    const { userId } = await knex("users")
      .insert({
        login: screen_name || first_name.toLowerCase() + "_" + id,
        email: response.data.email,
        password: null,
      })
      .returning("id as userId");
    console.log("Registered new user");
    console.log(userId);
    return { userId };
  } catch (err) {
    console.log(response.data.email);
    const userId = await knex("users")
      .select("id as userId")
      .where("email", response.data.email);
    console.log(userId);
    console.log("Logging in");
    return { userId };
  }
};
