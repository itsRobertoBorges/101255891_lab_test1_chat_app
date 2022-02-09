const { room } = Qs.parse(location.search, { ignoreQueryPrefix: true, });
$("#RoomName").text(room);
const username = Cookies.get("username");
const socket = io();
socket.emit("joinRoom", {
    username,
    room,
});
socket.on("message", (messaging) => {
    printMessage(messaging);
    $("#chatMessages").scrollTop(document.getElementById("chatMessages").scrollHeight);
});
$("#chatForm").on("submit", function (error) {
    error.preventDefault();
    const messaging = $("#message").val();
    socket.emit("chatMessage", messaging); 
    $("#message").val("").focus(); 
});
socket.on("roomUsers", ({ room, User }) => {
    $("#RoomUsers").html("");

    $.each(User, (i, User) => {
        $("#RoomUsers").append(`<div class="text-muted">${User.username}</div>`);
    });
});
function printMessage(message) {
    let ele = "";
    if (message.username == username) {
        ele = `<div class="border p-2 rounded bg-secondary text-white mt-3 w-75 float-end">
        <small class="text-white">${message.username} - ${message.time}</small>
        <div>${message.text}</div>
    </div>`;
    } else {
        
        ele = `<div class="border p-2 rounded bg-light mt-3 w-75 float-start">
        <small class="text-muted">${message.username} - ${message.time}</small>
        <div>${message.text}</div>
    </div>`;
    }

    $("#chatMessages").append(el);
}