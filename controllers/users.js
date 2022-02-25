const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

/*
To install:
bcrypt     - hashing passwords
(register, login, restorePassword, editProfile)

nodemailer - sending emails
(requestEmailConfirmation, restorePassword)

uuid (?)   - generating confirmation codes
(requestEmailConfirmation, restorePassword)

TO DO:
ControllerExceptions
Generating confirmation codes
Sending emails
Passwords hashing (?encrypting)
*/

// register (any)
exports.register = async ({ login, email, password }) => {
  try {
    const [{ id: userId }] = await knex("users")
      .insert({ login, email, password })
      .returning("id");

    return { userId };
  } catch (error) {
    throw new ControllerException("EMAIL_IN_USE", "Email in use");//split the errors
  }
};

// request email confirmation (user)
exports.requestEmailConfirmation = async ({ userId }) => {
  try {
    const confirmationCode = "000000"; //generate somehow (uuid?)

    const email = await knex("users")
      .where("id", userId)
      .update({
        email_confirmation_code: confirmationCode,
        updated_at: knex.fn.now(),
      })
      .returning("email");

    // send email (nodemailer)
    return {};
  } catch (error) {
    throw new ControllerException("", "");
  }
};

// confirm email (user)
exports.confirmEmail = ({ userId, confirmationCode }) => {
  try {
    const emailConfirmationCode = await knex("users")
      .where("id", userId)
      .returning("email_confirmation_code");

    //compare confirmation codes
    if (emailConfirmationCode === confirmationCode) {
      await knex("users").where("id", userId).update({
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
  } catch (error) {
    throw new ControllerException("", "");
  }
};

// login (any)
exports.login = async ({ login, password }) => {
  try {
    const getPassword = await knex("users")
      .where("login", login)
      .return("password");
    if (password === getPassword) {
      return { userId };
    } else {
      throw new ControllerException("INVALID_PASSWORD", "Invalid password");
    }
  } catch (error) {
    throw new ControllerException("", "");
  }
};

// edit profile (user)
exports.editProfile = async ({ userId, login, email, password }) => {
  try {
    await knex("users").where("id", userId).update({
      login: login,
      email: email,
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
    await knex("users").where("id", userId).update({
      role: role,
      updated_at: knex.fn.now(),
    });
    return {};
  } catch (error) {
    throw new ControllerException("", "");
  }
};

// deactivate profile (user)
exports.deactivateProfile = async ({ userId }) => {
  try {
    await knex("users").where("id", userId).update({
      active: false,
      updated_at: knex.fn.now(),
    });
    return {};
  } catch (error) {
    throw new ControllerException("", "");
  }
};

// activate profile (user)
exports.activateProfile = async ({ userId }) => {
  try {
    await knex("users").where("id", userId).update({
      active: true,
      updated_at: knex.fn.now(),
    });
    return {};
  } catch (error) {
    throw new ControllerException("", "");
  }
};

// change preferences (user)
exports.changePreferences = async ({
  userId,
  dark_theme,
  email_notitfications_on,
}) => {
  try {
    await knex("users").where("id", userId).update({
      dark_theme: dark_theme,
      email_notitfications_on: email_notitfications_on,
      updated_at: knex.fn.now(),
    });
    return {};
  } catch (error) {
    throw new ControllerException("", "");
  }
};

// restore password
exports.restorePassword = async ({ login }) => {
  try {
    const confirmationCode = "000000"; //generate somehow (uuid?)

    const email = await knex("users")
      .where("login", login)
      .update({
        email_confirmation_code: confirmationCode,
        updated_at: knex.fn.now(),
      })
      .returning("email");

    //send email

    if (emailConfirmationCode === confirmationCode) {
      return {};
    } else {
      throw new ControllerException(
        "CONFIRMATION_CODE_IS_INVALID",
        "Confirmation code is invalid"
      );
    }
  } catch (error) {
    throw new ControllerException("", "");
  }
};
