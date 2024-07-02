const fs = require("fs");
const utils = require("./index");

async function updateService(
  serviceTypeId,
  serviceName,
  serviceCode,
  serviceColor
) {
  const services = await utils.readJsonDataFile("services_list", "settings");
  let serviceIndex = services.services.findIndex(
    (service) => service.id == serviceTypeId
  );

  services.services[serviceIndex].name = serviceName;
  services.services[serviceIndex].code = serviceCode;
  services.services[serviceIndex].color = serviceColor;

  await utils.writeJsonDataFile("services_list", services, "settings");
}

module.exports = updateService;
