const express = require("express");
const adminRouter = express.Router();
const utils = require("../utils");

// ***** app use /ticket prefix ***** //

adminRouter.get("/desk_single", async (req, res) => {
  // recupero la lista dei servizi
  const services = await utils.readJsonDataFile("services_list", "settings");

  // recupero la lista dei bookings
  const bookings = await utils.readJsonDataFile("bookings", "daily");

  // recupero la lista dei desks
  const desks = await utils.readJsonDataFile("desks_list", "settings");

  // filtro quelli con status "pending" e li ordino per data
  const pendingBookings = bookings.bookings.filter(
    (booking) => booking.status === "prenotato"
  );
  pendingBookings.sort((a, b) => a.created_at - b.created_at);

  // recupero i dati salvati in sessione
  const user_name = req.session.user_name;

  return res.render("desk_single", {
    services: services.services,
    bookings: pendingBookings,
    desks: desks.desks,
    user_name: user_name || "Ospite",
  });
});

adminRouter.get("/desk_all", async (req, res) => {
  // recupero la lista dei servizi
  const services = await utils.readJsonDataFile("services_list", "settings");

  // recupero la lista dei bookings
  const bookings = await utils.readJsonDataFile("bookings", "daily");

  // recupero la lista dei desks
  const desks = await utils.readJsonDataFile("desks_list", "settings");

  // filtro quelli con status "pending" e li ordino per data
  const pendingBookings = bookings.bookings.filter(
    (booking) => booking.status === "prenotato"
  );
  pendingBookings.sort((a, b) => a.created_at - b.created_at);

  // recupero i dati salvati in sessione
  const user_name = req.session.user_name;

  return res.render("desk_all", {
    services: services.services,
    bookings: pendingBookings,
    desks: desks.desks,
    user_name: user_name || "Ospite",
  });
});

adminRouter.get("/monitor", async (req, res) => {
  return res.render("monitor");
});

adminRouter.get("/settings", async (req, res) => {
  // recupero la lista dei servizi
  const services = await utils.readJsonDataFile("services_list", "settings");

  // recupero la lista dei desks
  const desks = await utils.readJsonDataFile("desks_list", "settings");

  // recupero la lista degli utenti
  const users = await utils.readJsonDataFile("users_list", "settings");

  // recupero i dati salvati in sessione
  const user_name = req.session.user_name;

  return res.render("settings", {
    services: services.services,
    desks: desks.desks,
    users: users.users,
    user_name: user_name || "Ospite",
  });
});

module.exports = adminRouter;
