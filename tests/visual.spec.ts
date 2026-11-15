import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

test.describe("Mins-Health Visual & Layout Verification", () => {
  test.beforeEach(async ({ page }) => {
    page.on("console", (msg) => console.log("BROWSER LOG:", msg.type(), msg.text()));
    page.on("pageerror", (err) => console.log("BROWSER ERROR:", err.message));
    // Marcar el tour como visto en localStorage para empezar directamente en la cabina
    await page.addInitScript(() => {
      localStorage.setItem("mins_health_welcome_seen", "true");
    });
  });

  test("1. Vista General de Cabina (3 Zonas) y sin desbordamiento horizontal", async ({ page }, testInfo) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500); // Esperar render Three.js

    // Verificar que no haya overflow horizontal no deseado
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBeFalsy();

    // Guardar captura
    const screenshotDir = path.join(process.cwd(), "tests", "screenshots");
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    const cleanProjectName = testInfo.project.name.replace(/[^a-zA-Z0-9_-]/g, "_");
    await page.screenshot({
      path: path.join(screenshotDir, `cockpit_${cleanProjectName}.png`),
      fullPage: false,
    });
  });

  test("2. Apertura del Menú 'Más' y alineación de opciones", async ({ page }, testInfo) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Buscar y pulsar el botón 'Más' exacto en la cabecera
    const moreBtn = page.getByRole("button", { name: "Más", exact: true });
    await expect(moreBtn).toBeVisible();
    await moreBtn.click();
    await page.waitForTimeout(500);

    const screenshotDir = path.join(process.cwd(), "tests", "screenshots");
    const cleanProjectName = testInfo.project.name.replace(/[^a-zA-Z0-9_-]/g, "_");
    await page.screenshot({
      path: path.join(screenshotDir, `more_menu_${cleanProjectName}.png`),
    });
  });

  test("3. Asistente de Chequeo Diario (Paso 1)", async ({ page }, testInfo) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Hacer clic en el botón de chequeo diario (se adapta a texto completo o compacto)
    const checkupBtn = page.getByRole("button", { name: /chequeo/i });
    await expect(checkupBtn).toBeVisible();
    await checkupBtn.click();
    await page.waitForTimeout(500);

    const screenshotDir = path.join(process.cwd(), "tests", "screenshots");
    const cleanProjectName = testInfo.project.name.replace(/[^a-zA-Z0-9_-]/g, "_");
    await page.screenshot({
      path: path.join(screenshotDir, `checkup_wizard_${cleanProjectName}.png`),
    });
  });

  test("4. Rotación interactiva con ratón en el visor 3D", async ({ page }, testInfo) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);

    // Simular arrastre del ratón sobre el canvas 3D
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();
    const box = await canvas.boundingBox();
    if (box) {
      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX + 120, centerY, { steps: 10 });
      await page.mouse.up();
    }
    await page.waitForTimeout(600);

    const screenshotDir = path.join(process.cwd(), "tests", "screenshots");
    const cleanProjectName = testInfo.project.name.replace(/[^a-zA-Z0-9_-]/g, "_");
    await page.screenshot({
      path: path.join(screenshotDir, `astronaut_rotated_${cleanProjectName}.png`),
    });
  });
});
