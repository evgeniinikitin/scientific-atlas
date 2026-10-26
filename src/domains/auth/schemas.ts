import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Введите корректный адрес электронной почты"),
  password: z.string().min(8, "Пароль должен содержать не менее 8 символов"),
});

export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2, "Укажите имя"),
  consent: z.literal(true, { errorMap: () => ({ message: "Необходимо принять условия" }) }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
