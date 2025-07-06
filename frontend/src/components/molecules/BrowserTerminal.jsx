import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { AttachAddon } from "@xterm/addon-attach";
import { useTerminalSocketStore } from "../../store/terminalSocketStore";
import { useEditorSocketStore } from "../../store/editorSocketStore";
import { useParams } from "react-router-dom";

const BrowserTerminal = () => {
  const terminalRef = useRef(null);
  const { terminalSocket, setIsTerminalReady } = useTerminalSocketStore();

  useEffect(() => {
    if (!terminalSocket) return;
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

    // ResizeObserver to handle terminal resizing
    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });
    resizeObserver.observe(terminalRef.current);

    const attachSocket = () => {
      const attachAddon = new AttachAddon(terminalSocket);
      term.loadAddon(attachAddon);

      // term.onLineFeed(() => {
      //   term.scrollToBottom();
      // });

      terminalSocket.addEventListener(
        "message",
        function handleFirstMessage(event) {
          terminalSocket.removeEventListener("message", handleFirstMessage);
          setIsTerminalReady(true);
        }
      );
    };

    if (terminalSocket) {
      if (terminalSocket.readyState === WebSocket.OPEN) {
        attachSocket();
      } else {
        terminalSocket.onopen = attachSocket;
      }
    }
    return () => {
      term.dispose();
      terminalSocket.close?.();
    };
  }, [terminalSocket]);

  return (
    <div
      className="px-4 py-1 border-t border-[hsl(0,0%,30%)] terminal w-full h-full"
      ref={terminalRef}
      id="terminal-container"
    ></div>
  );
};

export default BrowserTerminal;
