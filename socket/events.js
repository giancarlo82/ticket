// socketEvents.js
const handleReservation = require("../utils/handleReservation");
const callTicket = require("../utils/callTicket");
const updateService = require("../utils/updateService");
const updateDesk = require("../utils/updateDesk");
const updateUser = require("../utils/updateUser");
const updateSettings = require("../utils/updateSettings");
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

    // setting update service
    socket.on("update-service", async (data) => {
      let serviceTypeId = data.id;
      let serviceName = data.service_name;
      let serviceCode = data.service_code;
      let serviceColor = data.service_color;

      await updateService(
        serviceTypeId,
        serviceName,
        serviceCode,
        serviceColor
      );
      io.emit("update_data");
    });

    // setting update desk
    socket.on("update-desk", async (data) => {
      console.log(data);
      let deskId = data.id;
      let deskName = data.desk_name;
      let deskCode = data.desk_code;
      let deskColor = data.desk_color;

      await updateDesk(deskId, deskName, deskCode, deskColor);
      io.emit("update_data");
    });

    // setting update user
    socket.on("update-user", async (data) => {
      let userId = data.id;
      let userName = data.user_name;
      let userEmail = data.user_email;
      let userPassword = data.user_password;

      await updateUser(userId, userName, userEmail, userPassword);
      io.emit("update_data");
    });

    socket.on("update-settings", async (data) => {
      let settingId = data.id;
      let settingColor = data.item_color;
      let settingBackgroundColor = data.item_backgroundColor;

      await updateSettings(settingId, settingColor, settingBackgroundColor);
      io.emit("update_data");
    });

    socket.on("disconnect", () => {});
  });
};
