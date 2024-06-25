const utils = require("../utils/");

const authMiddleware = (req, res, next) => {
  // check if "data/daily/" exists
  utils.checkDailyFolderThanCreate();

  let isAuthenticated = false;

  const session = req.cookies.session;
  if (session) {
    const userId = session.user_id;
    if (userId) {
      isAuthenticated = true;
      next();
    }
  } else {
    isAuthenticated = false;
    res.redirect("/login");
  }
};

module.exports = authMiddleware;
