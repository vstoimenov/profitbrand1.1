import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Crm from "./Crm";
import { buildCreditLead, saveLead, loadStatuses } from "../../lib/creditLeads";

const rows = () => screen.getAllByTestId("crm-row");

beforeEach(() => window.localStorage.clear());

test("empty storage shows the 12 demo leads and the demo banner", () => {
  render(<Crm nav={() => {}} />);
  expect(rows()).toHaveLength(12);
  expect(screen.getByText(/Демо данни/)).toBeInTheDocument();
});

test("a stored lead appears first with the „ново“ badge", () => {
  saveLead(buildCreditLead(
    { type: "ipo", amount: 150000, name: "Нов Клиент", phone: "0888123456", email: "n@k.bg", consent: true },
    { now: new Date("2026-11-18T12:00:00Z") }
  ));
  render(<Crm nav={() => {}} />);
  expect(rows()).toHaveLength(13);
  expect(within(rows()[0]).getByText("Нов Клиент")).toBeInTheDocument();
  expect(within(rows()[0]).getByText("ново")).toBeInTheDocument();
});

test("changing status in the detail panel updates the row and persists", () => {
  render(<Crm nav={() => {}} />);
  const first = rows()[0];
  const id = first.getAttribute("data-id");
  fireEvent.click(first);
  fireEvent.change(screen.getByLabelText("Статус"), { target: { value: "Одобрен" } });
  expect(within(rows()[0]).getByText("Одобрен")).toBeInTheDocument();
  expect(loadStatuses()[id]).toBe("Одобрен");
});

test("reset clears stored leads", () => {
  saveLead(buildCreditLead(
    { type: "pot", amount: 9000, name: "Временен", phone: "0888123456", email: "t@t.bg", consent: true },
    { now: new Date("2026-11-18T12:00:00Z") }
  ));
  render(<Crm nav={() => {}} />);
  expect(rows()).toHaveLength(13);
  fireEvent.click(screen.getByRole("button", { name: "Нулирай демото" }));
  expect(rows()).toHaveLength(12);
});

test("back link goes to the landing", () => {
  const nav = jest.fn();
  render(<Crm nav={nav} />);
  fireEvent.click(screen.getAllByRole("link", { name: /Към сайта/ })[0]);
  expect(nav).toHaveBeenCalledWith("credit");
});

test("a wrongly shaped stored lead does not blank the CRM", () => {
  window.localStorage.setItem("finora_demo_leads", JSON.stringify([{ id: "X1", name: "old" }]));
  render(<Crm nav={() => {}} />);
  expect(rows()).toHaveLength(12);
});
