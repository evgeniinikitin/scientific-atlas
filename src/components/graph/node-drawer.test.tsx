import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NodeDrawer } from "./node-drawer";
import { problems } from "@/data/atlas";

describe("карточка вершины", () => {
  it("открывает сведения и связанный материал", async () => {
    const problem = problems[0];
    render(<NodeDrawer node={problem.nodes[0]} problem={problem} onClose={vi.fn()} onNavigate={vi.fn()} />);
    expect(screen.getByRole("heading", { name: "Гипотеза Римана" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /Открыть материал/i }));
    await waitFor(() => expect(screen.getByText("Демонстрационная запись")).toBeInTheDocument());
  });
});
