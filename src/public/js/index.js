// We use this socket to establish a connection to our server
const socket = io();

let user;
const input = document.getElementById("chatBox");
const chatBox = document.getElementById("messageLogs");

// Develop authentication modal
Swal.fire({
  title: "Authenticate",
  input: "text",
  text: "Enter your username for the chat",
  inputValidator: (value) => {
    return !value && "You need to enter your username to start chatting";
  },
  allowOutsideClick: false,
  allowEscapeKey: false,
}).then((res) => {
  user = res.value;
  socket.emit("authenticated", user);
});

input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (input.value.trim().length > 0) {
      socket.emit("message", { user, message: input.value });
      input.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
  let messages = "";
  data.forEach((message) => {
    messages += `${message.user} says: ${message.message}<br/>`;
  });
  chatBox.innerHTML = messages;
});

socket.on("newUserConnected", (data) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmationButton: false,
    timer: 3000,
    title: `${data} has joined`,
    icon: "success",
  });
});
