import { expect, test } from "@playwright/test";

test("от главной до сохранённой вершины в кабинете", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Видеть проблему целиком/i })).toBeVisible();
  await page.getByRole("link", { name: /Математика/i }).first().click();
  await page.getByRole("link", { name: /Гипотеза Римана/i }).click();
  await expect(page.getByTestId("graph-canvas")).toBeVisible();
  await page.getByText("Гипотеза Римана", { exact: true }).last().click();
  await expect(page.getByLabel("Карточка вершины")).toBeVisible();
  await page.getByRole("button", { name: /Открыть материал/i }).click();
  await expect(page.getByText("Демонстрационная запись")).toBeVisible();
  await page.getByRole("button", { name: /В избранное/i }).click();
  await page.goto("/login");
  await page.getByRole("button", { name: /Демонстрационный вход/i }).click();
  await expect(page).toHaveURL(/\/profile/);
  await expect(page.getByText("Гипотеза Римана", { exact: true })).toBeVisible();
});
