import { Terminal } from "xterm";
import "xterm/css/xterm.css";

export class TerminalUI {
  constructor(socket) {
    this.terminal = new Terminal({
      rows: 13,
      cols: 90,
    });

    this.terminal.setOption("theme", {
      background: "#202B33",
      foreground: "#F5F8FA"
    });

    this.socket = socket;
  }

  startListening() {
    this.terminal.onData(data => this.sendInput(data));
    this.socket.on("output", data => {

      this.write(data);
    });
  }

  write(text) {
    this.terminal.write(text);
  }

  prompt() {
    this.terminal.write(`\r\n$ `);
  }

  sendInput(input) {
    this.socket.emit("input", input);
  }

  attachTo(container) {
    this.terminal.open(container);

    this.terminal.write("Terminal Connected");
    this.terminal.write("");
    this.prompt();
  }

  clear() {
    this.terminal.clear();
  }
}
