import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Calculator from "./Calculator";

test("defaults to the mortgage tab and shows a euro payment", () => {
  render(<Calculator onRequest={() => {}} />);
  expect(screen.getByRole("tab", { name: "Ипотечен" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByTestId("calc-payment").textContent).toMatch(/€/);
  expect(screen.getByText("Ориентировъчно изчисление, не е оферта.")).toBeInTheDocument();
});

test("consumer tab hides the down payment field", () => {
  render(<Calculator onRequest={() => {}} />);
  expect(screen.getByLabelText("Самоучастие (%)")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: "Потребителски" }));
  expect(screen.queryByLabelText("Самоучастие (%)")).not.toBeInTheDocument();
});

test("garbage in the years field falls back to the default on blur, never NaN", () => {
  const { container } = render(<Calculator onRequest={() => {}} />);
  const years = screen.getByLabelText("Срок (години)");
  fireEvent.change(years, { target: { value: "абв" } });
  expect(container.textContent).not.toMatch(/NaN|Infinity/);
  fireEvent.blur(years);
  expect(years).toHaveValue(30);
  expect(container.textContent).not.toMatch(/NaN|Infinity/);
});

test("huge amount is clamped to the type maximum on blur", () => {
  render(<Calculator onRequest={() => {}} />);
  const amount = screen.getByLabelText("Стойност на имота (€)");
  fireEvent.change(amount, { target: { value: "9999999" } });
  fireEvent.blur(amount);
  expect(amount).toHaveValue(600000);
});

test("request button passes the current values", () => {
  const onRequest = jest.fn();
  render(<Calculator onRequest={onRequest} />);
  fireEvent.click(screen.getByRole("button", { name: /Искам реални оферти/ }));
  expect(onRequest).toHaveBeenCalledTimes(1);
  const v = onRequest.mock.calls[0][0];
  expect(v.type).toBe("ipo");
  expect(v.amount).toBe(160000);
  expect(typeof v.payment).toBe("number");
  expect(v.payment).toBeGreaterThan(0);
});

test("shows total payments", () => {
  render(<Calculator onRequest={() => {}} />);
  expect(screen.getByText("Общо плащания")).toBeInTheDocument();
});
