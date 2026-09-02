import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatGptAds from "./ChatGptAds";
import * as leads from "../lib/leads";

beforeEach(() => {
  window.scrollTo = jest.fn();
  Element.prototype.scrollIntoView = jest.fn();
  global.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
});
afterEach(() => { delete window.fbq; delete global.fetch; });

test("renders the v3 hero headline, no pricing section, and the ad screenshot", () => {
  render(<ChatGptAds nav={() => {}} />);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/Клиентът ти вече пита ChatGPT за всичко/);
  const body = document.body.textContent;
  expect(screen.queryByText("Колко струва")).toBeNull();
  expect(body).not.toMatch(/Без първоначална такса/);
  expect(body).not.toMatch(/€\s?350/);
  expect(body).not.toMatch(/€\s?850/);
  expect(body).not.toMatch(/48 часа/);
  expect(body).not.toMatch(/200\s?000/);
  expect(body).not.toMatch(/€\s?490/);
  expect(body).not.toMatch(/€\s?390/);
  const shot = screen.getByRole("img", { name: /Sponsored/ });
  expect(shot).toHaveAttribute("src", "/chatgpt-ad-example.jpg");
});

test("empty submit shows validation errors and does not send", async () => {
  const spy = jest.spyOn(leads, "submitLead").mockResolvedValue();
  render(<ChatGptAds nav={() => {}} />);
  fireEvent.click(screen.getByRole("button", { name: /Прати — ще ти пиша до 24 часа/ }));
  expect(await screen.findByText("Напиши какво продаваш и на кого.")).toBeInTheDocument();
  expect(screen.getByText("Напиши телефон за връзка.")).toBeInTheDocument();
  expect(spy).not.toHaveBeenCalled();
  spy.mockRestore();
});

test("valid submit sends the lead and shows thank-you", async () => {
  const spy = jest.spyOn(leads, "submitLead").mockResolvedValue();
  render(<ChatGptAds nav={() => {}} />);
  fireEvent.change(screen.getByLabelText(/Какво продаваш/), { target: { value: "CRM за малки фирми" } });
  fireEvent.change(screen.getByLabelText(/Какъв месечен бюджет/), { target: { value: "€1 000–3 000" } });
  fireEvent.change(screen.getByLabelText(/Колко ти носи един клиент/), { target: { value: "€150–500" } });
  fireEvent.change(screen.getByLabelText(/^Име$/), { target: { value: "Иван" } });
  fireEvent.change(screen.getByLabelText(/^Имейл$/), { target: { value: "ivan@example.com" } });
  fireEvent.change(screen.getByLabelText(/^Телефон$/), { target: { value: "0888123456" } });
  fireEvent.change(screen.getByLabelText(/^Сайт$/), { target: { value: "https://example.com" } });
  fireEvent.click(screen.getByRole("button", { name: /Прати — ще ти пиша до 24 часа/ }));
  await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
  expect(spy.mock.calls[0][0]).toMatchObject({ name: "Иван", email: "ivan@example.com", phone: "0888123456", verdict: "за преглед" });
  expect(await screen.findByText(/Заявката е получена/)).toBeInTheDocument();
  spy.mockRestore();
});

test("successful submit fires the Meta Lead event via pixel and CAPI with one event id", async () => {
  const spy = jest.spyOn(leads, "submitLead").mockResolvedValue();
  window.fbq = jest.fn();
  global.fetch = jest.fn().mockResolvedValue({ ok: true });
  render(<ChatGptAds nav={() => {}} />);
  fireEvent.change(screen.getByLabelText(/Какво продаваш/), { target: { value: "CRM" } });
  fireEvent.change(screen.getByLabelText(/Какъв месечен бюджет/), { target: { value: "€500–1 000" } });
  fireEvent.change(screen.getByLabelText(/Колко ти носи един клиент/), { target: { value: "над €500" } });
  fireEvent.change(screen.getByLabelText(/^Име$/), { target: { value: "Иван Петров" } });
  fireEvent.change(screen.getByLabelText(/^Имейл$/), { target: { value: "ivan@example.com" } });
  fireEvent.change(screen.getByLabelText(/^Телефон$/), { target: { value: "0888123456" } });
  fireEvent.change(screen.getByLabelText(/^Сайт$/), { target: { value: "example.com" } });
  fireEvent.click(screen.getByRole("button", { name: /Прати — ще ти пиша до 24 часа/ }));
  await screen.findByText(/Заявката е получена/);
  await waitFor(() => expect(window.fbq).toHaveBeenCalledWith("track", "Lead", expect.any(Object), { eventID: expect.any(String) }));
  const eventId = window.fbq.mock.calls.find((c) => c[1] === "Lead")[3].eventID;
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  const capiCall = global.fetch.mock.calls.find((c) => c[0] === "/api/meta-capi");
  expect(JSON.parse(capiCall[1].body)).toMatchObject({ event_name: "Lead", event_id: eventId, user_data: { em: "ivan@example.com" } });
  spy.mockRestore();
});
