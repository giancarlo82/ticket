// socketEvents.js
const handleReservation = require("../utils/handleReservation");
const callTicket = require("../utils/callTicket");
const utils = require("../utils");

module.exports = function (io) {
  io.on("connection", (socket) => {
    // quando un cliente prenota un ticket
    socket.on("reservation", async (data) => {
      let parsedData = JSON.parse(data);

      let token = parsedData.token;
      let customer_name = parsedData.name;
      let serviceTypeId = parsedData.serviceTypeId;

      let bookingCode = await handleReservation(
        token,
        customer_name,
        serviceTypeId
      );

      io.emit("reservation", JSON.stringify(bookingCode));
      io.emit("new_ticket");
    });

    // quando un desk chiama un ticket
    socket.on("call_ticket", async (ticket_code, deskId) => {
      const desk = await utils.getDeskById(deskId);
      await callTicket(ticket_code, deskId, desk.name);
      io.emit("my_ticket", ticket_code, desk.name);
    });

    // quando un cliente cancella il ticket
    socket.on("delete_ticket", async (ticket_code) => {
      await utils.deleteTicket(ticket_code);
      io.emit("delete_ticket");
    });

    socket.on("disconnect", () => {});
  });
};
