const password = {
  get() {
    return this.pwd;
  },

  set(pwd) {
    this.pwd = pwd;
  },
};

export default password;
