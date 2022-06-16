const os = require("os");
const pty = require("node-pty");

class PTY {
  constructor(socket) {

    this.shell = os.platform() === "win32" ? "powershell.exe" : "bash";
    this.ptyProcess = null;
    this.socket = socket;

    this.startPtyProcess();
  }

  startPtyProcess() {
    this.ptyProcess = pty.spawn(this.shell, [], {
      name: "xterm-color",
      cwd: __dirname + "/storage",
      env: process.env
    });

    this.ptyProcess.on("data", data => {

      this.sendToClient(data);
    });
  }

  write(data) {
    this.ptyProcess.write(data);
  }

  sendToClient(data) {

    this.socket.emit("output", data);
  }
}

module.exports = PTY;
