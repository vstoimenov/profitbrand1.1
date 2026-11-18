import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import LeadForm from "./LeadForm";

const stored = () => JSON.parse(window.localStorage.getItem("finora_demo_leads") || "[]");

const fillValid = () => {
  const amount = screen.getByLabelText("Сума (€)");
  if (!amount.value) fireEvent.change(amount, { target: { value: "150000" } });
  fireEvent.change(screen.getByLabelText("Име"), { target: { value: "Тест Тестов" } });
  fireEvent.change(screen.getByLabelText("Телефон"), { target: { value: "+359 888 123 456" } });
  fireEvent.change(screen.getByLabelText("Имейл"), { target: { value: "test@example.com" } });
  fireEvent.click(screen.getByLabelText(/Съгласен\/а съм/));
};

beforeEach(() => window.localStorage.clear());

test("empty submit shows phone and consent errors and saves nothing", () => {
  render(<LeadForm prefill={null} onOpenCrm={() => {}} />);
  fireEvent.click(screen.getByRole("button", { name: "Изпрати запитване" }));
  expect(screen.getByText("Напиши телефон за връзка.")).toBeInTheDocument();
  expect(screen.getByText("Нужно е съгласие, за да обработим запитването.")).toBeInTheDocument();
  expect(stored()).toHaveLength(0);
});

test("valid submit saves one lead and shows the success panel", () => {
  const onOpenCrm = jest.fn();
  render(<LeadForm prefill={null} onOpenCrm={onOpenCrm} />);
  fillValid();
  fireEvent.click(screen.getByRole("button", { name: "Изпрати запитване" }));
  expect(screen.getByText(/Запитването е прието/)).toBeInTheDocument();
  expect(stored()).toHaveLength(1);
  expect(stored()[0].source).toBe("form");
  fireEvent.click(screen.getByRole("button", { name: "Виж го в CRM (демо)" }));
  expect(onOpenCrm).toHaveBeenCalled();
});

test("double click on submit stores one lead", () => {
  render(<LeadForm prefill={null} onOpenCrm={() => {}} />);
  fillValid();
  const btn = screen.getByRole("button", { name: "Изпрати запитване" });
  fireEvent.click(btn);
  fireEvent.click(btn);
  expect(stored()).toHaveLength(1);
});

test("prefill sets type and amount, and a chat prefill marks the source", () => {
  const { rerender } = render(<LeadForm prefill={null} onOpenCrm={() => {}} />);
  rerender(<LeadForm prefill={{ type: "biz", amount: 80000 }} onOpenCrm={() => {}} />);
  expect(screen.getByLabelText("Вид кредит")).toHaveValue("biz");
  expect(screen.getByLabelText("Сума (€)")).toHaveValue(80000);

  rerender(<LeadForm prefill={{ type: "ipo", amount: 150000, income: 2200, downPct: 20, chat: [{ from: "bot", text: "Здравей" }] }} onOpenCrm={() => {}} />);
  expect(screen.getByLabelText("Нетен месечен доход (€, по избор)")).toHaveValue(2200);
  fillValid();
  fireEvent.click(screen.getByRole("button", { name: "Изпрати запитване" }));
  expect(stored()[0].source).toBe("assistant");
  expect(stored()[0].chat).toHaveLength(1);
  expect(stored()[0].downPct).toBe(20);
});
