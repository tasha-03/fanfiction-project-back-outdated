const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");
const { generateCode } = require("../utils/confirmationCode");
const transporter = require("nodemailer");
const { hashPass, checkPass } = require("../utils/passHashing");

// register (any)
exports.register = async ({ login, email, password }) => {
  const [userWithLogin] = await knex("users")
    .select("id")
    .where({ login: login.toLowerCase() });
  if (userWithLogin) {
    throw new ControllerException("LOGIN_IN_USE", "Login is already in use");
  }
  const [userWithEmail] = await knex("users")
    .select("id")
    .where({ email: email.toLowerCase() });
  if (userWithEmail) {
    throw new ControllerException("EMAIL_IN_USE", "Email in use");
  }
  const [{ id: userId }] = await knex("users")
    .insert([
      {
        login: login.toLowerCase(),
        email: email.toLowerCase(),
        password: await hashPass(password),
      },
    ]) // password hashing
    .returning("id");
  return { userId };
};

// request email confirmation (user)
exports.requestEmailConfirmation = async ({ userId }) => {
  const confirmationCode = generateCode();
  const [user] = await knex("users")
    .select("email_is_confirmed as emailIsConfirmed")
    .where({ id: userId });
  if (!user) {
    throw new ControllerException(
      "INTERNAL_SERVER_ERROR",
      "Internal server error"
    );
  }
  if (user.emailIsConfirmed) {
    throw new ControllerException(
      "ALREADY_CONFIRMED",
      "Email has been already confirmed"
    );
  }
  const [{ email: email }] = await knex("users")
    .where({ id: userId })
    .update({
      email_confirmation_code: confirmationCode,
      updated_at: knex.fn.now(),
    })
    .returning("email");
  const transport = await transporter.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const message = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Fanfiction-Project Email Confirmation",
    html: `<p><i>A <b>confirmation code</b> for you there:</i></p>
           <p style="font-size:24px"><b>${confirmationCode}</b></p>
           <p>If you did not create an account on <a href="${process.env.SITE_URL}">${process.env.SITE_URL}</a>,
           <br/>please ignore this message</p>`,
  };
  await transport.sendMail(message, (err, info) => {
    if (err) {
      throw new ControllerException("MAIL_NOT_SENT", "Mail has not been sent");
    }
  });
  return {};
};

// confirm email (user)
exports.confirmEmail = async ({ userId, confirmationCode }) => {
  const [{ email_confirmation_code: emailConfirmationCode }] = await knex(
    "users"
  )
    .where({ id: userId })
    .returning("email_confirmation_code");
  if (emailConfirmationCode === confirmationCode) {
    await knex("users").where({ id: userId }).update({
      email_confirmation_code: null,
      email_is_confirmed: true,
      updated_at: knex.fn.now(),
    });
  } else {
    throw new ControllerException(
      "CONFIRMATION_CODE_IS_INVALID",
      "Confirmation code is invalid"
    );
  }
  return {};
};

// login (any)
exports.login = async ({ login, password }) => {
  const [user] = await knex("users")
    .select("id", "password as hashedPass")
    .where({ login: login.toLowerCase() });
  if (!user) {
    throw new ControllerException("WRONG_CREDENTIALS", "Wrong credentials");
  }
  if (!(await checkPass(password, user.hashedPass))) {
    throw new ControllerException("WRONG_CREDENTIALS", "Wrong credentials");
  } else {
    return { userId: user.id };
  }
};

// edit profile (user)
exports.editProfile = async ({ userId, login, email, password }) => {
  try {
    await knex("users").where({ id: userId }).update({
      login: login.toLowerCase(),
      email: email.toLowerCase(),
      password: password,
      updated_at: knex.fn.now(),
    });
    return {};
  } catch (error) {
    throw new ControllerException("LOGIN_IN_USE", "Email is in use");
  }
};

// change role (admin)
exports.changeRole = async ({ userId, role }) => {
  try {
    await knex("users").where({ id: userId }).update({
      role: role.toUpperCase(),
      updated_at: knex.fn.now(),
    });
    return {};
  } catch (error) {
    throw new ControllerException("USER_NOT_FOUND", "User has not been found");
  }
};

