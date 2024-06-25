const express = require("express");
const ticketRouter = express.Router();
const utils = require("../utils");

// ***** app use /ticket prefix ***** //

ticketRouter.get("/", async (req, res) => {
  // recupero la lista dei servizi
  const services = await utils.readJsonDataFile("services_list", "settings");

  return res.render("ticket", {
    services: services.services,
  });
});

ticketRouter.get("/list", async (req, res) => {
  // recupero la lista dei bookings
  const bookings = await utils.readJsonDataFile("bookings", "daily");

  // filtro quelli con status "pending" e li ordino per data
  const pendingBookings = bookings.bookings.filter(
    (booking) => booking.status === "prenotato"
  );
  pendingBookings.sort((a, b) => a.created_at - b.created_at);

  // // ordino per servizio
  // pendingBookings.sort((a, b) => a.service_id - b.service_id);

  // return pendingBookings in json format
  return res.json(pendingBookings);
});

ticketRouter.get("/services", async (req, res) => {
  const services = await utils.readJsonDataFile("services_list", "settings");
  return res.json(services.services);
});

ticketRouter.get("/last", async (req, res) => {
  const ticket_called = await utils.readJsonDataFile("ticket_called", "daily");
  return res.json(ticket_called.ticket_called);
});

module.exports = ticketRouter;
