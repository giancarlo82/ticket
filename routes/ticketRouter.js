const express = require("express");
const ticketRouter = express.Router();
const utils = require("../utils");

// ***** app use /ticket prefix ***** //

ticketRouter.get("/", async (req, res) => {
  // check if "data/daily/" exists
  utils.checkDailyFolderThanCreate();

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

ticketRouter.get("/json_last", async (req, res) => {
  const ticket_called = await utils.readJsonDataFile("ticket_called", "daily");
  // recupero la lista dei tickets, ne prendo 5 e li ordino al contrario
  const lastTickets = ticket_called.ticket_called.slice(-5).reverse();
  return res.json(lastTickets);
});

ticketRouter.get("/last", async (req, res) => {
  const ticket_called = await utils.readJsonDataFile("ticket_called", "daily");
  const lastTickets = ticket_called.ticket_called.slice(-4).reverse();

  // Aggiungi la funzione formatTime senza moment
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return res.render("lastTickets", { lastTickets, formatTime });
});

module.exports = ticketRouter;
