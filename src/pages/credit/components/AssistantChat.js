import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { startChat, answerChat, chatToFormPrefill } from "../../../lib/creditChat";

/* Scripted demo assistant: quick-reply chips only, with a short „пише…“ pause. */
export default function AssistantChat({ onSend, delay = 600 }) {
  const reduce = useReducedMotion();
  const [state, setState] = useState(startChat);
  const [pending, setPending] = useState(null); // user's message shown while the bot "types"
  const listRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [state, pending]);

  const pick = (opt) => {
    if (pending) return;
    if (opt.id === "send") {
      onSend({ ...chatToFormPrefill(state), chat: state.messages });
      return;
    }
    const next = answerChat(state, opt.id);
    const wait = reduce ? 0 : delay;
    if (!wait || opt.id === "restart") {
      setState(next);
      return;
    }
    setPending(opt.label);
    timer.current = setTimeout(() => {
      setPending(null);
      setState(next);
    }, wait);
  };

  return (
    <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-credit-line bg-white text-left text-credit-ink shadow-[0_24px_60px_-32px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-3 border-b border-credit-line px-4 py-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-credit-pine font-cr-head font-bold text-credit-mint">ф</span>
        <div className="leading-tight">
          <div className="text-sm font-semibold">Демо асистент</div>
          <div className="text-xs text-credit-pine2">● онлайн</div>
        </div>
      </div>

      <div ref={listRef} className="flex max-h-[360px] flex-1 flex-col gap-2 overflow-y-auto px-4 py-4" aria-live="polite">
        {state.messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
              m.from === "me" ? "self-end rounded-tr-md bg-credit-pine text-white" : "self-start rounded-tl-md bg-credit-mist"
            }`}
          >
            {m.text}
          </div>
        ))}
        {pending && (
          <>
            <div className="max-w-[85%] self-end rounded-2xl rounded-tr-md bg-credit-pine px-3.5 py-2.5 text-sm text-white">{pending}</div>
            <div className="self-start rounded-2xl rounded-tl-md bg-credit-mist px-3.5 py-2.5 text-sm text-credit-soft">пише…</div>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-credit-line bg-credit-mist/60 px-4 py-3">
        {state.options.map((o) => (
          <button
            key={o.id}
            type="button"
            disabled={!!pending}
            onClick={() => pick(o)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
              o.id === "send"
                ? "border-credit-pine bg-credit-pine text-white hover:bg-credit-pine2"
                : "border-credit-line bg-white text-credit-pine2 hover:border-credit-pine2"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
