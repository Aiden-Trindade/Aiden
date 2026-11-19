"use client";

import { useEffect, useRef, useState } from "react";

// VoiceOver skips a message identical to the last one from the same region,
// so a repeat gets a no-break space to make it differ.
let lastMessage = "";

export default function CopyEmail({ email }: { email: string }) {
  const [message, setMessage] = useState("");
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    clearTimeout(timer.current);
    setMessage("");
    let next = "Copied";
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      next = "Copy failed";
    }
    if (next === lastMessage) next += "\u00A0";
    lastMessage = next;
    setMessage(next);
    timer.current = window.setTimeout(() => setMessage(""), 2000);
  }

  return (
    <span className="copy">
      <button type="button" className="copy-email" onClick={copy}>
        Copy email
      </button>
      <span role="status" className="copy-status">
        {message}
      </span>
    </span>
  );
}
