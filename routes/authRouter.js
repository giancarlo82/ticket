const express = require("express");
const utils = require("../utils");

const authRouter = express.Router();

authRouter.get("/login", (req, res) => {
  // check if "data/daily/" exists
  utils.checkDailyFolderThanCreate();

  res.render("auth/login", {
    message: "",
  });
});

authRouter.post("/auth/login", async (req, res) => {
  // check if "data/daily/" exists
  await utils.checkDailyFolderThanCreate();

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.render("auth/login", {
        message: "Please provide an email and password",
      });
    }
    const users = await utils.getListUsers();
    const user = users.find((user) => user.email === email);

    // check if the user exists
    if (!user) {
      return res.render("auth/login", {
        message: "Email or password is incorrecte",
      });
    }

    // check if the password is correct
    if (password != user.password) {
      return res.render("auth/login", {
        message: "Email or password is incorrect",
      });
    }

    // if the user is found, create a cookie with the user id
    res.cookie(
      "session",
      { email, user_id: user.id },
      {
        expires: new Date(Date.now() + 60000 * 60), // 100 secondi
        httpOnly: true,
        sameSite: "none",
        secure: true,
      }
    );

    // salvo i dati dell'utente in sessione
    req.session.user_name = user.name;
    req.session.user_email = user.email;
    req.session.user_id = user.id;

    res.redirect("/admin/desk_all");
  } catch (error) {
    console.log(error);
  }
});

authRouter.get("/logout", async (req, res) => {
  // Elimina il cookie 'auth'
  res.clearCookie("session");

  // Reindirizza l'utente alla pagina di login
  res.redirect("/login");
});

module.exports = authRouter;
