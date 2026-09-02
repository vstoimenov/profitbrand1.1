import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatGptAds from "./ChatGptAds";
import * as leads from "../lib/leads";

beforeEach(() => {
  window.scrollTo = jest.fn();
  Element.prototype.scrollIntoView = jest.fn();
});

test("renders the hero headline and no agency prices", () => {
  render(<ChatGptAds nav={() => {}} />);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/ChatGPT започна да показва реклами/);
  const body = document.body.textContent;
  expect(body).not.toMatch(/€\s?490/);
  expect(body).not.toMatch(/€\s?390/);
  expect(body).not.toMatch(/1\s?480/);
  expect(body).not.toMatch(/200\s?000/);
  const shot = screen.getByRole("img", { name: /Sponsored/ });
  expect(shot).toHaveAttribute("src", "/chatgpt-ad-example.jpg");
});

test("empty submit shows validation errors and does not send", async () => {
  const spy = jest.spyOn(leads, "submitLead").mockResolvedValue();
  render(<ChatGptAds nav={() => {}} />);
  fireEvent.click(screen.getByRole("button", { name: /ПРАТИ ЗАЯВКАТА/ }));
  expect(await screen.findByText("Напиши какво продаваш и на кого.")).toBeInTheDocument();
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
  fireEvent.change(screen.getByLabelText(/^Сайт$/), { target: { value: "https://example.com" } });
  fireEvent.click(screen.getByRole("button", { name: /ПРАТИ ЗАЯВКАТА/ }));
  await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
  expect(spy.mock.calls[0][0]).toMatchObject({ name: "Иван", email: "ivan@example.com", verdict: "за преглед" });
  expect(await screen.findByText(/Заявката е получена/)).toBeInTheDocument();
  spy.mockRestore();
});

test("failed submit shows an error and keeps the form", async () => {
  const spy = jest.spyOn(leads, "submitLead").mockRejectedValue(new Error("no-endpoint"));
  render(<ChatGptAds nav={() => {}} />);
  fireEvent.change(screen.getByLabelText(/Какво продаваш/), { target: { value: "CRM" } });
  fireEvent.change(screen.getByLabelText(/Какъв месечен бюджет/), { target: { value: "€500–1 000" } });
  fireEvent.change(screen.getByLabelText(/Колко ти носи един клиент/), { target: { value: "над €500" } });
  fireEvent.change(screen.getByLabelText(/^Име$/), { target: { value: "Иван" } });
  fireEvent.change(screen.getByLabelText(/^Имейл$/), { target: { value: "ivan@example.com" } });
  fireEvent.change(screen.getByLabelText(/^Сайт$/), { target: { value: "example.com" } });
  fireEvent.click(screen.getByRole("button", { name: /ПРАТИ ЗАЯВКАТА/ }));
  expect(await screen.findByText(/Нещо се обърка/)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /ПРАТИ ЗАЯВКАТА/ })).toBeInTheDocument();
  spy.mockRestore();
});
