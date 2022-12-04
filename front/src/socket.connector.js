const io = require("socket.io-client");
export default io(`ws://`, {
  reconnection: true,
  reconnectionDelay: 1000,
});
