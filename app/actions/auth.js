import Db, { PasswordInvalidError } from '../services/Db';

export const submitPasswordType = 'AUTH_SUBMIT_PASSWORD';
export const checkPasswordType = 'AUTH_CHECK_PASSWORD';
export const resetPasswordType = 'AUTH_RESET_PASSWORD';

// Thunk. Because it's a function and not a plain object, the thunk middleware
// picks it out of the sequences of actions so redux doesn't see it, and calls
// it. It can read state and dispatch more actions.
export const checkPasswordAction = password => async (dispatch, getState) => {
  let passwordIsValid = true;
  try {
    await new Db(password).getAll();
  } catch (error) {
    if (error instanceof PasswordInvalidError) {
      passwordIsValid = false;
    } else {
      throw error;
    }
  }
  dispatch(submitPasswordAction(password, passwordIsValid));
};

export const submitPasswordAction = (password, passwordIsValid) => ({
  type: submitPasswordType,
  password,
  passwordIsValid,
});

export const resetPasswordAction = password => async (dispatch, getState) => {
  const db = new Db(password);
  await db.writeAll({});
  dispatch(checkPasswordAction(password));
};
