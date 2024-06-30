const fs = require("fs");
const utils = require("./index");
const sendTelegram = require("./sendTelegram");

async function handleReservation(token, customerName, serviceTypeId) {
  // scrivo un file con i dati della prenotazione
  let random_code = await utils.random_code();
  let serviceName = await utils.getServiceName(serviceTypeId);
  let service = await utils.getService(serviceTypeId);

  const bookings = await utils.readJsonDataFile("bookings", "daily");

  let newBooking = {
    id: bookings.bookings.length + 1,
    service_id: parseInt(serviceTypeId),
    service_name: serviceName,
    code: random_code,
    token: token,
    service_color: service.color,
    customer_name: customerName,
    status: "prenotato",
    created_at: utils.getMysqlDate(),
    updated_at: utils.getMysqlDate(),
  };

  bookings.bookings.push(newBooking);

  await utils.writeJsonDataFile("bookings", bookings, "daily");

  let objResponse = {
    code: random_code,
    service_name: serviceName,
    customer_name: customerName,
    token: token,
  };

  // invio un messaggio a Telegram
  let msg_telegram = `New reservation for: ${serviceName} - from: ${customerName} - with code: ${random_code}`;
  await sendTelegram(msg_telegram);

  return objResponse;
}

module.exports = handleReservation;
