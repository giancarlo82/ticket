const fs = require("fs");
const path = require("path");

const readJsonDataFile = (key, type) => {
  if (type === "daily")
    filePath = `./database/${type}/${getMysqlDate().substr(0, 10)}/${key}.json`;
  else filePath = `./database/${type}/${key}.json`;

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err);
        reject(err);
        return;
      }
      const data = JSON.parse(jsonString);
      resolve(data);
    });
  });
};

const writeJsonDataFile = (key, data, type) => {
  if (type === "daily")
    filePath = `./database/${type}/${getMysqlDate().substr(0, 10)}/${key}.json`;
  else filePath = `./database/${type}/${key}.json`;

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.log("Error writing file:", err);
        reject(err);
        return;
      }
      resolve();
    });
  });
};

const getMysqlDate = () => {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset();
  const timestampUTC = now.getTime() - timezoneOffset * 60 * 1000;
  const mysqlDate = new Date(timestampUTC)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  return mysqlDate;
};

const random_code = async (length = 6) => {
  const bookings = await readJsonDataFile("bookings", "daily");

  const count = bookings.bookings.filter(
    (booking) =>
      new Date(booking.created_at).toLocaleDateString() ===
      new Date().toLocaleDateString()
  ).length;

  const prefisso = await convertiData(
    new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })
  );
  const suffisso = await count.toString().padStart(4, "0");
  const codice = prefisso + suffisso;
  return codice;
};

const convertiData = (data) => {
  const mese_caratteri = {
    1: "A",
    2: "B",
    3: "C",
    4: "D",
    5: "E",
    6: "F",
    7: "G",
    8: "H",
    9: "I",
    10: "J",
    11: "K",
    12: "L",
  };
  const giorno_caratteri = {
    1: "A",
    2: "B",
    3: "C",
    4: "D",
    5: "E",
    6: "F",
    7: "G",
    8: "H",
    9: "I",
    10: "J",
    11: "K",
    12: "L",
    13: "M",
    14: "N",
    15: "O",
    16: "P",
    17: "Q",
    18: "R",
    19: "S",
    20: "T",
    21: "U",
    22: "V",
    23: "W",
    24: "X",
    25: "Y",
    26: "Z",
    27: "A",
    28: "B",
    29: "C",
    30: "D",
    31: "E",
  };

  const mese = parseInt(data.substr(0, 2));
  const giorno = parseInt(data.substr(3, 2));
  const mese_carattere = mese_caratteri[mese];
  const giorno_carattere = giorno_caratteri[giorno];
  const data_convertita = mese_carattere + giorno_carattere;
  return data_convertita;
};

const getServiceName = async (serviceId) => {
  const services = await readJsonDataFile("services_list", "settings");
  const service = services.services.filter(
    (service) => service.id == serviceId
  );
  return service[0].name;
};

const getService = async (serviceId) => {
  const services = await readJsonDataFile("services_list", "settings");
  const service = services.services.filter(
    (service) => service.id == serviceId
  );
  return service[0];
};

const getDeskById = async (deskId) => {
  const desks = await readJsonDataFile("desks_list", "settings");
  const desk = desks.desks.filter((desk) => desk.id == deskId);
  return desk[0];
};

const deleteTicket = async (ticket_code) => {
  // Leggi i dati esistenti dal file JSON
  const bookings = await readJsonDataFile("bookings", "daily");

  // Trova il booking da cancellare
  const booking = bookings.bookings.find(
    (booking) => booking.code === ticket_code
  );

  // aggiorna lo status del booking in cancellato
  if (booking) {
    booking.status = "cancellato";
    // Scrivi i dati aggiornati nel file JSON
    await writeJsonDataFile("bookings", bookings, "daily");
  }
};

const checkDailyFolderThanCreate = async () => {
  const mysqlDate = await getMysqlDate();
  const dailyFolder = path.join(
    process.cwd(),
    "database",
    "daily",
    mysqlDate.substr(0, 10)
  );

  if (!fs.existsSync(dailyFolder)) {
    try {
      fs.mkdirSync(dailyFolder, { recursive: true });
    } catch (err) {
      console.error(`Error creating directory ${dailyFolder}:`, err);
    }
  }

  // controllo la presenza del file bookings.json
  const bookingsFile = path.join(dailyFolder, "bookings.json");
  if (!fs.existsSync(bookingsFile)) {
    try {
      fs.writeFileSync(bookingsFile, JSON.stringify({ bookings: [] }));
    } catch (err) {}
  }

  // controllo la presenza del file ticket_called.json
  const ticketCalledFile = path.join(dailyFolder, "ticket_called.json");
  if (!fs.existsSync(ticketCalledFile)) {
    try {
      fs.writeFileSync(ticketCalledFile, JSON.stringify({ ticket_called: [] }));
    } catch (err) {}
  }
};

const getListUsers = async () => {
  const users = await readJsonDataFile("users_list", "settings");
  return users.users;
};

module.exports = {
  readJsonDataFile,
  writeJsonDataFile,
  getMysqlDate,
  random_code,
  getServiceName,
  checkDailyFolderThanCreate,
  convertiData,
  getService,
  getDeskById,
  deleteTicket,
  getListUsers,
};
