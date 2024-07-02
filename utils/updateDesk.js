const utils = require("./index");

async function updateDesk(deskId, deskName, deskCode, deskColor) {
  const desks = await utils.readJsonDataFile("desks_list", "settings");
  let deskIndex = desks.desks.findIndex((desk) => desk.id == deskId);

  desks.desks[deskIndex].name = deskName;
  desks.desks[deskIndex].code = deskCode;
  desks.desks[deskIndex].color = deskColor;

  await utils.writeJsonDataFile("desks_list", desks, "settings");
}

module.exports = updateDesk;
