import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { useParams } from "react-router-dom";
import { AttachAddon } from "@xterm/addon-attach";

const BrowserTerminal = () => {
  const terminalRef = useRef(null);
  const socket = useRef(null);

  const { projectId: projectIdFromUrl } = useParams();

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "Fira Code",
      convertEol: true,
      theme: {
        background: "#181818",
        foreground: "#d4d4d4",
        cursor: "#d4d4d4",
        selection: "rgba(255, 255, 255, 0.3)",
        red: "#ff0000",
        green: "#00ff00",
        yellow: "#ffff00",
        cyan: "#00ffff",
        cursorStyle: "block",
      },
    });
    term.open(terminalRef.current);
    let fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddon.fit();

    const ws = new WebSocket("/terminal?projectId=" + projectIdFromUrl);

    ws.onopen = () => {
      const attachAddon = new AttachAddon(ws);
      term.loadAddon(attachAddon);
      socket.current = ws;
    };

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
