const users = [];

//this joins users into the chat room
function userJoin(id, username, room) { const User = { id, username, room }; users.push(User);
    return User;
}

// this gets the current user, by their respective id(s)
function getCurrentUser(id) { return users.find((User) => User.id === id); }

// Function that allows user(s) to leave the chatroom.
function userLeave(id) {
    const index = users.findIndex((User) => User.id === id); if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get Room Users
function getRoomUsers(room) {
    return users.filter((User) => User.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
};