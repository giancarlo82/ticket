async function lastTicketsCalled() {
  const ticket_called = await utils.readJsonDataFile("ticket_called", "daily");

  return ticket_called;
}

module.exports = lastTicketsCalled;
