const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const validatePassword = (pw) => {
  return (
    // /[A-Z]/.test(pw) &&
    // /[a-z]/.test(pw) &&
    // /[0-9]/.test(pw) &&
    // /[^A-Za-z0-9]/.test(pw) &&
    pw.length >= 4
  );
};

module.exports = { validateEmail, validatePassword };
