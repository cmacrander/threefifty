export const submitPasswordType = 'AUTH_SUBMIT_PASSWORD';

export const submitPasswordAction = password => ({
  type: submitPasswordType,
  password,
});
