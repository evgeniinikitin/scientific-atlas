"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { loginSchema } from "@/domains/auth/schemas";
import { useUserStore } from "@/domains/user/store";
import { getSupabaseBrowserClient, hasSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export function AuthForm({ mode }: { mode: "login" | "register" | "recover" }) {
  const router = useRouter();
  const startDemoSession = useUserStore((state) => state.startDemoSession);
  const [recoverEmail, setRecoverEmail] = useState("");
  const [recoverError, setRecoverError] = useState("");
  const schema = z.object({
    email: z.string().email("Введите корректный адрес электронной почты"),
    password: z.string().min(8, "Пароль должен содержать не менее 8 символов"),
    name: z.string().optional(),
    consent: z.boolean().optional(),
  }).superRefine((values, context) => {
    if (mode === "register" && (!values.name || values.name.trim().length < 2)) context.addIssue({ code: "custom", path: ["name"], message: "Укажите имя" });
    if (mode === "register" && !values.consent) context.addIssue({ code: "custom", path: ["consent"], message: "Необходимо принять условия" });
  });
  type FormValues = z.infer<typeof schema>;
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "", name: "", consent: false } });

  if (mode === "recover") return <form className="auth-form" onSubmit={async (event) => { event.preventDefault(); if (!loginSchema.shape.email.safeParse(recoverEmail).success) { setRecoverError("Введите корректный адрес"); return; } const supabase = getSupabaseBrowserClient(); if (!supabase) { setRecoverError("Восстановление пароля станет доступно после подключения Supabase."); return; } const { error } = await supabase.auth.resetPasswordForEmail(recoverEmail, { redirectTo: `${location.origin}/login` }); if (error) setRecoverError(error.message); else toast.success("Письмо для восстановления отправлено"); }}>
    <div className="form-field"><label htmlFor="recover-email">Электронная почта</label><input id="recover-email" className="form-input" type="email" value={recoverEmail} onChange={(event) => { setRecoverEmail(event.target.value); setRecoverError(""); }} /><span className="field-error">{recoverError}</span></div><Button type="submit">Отправить ссылку <ArrowRight size={15} /></Button><p className="form-hint"><Link href="/login">Вернуться ко входу</Link></p>
  </form>;

  const submit = async (values: FormValues) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setError("root", { message: mode === "register" ? "Регистрация требует подключения Supabase. Для просмотра кабинета используйте демо-вход." : "Supabase не подключён. Используйте демонстрационный вход ниже." }); return; }
    if (mode === "register") {
      const { error } = await supabase.auth.signUp({ email: values.email, password: values.password, options: { data: { name: values.name } } });
      if (error) { setError("root", { message: error.message }); return; }
      toast.success("Проверьте почту для подтверждения регистрации"); router.push("/login");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password });
      if (error) { setError("root", { message: "Не удалось войти. Проверьте почту и пароль." }); return; }
      toast.success("Вы вошли в систему"); router.push("/profile");
    }
  };

  return <form className="auth-form" onSubmit={handleSubmit(submit)} noValidate>
    {mode === "register" && <div className="form-field"><label htmlFor="name">Имя</label><input id="name" className="form-input" autoComplete="name" {...register("name")} /><span className="field-error">{"name" in errors ? errors.name?.message : ""}</span></div>}
    <div className="form-field"><label htmlFor="email">Электронная почта</label><input id="email" className="form-input" type="email" autoComplete="email" {...register("email")} /><span className="field-error">{errors.email?.message}</span></div>
    <div className="form-field"><label htmlFor="password">Пароль</label><input id="password" className="form-input" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} {...register("password")} /><span className="field-error">{errors.password?.message}</span></div>
    {mode === "register" && <label className="consent"><input type="checkbox" {...register("consent")} /><span>Я принимаю условия обработки данных</span></label>}
    {"consent" in errors && <span className="field-error">{errors.consent?.message}</span>}
    {errors.root && <div className="form-error" role="alert">{errors.root.message}</div>}
    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <LoaderCircle className="spin" size={16} /> : null}{mode === "login" ? "Войти" : "Создать аккаунт"}<ArrowRight size={15} /></Button>
    {mode === "login" && <button type="button" className="demo-login" onClick={() => { startDemoSession(); toast.success("Локальная демонстрационная сессия запущена"); router.push("/profile"); }}><b>Открыть демонстрационный профиль</b><span>Данные останутся в этом браузере</span></button>}
    <p className="form-hint">{mode === "login" ? <><Link href="/recover">Забыли пароль?</Link><br />Нет аккаунта? <Link href="/register">Зарегистрироваться</Link></> : <>Уже есть аккаунт? <Link href="/login">Войти</Link></>}</p>
    {!hasSupabase && <p className="supabase-status"><i /> Supabase не подключён. Доступна только явно обозначенная локальная демо-сессия.</p>}
  </form>;
}
