import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "./schemas";

describe("формы авторизации", () => {
  it("отклоняет слабый пароль и некорректную почту", () => expect(loginSchema.safeParse({ email: "mail", password: "123" }).success).toBe(false));
  it("принимает заполненную регистрационную форму", () => expect(registerSchema.safeParse({ name: "Анна", email: "anna@example.org", password: "science-2026", consent: true }).success).toBe(true));
  it("требует согласие", () => expect(registerSchema.safeParse({ name: "Анна", email: "anna@example.org", password: "science-2026", consent: false }).success).toBe(false));
});
