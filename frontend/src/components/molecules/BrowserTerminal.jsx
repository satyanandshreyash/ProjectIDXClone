import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const BrowserTerminal = () => {
  const terminalRef = useRef(null);
  const socket = useRef(null);

  const { projectId: projectIdFromUrl } = useParams();

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "Ubuntu Mono",
      theme: {
        background: "#181818",
        foreground: "#d4d4d4",
        cursor: "#d4d4d4",
        selection: "rgba(255, 255, 255, 0.3)",
        red: "#ff0000",
        green: "#00ff00",
        yellow: "#ffff00",
        cyan: "#00ffff",
        convertEol: true,
        cursorStyle: "block",
      },
    });
    term.open(terminalRef.current);
    let fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddon.fit();
    socket.current = io(`${import.meta.env.VITE_BACKEND_URL}/terminal`, {
      query: {
        projectId: projectIdFromUrl,
      },
    });

    socket.current.on("shell-output", (data) => {
      term.write(data);
    });

    term.onData((data) => {
      console.log(data);
      socket.current.emit("shell-input", data);
    });

    return () => {
      term.dispose();
      socket.current.disconnect();
    };
  }, []);

  return (
    <div
      className="p-4 border-t border-gray-600 overflow-auto terminal"
      ref={terminalRef}
      id="terminal-container"
    ></div>
  );
};

export default BrowserTerminal;
