/* Credit demo: scripted assistant. A pure reducer over a small table of steps;
   no AI behind it, so the demo behaves the same every time. */
import { BRAND, LOAN_TYPES, loanSummary, formatEur } from "./credit";
import { scoreLead, banksForScore } from "./creditLeads";

const TYPE_OPTIONS = Object.entries(LOAN_TYPES).map(([id, t]) => ({ id, label: t.label }));

const AMOUNTS = {
  ipo: [["До 100 000 €", 80000], ["100–200 000 €", 150000], ["Над 200 000 €", 260000]],
  pot: [["До 10 000 €", 7000], ["10–25 000 €", 17000], ["Над 25 000 €", 35000]],
  biz: [["До 50 000 €", 35000], ["50–200 000 €", 120000], ["Над 200 000 €", 300000]],
};
const DOWNS = [["10%", 10], ["20%", 20], ["30%+", 30]];
const INCOMES = [["До 1 500 €", 1200], ["1 500–3 000 €", 2200], ["Над 3 000 €", 4000]];

const opts = (pairs, prefix) => pairs.map(([label, value]) => ({ id: `${prefix}:${value}`, label, value }));

const AMOUNT_QUESTION = {
  ipo: "Колко струва имотът, който гледаш?",
  pot: "Каква сума ти трябва?",
  biz: "Какво финансиране търси фирмата?",
};

function result(answers) {
  const t = LOAN_TYPES[answers.type];
  const downPct = t.hasDown ? answers.downPct : 0;
  const { payment } = loanSummary({ type: answers.type, amount: answers.amount, downPct, years: t.years.default, rate: t.rate.default });
  const ratio = Math.round((payment / answers.income) * 100);
  const n = banksForScore(scoreLead({ payment, income: answers.income }));
  return `При тези данни вноската е около ${formatEur(payment)} на месец (${ratio}% от дохода). Профилът ти изглежда подходящ за ${n} от 14 банки.`;
}

export function startChat() {
  return {
    step: "type",
    answers: {},
    messages: [{ from: "bot", text: `Здравей! Аз съм демо асистентът на ${BRAND}. Какво финансиране търсиш?` }],
    options: TYPE_OPTIONS,
  };
}

export function answerChat(state, optionId) {
  if (optionId === "restart") return startChat();
  const picked = state.options.find((o) => o.id === optionId);
  if (!picked || optionId === "send") return state;

  const answers = { ...state.answers };
  const messages = [...state.messages, { from: "me", text: picked.label }];
  const next = (step, text, options) => ({ step, answers, messages: [...messages, { from: "bot", text }], options });

  switch (state.step) {
    case "type":
      answers.type = picked.id;
      return next("amount", AMOUNT_QUESTION[picked.id], opts(AMOUNTS[picked.id], "amount"));
    case "amount":
      answers.amount = picked.value;
      if (LOAN_TYPES[answers.type].hasDown) {
        return next("down", "Колко процента от цената имаш като самоучастие?", opts(DOWNS, "down"));
      }
      return next("income", answers.type === "biz" ? "Какъв е нетният месечен доход на собственика?" : "Какъв е нетният ти месечен доход?", opts(INCOMES, "income"));
    case "down":
      answers.downPct = picked.value;
      return next("income", "Какъв е нетният ти месечен доход?", opts(INCOMES, "income"));
    case "income":
      answers.income = picked.value;
      return next("result", result(answers), [
        { id: "send", label: "Изпрати като запитване" },
        { id: "restart", label: "Започни отначало" },
      ]);
    default:
      return state;
  }
}

export function chatToFormPrefill(state) {
  if (state.step !== "result") return null;
  const { type, amount, income, downPct } = state.answers;
  return LOAN_TYPES[type].hasDown ? { type, amount, income, downPct } : { type, amount, income };
}
