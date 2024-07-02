const utils = require("./index");

async function updateSettings(settingId, settingColor, settingBackgroundColor) {
  const settings = await utils.readJsonDataFile("app_list", "settings");
  let settingIndex = settings.app.findIndex(
    (setting) => setting.id == settingId
  );

  settings.app[settingIndex].color = settingColor;
  settings.app[settingIndex].backgroundColor = settingBackgroundColor;

  await utils.writeJsonDataFile("app_list", settings, "settings");
}

module.exports = updateSettings;
