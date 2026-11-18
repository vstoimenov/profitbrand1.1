import { startChat, answerChat, chatToFormPrefill } from "./creditChat";
import { loanSummary } from "./credit";
import { scoreLead, banksForScore } from "./creditLeads";

const optionId = (state, label) => {
  const o = state.options.find((x) => x.label === label);
  if (!o) throw new Error(`no option ${label} in ${JSON.stringify(state.options)}`);
  return o.id;
};

test("startChat greets and offers loan types", () => {
  const s = startChat();
  expect(s.step).toBe("type");
  expect(s.messages[0]).toEqual({ from: "bot", text: "Здравей! Аз съм демо асистентът на Финора. Какво финансиране търсиш?" });
  expect(s.options.map((o) => o.label)).toEqual(["Ипотечен", "Потребителски", "Бизнес"]);
});

test("full ipo path ends with a result and banks count", () => {
  let s = startChat();
  s = answerChat(s, "ipo");
  expect(s.step).toBe("amount");
  s = answerChat(s, optionId(s, "100–200 000 €"));
  expect(s.step).toBe("down");
  s = answerChat(s, optionId(s, "20%"));
  expect(s.step).toBe("income");
  s = answerChat(s, optionId(s, "1 500–3 000 €"));
  expect(s.step).toBe("result");

  const { payment } = loanSummary({ type: "ipo", amount: 150000, downPct: 20, years: 30, rate: 2.9 });
  const n = banksForScore(scoreLead({ payment, income: 2200 }));
  const last = s.messages[s.messages.length - 1];
  expect(last.from).toBe("bot");
  expect(last.text).toContain(`подходящ за ${n} от 14 банки`);
  expect(s.options.map((o) => o.id)).toEqual(["send", "restart"]);
  expect(s.messages.filter((m) => m.from === "me").map((m) => m.text)).toEqual(["Ипотечен", "100–200 000 €", "20%", "1 500–3 000 €"]);
});

test("pot path skips the down payment step", () => {
  let s = answerChat(startChat(), "pot");
  s = answerChat(s, s.options[0].id);
  expect(s.step).toBe("income");
});

test("unknown option leaves state untouched", () => {
  const s = startChat();
  expect(answerChat(s, "nope")).toBe(s);
});

test("restart returns to the first step", () => {
  let s = answerChat(startChat(), "biz");
  s = answerChat(s, s.options[0].id);
  s = answerChat(s, s.options[0].id);
  expect(s.step).toBe("result");
  expect(answerChat(s, "restart").step).toBe("type");
});

test("chatToFormPrefill only at result", () => {
  let s = answerChat(startChat(), "ipo");
  expect(chatToFormPrefill(s)).toBeNull();
  s = answerChat(s, optionId(s, "100–200 000 €"));
  s = answerChat(s, optionId(s, "20%"));
  s = answerChat(s, optionId(s, "1 500–3 000 €"));
  expect(chatToFormPrefill(s)).toEqual({ type: "ipo", amount: 150000, income: 2200, downPct: 20 });
});
