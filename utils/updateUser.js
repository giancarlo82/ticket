const utils = require("./index");

async function updateUser(userId, userName, userEmail, userPassword) {
    const users = await utils.readJsonDataFile("users_list", "settings");
    let userIndex = users.users.findIndex((user) => user.id == userId);
    
    users.users[userIndex].name = userName;
    users.users[userIndex].email = userEmail;
    users.users[userIndex].password = userPassword;
    
    await utils.writeJsonDataFile("users_list", users, "settings");
}

module.exports = updateUser;