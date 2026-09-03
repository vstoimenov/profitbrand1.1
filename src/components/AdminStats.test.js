import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminStats from "./AdminStats";

const stats = {
  days: 7,
  totals: { views: 120, sessions: 80, leads: 4, leads_all_time: 9, views_today: 10, sessions_today: 7, leads_today: 1, landing_views: 60, landing_sessions: 40 },
  daily: [
    { day: "2026-09-01", views: 50, sessions: 30, leads: 1 },
    { day: "2026-09-02", views: 70, sessions: 50, leads: 3 },
  ],
  paths: [{ path: "/chatgpt-ads", views: 60, sessions: 40 }, { path: "/", views: 60, sessions: 45 }],
  referrers: [{ referrer: "https://l.facebook.com/", views: 55 }],
  sources: [{ source: "fb", views: 55 }],
  devices: [{ device: "mobile", views: 90 }, { device: "desktop", views: 30 }],
  leads: [{ id: "1", created_at: "2026-09-03T03:40:21Z", name: "Иван", email: "ivan@example.com", phone: "0888", website: "irida.bg", sells: "Имоти", budget: "€500–1 000", client_value: "над €500", verdict: "за преглед", source: "direct" }],
};

test("renders totals, conversion, lists and leads", () => {
  render(<AdminStats stats={stats} days={7} onDays={() => {}} onRefresh={() => {}} />);
  expect(screen.getByText("120")).toBeInTheDocument();
  expect(screen.getByText("80")).toBeInTheDocument();
  expect(screen.getByText("5.0%")).toBeInTheDocument(); // 4 leads / 80 sessions
  expect(screen.getByText("/chatgpt-ads")).toBeInTheDocument();
  expect(screen.getByText("https://l.facebook.com/")).toBeInTheDocument();
  expect(screen.getByText("ivan@example.com")).toBeInTheDocument();
});

test("range buttons call onDays and loading/error states render", () => {
  const onDays = jest.fn();
  const { rerender } = render(<AdminStats stats={stats} days={7} onDays={onDays} onRefresh={() => {}} />);
  fireEvent.click(screen.getByRole("button", { name: "30 дни" }));
  expect(onDays).toHaveBeenCalledWith(30);
  rerender(<AdminStats stats={null} loading days={7} onDays={onDays} onRefresh={() => {}} />);
  expect(screen.getByText(/Зареждам/)).toBeInTheDocument();
  rerender(<AdminStats stats={null} error="unauthorized" days={7} onDays={onDays} onRefresh={() => {}} />);
  expect(screen.getByText(/unauthorized/)).toBeInTheDocument();
});
