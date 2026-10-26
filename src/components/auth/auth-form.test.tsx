import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthForm } from "./auth-form";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("регистрационная форма", () => {
  it("показывает ошибки валидации", async () => {
    render(<AuthForm mode="register" />);
    fireEvent.click(screen.getByRole("button", { name: /Создать аккаунт/i }));
    await waitFor(() => expect(screen.getByText("Укажите имя")).toBeVisible());
    expect(screen.getByText("Введите корректный адрес электронной почты")).toBeVisible();
  });
});
