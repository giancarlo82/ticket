const fs = require("fs");
const utils = require("./index");
const path = require("path");
const sendTelegram = require("./sendTelegram");

async function callTicket(ticket_code, deskId, deskName) {
  const bookings = await utils.readJsonDataFile("bookings", "daily");

  let booking = bookings.bookings.find(
    (booking) => booking.code === ticket_code
  );

  if (booking) {
    if (booking.status === "chiamato") return;

    booking.status = "chiamato";
    booking.desk_id = deskId;
    booking.desk_name = deskName;
    booking.updated_at = utils.getMysqlDate();

    await utils.writeJsonDataFile("bookings", bookings, "daily");

    let service = await utils.readJsonDataFile("services_list", "settings");
    service = service.services.find(
      (service) => service.id === booking.service_id
    );

    // invio un messaggio a Telegram
    let msg_telegram = `Ticket called: ${ticket_code} (${booking.customer_name} - ${service.name}) - da ${deskName}`;
    await sendTelegram(msg_telegram);

    writeTicketCalled(
      ticket_code,
      booking.customer_name,
      booking.service_id,
      booking.service_name,
      booking.desk_id,
      booking.desk_name,
      service.color
    );
  }
}

async function writeTicketCalled(
  ticket_code,
  customer_name,
  service_id,
  service_name,
  desk_id,
  desk_name,
  service_color
) {
  const mysqlDate = await utils.getMysqlDate();
  const dailyFolder = path.join(
    process.cwd(),
    "database",
    "daily",
    mysqlDate.substr(0, 10)
  );

  const ticketCalledFile = path.join(dailyFolder, "ticket_called.json");

  let ticketCalled = await utils.readJsonDataFile("ticket_called", "daily");

  ticketCalled.ticket_called.push({
    ticket_code: ticket_code,
    customer_name: customer_name,
    service_id: service_id,
    service_name: service_name,
    desk_id: desk_id,
    desk_name: desk_name,
    called_at: mysqlDate,
    service_color: service_color,
  });

  await utils.writeJsonDataFile("ticket_called", ticketCalled, "daily");
}

module.exports = callTicket;
