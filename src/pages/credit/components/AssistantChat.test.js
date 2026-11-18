import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import AssistantChat from "./AssistantChat";

test("walking the consumer path and sending passes a prefill with the transcript", () => {
  const onSend = jest.fn();
  render(<AssistantChat onSend={onSend} delay={0} />);
  expect(screen.getByText("Демо асистент")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Потребителски" }));
  fireEvent.click(screen.getByRole("button", { name: "10–25 000 €" }));
  fireEvent.click(screen.getByRole("button", { name: "1 500–3 000 €" }));
  expect(screen.getByText(/от 14 банки/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Изпрати като запитване" }));
  expect(onSend).toHaveBeenCalledTimes(1);
  const p = onSend.mock.calls[0][0];
  expect(p).toMatchObject({ type: "pot", amount: 17000, income: 2200 });
  expect(p.chat.length).toBeGreaterThanOrEqual(7);
});