// deactivate profile (user)
exports.deactivateProfile = async ({ userId }) => {
  try {
    await knex("users").where({ id: userId }).update({
      active: false,
      updated_at: knex.fn.now(),
    });
    return {};
  } catch (error) {
    throw new ControllerException("USER_NOT_FOUND", "User has not been found");
  }
};

// activate profile (user)
exports.activateProfile = async ({ userId }) => {
  try {
    await knex("users").where({ id: userId }).update({
      active: true,
      updated_at: knex.fn.now(),
    });
    return {};
  } catch (error) {
    throw new ControllerException("USER_NOT_FOUND", "User has not been found");
  }
};

// change preferences (user)
exports.changePreferences = async ({
  userId,
  dark_theme,
  email_notitfications_on,
}) => {
  try {
    await knex("users").where({ id: userId }).update({
      dark_theme: dark_theme,
      email_notitfications_on: email_notitfications_on,
      updated_at: knex.fn.now(),
    });
    return {};
  } catch (error) {
    throw new ControllerException("USER_NOT_FOUND", "User has not been found");
  }
};

// request restore password (any)
exports.requestRestorePassword = async ({ login }) => {
  const confirmationCode = generateCode();
  const [{ email: email }] = await knex("users")
    .where({ login: login.toLowerCase() })
    .update({
      email_confirmation_code: confirmationCode,
      updated_at: knex.fn.now(),
    })
    .returning("email".toLowerCase());
  const transport = await transporter.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const message = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Fanfiction-Project Password Restore Request",
    html: `<p>Dear ${login.toLowerCase()}</p>
           <p><i>A <b>password restore code</b> for you there:</i></p>
           <p style="font-size:24px"><b>${confirmationCode}</b></p>
           <p>If you did not create an account on <a href="${
             process.env.SITE_URL
           }">${process.env.SITE_URL}</a>,
           <br/>please ignore this message</p>`,
  };
  await transport.sendMail(message, (err, info) => {
    if (err) {
      throw new ControllerException("MAIL_NOT_SENT", "Mail has not been sent");
    }
  });
  if (emailConfirmationCode === confirmationCode) {
    return {};
  } else {
    throw new ControllerException(
      "CONFIRMATION_CODE_IS_INVALID",
      "Confirmation code is invalid"
    );
  }
};

// confirm request restore password (any)
exports.confirmRequestRestorePassword = async ({ login, confirmationCode }) => {
  const [{ email_confirmation_code: emailConfirmationCode }] = await knex(
    "users"
  )
    .where({ login: login.toLowerCase() })
    .returning("email_confirmation_code");
  if (emailConfirmationCode !== confirmationCode) {
    throw new ControllerException(
      "CONFIRMATION_CODE_IS_INVALID",
      "Confirmation code is invalid"
    );
  }
  return true;
};

// restore password (user)
exports.restorePassword = async ({
  userId,
  password,
  passRestored = false,
}) => {
  if (passRestored) {
    await knex("users")
      .update({ password: await hashPass(password) })
      .where({ id: userId });
    return {};
  } else {
    throw new ControllerException("ACCESS_DENIED", "Access denied");
  }
};

// get all users (any)
exports.getAllUsers = async ({ limit = 20, page = 1 }) => {
  const users = await knex("users")
    .select("id", "login")
    .limit(limit)
    .offset(limit * (page - 1));
  return users;
};

// get user by id (any)
exports.getUserById = async ({ userId, tz = "UTC" }) => {
  const record = (
    await knex.raw(
      `select id as userId, login, role, email_is_confirmed as emailIsConfirmed, (created_at::timestamp at time zone 'UTC' at time zone '${tz}') as createdAt from "users" where id = ${userId}`
    )
  ).rows[0];
  const user = {};
  user.userId = userId;
  user.login = record.login;
  user.role = record.role;
  user.emailIsConfirmed = record.emailisconfirmed;
  user.createdAt = record.createdat;
  if (!user) {
    throw new ControllerException(
      "INTERNAL_SERVER_ERROR",
      "Internal server error"
    );
  }
  return user;
};

// get users by login
exports.getUsersByLogin = async ({ login, limit = 20, page = 1 }) => {
  const users = await knex("users")
    .select()
    .where("login", "ilike", `%${login.toLowerCase()}%`)
    .offset(limit * (page - 1));
  return users;
};
