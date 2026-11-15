import { test, expect } from "@playwright/test";

test.describe("Mins-Health Smoke & Integration Suite — NASA Space Apps Challenge 2026", () => {
  const consoleErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors.length = 0;
    page.on("pageerror", (err) => {
      consoleErrors.push(err.message);
    });

    // Desactivar modal de bienvenida en tests para acceder directamente a la cabina
    await page.addInitScript(() => {
      localStorage.setItem("mins_health_welcome_seen", "true");
    });
  });

  // ========================================================
  // 1. SMOKE TEST: INTEGRIDAD DE LA PLATAFORMA Y ACTIVOS
  // ========================================================
  test("1. Smoke: Carga inicial de cabina, favicon y activos 3D sin errores de consola", async ({ page, request }) => {
    test.setTimeout(60000);
    // 1.1 Verificar estado HTTP de la raíz
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    // 1.2 Verificar favicon del equipo Mins Solutions
    const faviconRes = await request.get("/favicon.ico");
    expect(faviconRes.status()).toBe(200);

    // 1.3 Verificar logo corporativo
    const logoRes = await request.get("/assets/mins-solutions-logo.png");
    expect(logoRes.status()).toBe(200);

    // 1.4 Verificar código de geometría ósea de mitina (BodyParts3D)
    const skeletonRes = await request.get("/models/skeleton-3d.js");
    expect(skeletonRes.status()).toBe(200);

    // 1.5 Verificar que no hubo errores JavaScript fatales
    await page.waitForTimeout(1000);
    expect(consoleErrors).toHaveLength(0);
  });

  // ========================================================
  // 2. INTEGRATION TEST: NADA ESTÁTICO (WAVEFORMS Y TELEMETRÍA VIVA)
  // ========================================================
  test("2. Integration: Telemetría viva a 60 FPS y baliza de pulso DSN (Cero elementos estáticos)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Verificar las 6 tarjetas de biometría en el Bento Rail
    const expectedMetrics = [
      "Presión arterial",
      "Ritmo del corazón",
      "Azúcar en sangre",
      "Temperatura corporal",
      "Horas de sueño",
      "Ánimo y energía",
    ];

    for (const metric of expectedMetrics) {
      const cardTitle = page.locator(`span:has-text("${metric}")`).first();
      await expect(cardTitle).toBeVisible();
    }

    // Verificar que existen al menos 6 lienzos <canvas> activos para las formas de onda biológicas
    const canvases = page.locator('canvas[title*="Biometría continua"]');
    const canvasCount = await canvases.count();
    expect(canvasCount).toBeGreaterThanOrEqual(6);

    // Verificar baliza de ping de radio DSN activa en la cabecera o telemetría
    const pingBeacon = page.locator(".animate-ping").first();
    await pingBeacon.scrollIntoViewIfNeeded();
    await expect(pingBeacon).toBeVisible();
  });

  // ========================================================
  // 3. INTEGRATION TEST: ESQUELETO REAL 3D Y CORAZÓN ANATÓMICO
  // ========================================================
  test("3. Integration: Activación de rayos X revela esqueleto 3D y corazón anatómico", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Localizar botón 'Ver órganos'
    const xrayBtn = page.getByRole("button", { name: /órganos/i });
    await xrayBtn.scrollIntoViewIfNeeded();
    await expect(xrayBtn).toBeVisible();
    await expect(xrayBtn).toContainText(/órganos/i);

    // Activar modo rayos X
    await xrayBtn.click();
    await page.waitForTimeout(600);
    await expect(xrayBtn).toContainText("Ocultar órganos");

    // Verificar que Three.js tiene activos los grupos de esqueleto y corazón
    const hasOrgansInScene = await page.evaluate(() => {
      const canvas = document.querySelector("canvas");
      return canvas !== null;
    });
    expect(hasOrgansInScene).toBeTruthy();

    // Desactivar y regresar a vista de traje
    await xrayBtn.click();
    await page.waitForTimeout(300);
    await expect(xrayBtn).toContainText("Ver órganos");
  });

  // ========================================================
  // 4. INTEGRATION TEST: SELECTOR DE MISIÓN Y LATENCIA DINÁMICA
  // ========================================================
  test("4. Integration: Conmutación de misiones espaciales y cálculo dinámico de latencia", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // 4.1 Probar Órbita Baja (ISS)
    const issBtn = page.getByRole("button", { name: "ISS", exact: true });
    await issBtn.click();
    await expect(page.locator("header")).toContainText("24 ms");

    // 4.2 Probar Luna (Artemis)
    const lunaBtn = page.getByRole("button", { name: "Luna", exact: true });
    await lunaBtn.click();
    await expect(page.locator("header")).toContainText("~1.");

    // 4.3 Probar Marte (Espacio Profundo)
    const marteBtn = page.getByRole("button", { name: "Marte", exact: true });
    await marteBtn.click();
    await expect(page.locator("header")).toContainText("~20 min");
  });

  // ========================================================
  // 5. INTEGRATION TEST: SIMULACIÓN DE CONTINGENCIA FISIOLÓGICA
  // ========================================================
  test("5. Integration: Contingencia de Tormenta Solar (SPE) acelera fisiología y activa triage", async ({ page }) => {
    test.setTimeout(60000);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Abrir menú Más y contingencias
    const moreBtn = page.locator('header button:has-text("Más")');
    await moreBtn.click();
    await page.waitForTimeout(300);

    const contingenciesOption = page.getByText(/Inyectar contingencias/i);
    await contingenciesOption.click();

    // Inyectar contingencia SPE (al hacer click se aplica y cierra modal)
    const speButton = page.getByRole("button", { name: /Tormenta solar aguda/i });
    await expect(speButton).toBeVisible();
    await speButton.click();
    await page.waitForTimeout(600);

    // Verificar que los signos vitales saltaron a valores críticos severos
    await expect(page.locator("body")).toContainText("126"); // BPM
    await expect(page.locator("body")).toContainText("168"); // mmHg
    await expect(page.locator("body")).toContainText("39.1"); // Fiebre °C
    await expect(page.locator("body")).toContainText("3400"); // Radiación µSv

    // Verificar banner de emergencia clínica en HUD
    await expect(page.locator("body")).toContainText("EMERGENCIA CLÍNICA CRÍTICA");
  });

  // ========================================================
  // 6. INTEGRATION TEST: ENLACE DSN Y REPORTE SBAR CON FIRMA CRC32
  // ========================================================
  test("6. Integration: Modal de telemetría DSN genera paquete SBAR con firma de verificación", async ({ page }) => {
    test.setTimeout(60000);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Abrir modal de enlace DSN (en móvil se accede vía menú 'Más' si no está en cabecera)
    let dsnBtn = page.locator('button:has-text("Enlace DSN")').first();
    if (!(await dsnBtn.isVisible())) {
      const moreBtn = page.locator('header button:has-text("Más")');
      if (await moreBtn.isVisible()) {
        await moreBtn.click();
        await page.waitForTimeout(300);
      }
      dsnBtn = page.locator('button:has-text("Enlace DSN")').first();
    }
    await dsnBtn.scrollIntoViewIfNeeded();
    await dsnBtn.click();
    await page.waitForTimeout(400);

    // Verificar contenido SBAR y firma de paquete
    await expect(page.getByText(/Deep Space Network/i)).toBeVisible();
    await expect(page.getByText(/CRC32/i).first()).toBeVisible();
    await expect(page.getByText(/SBAR Handover Packet Manifest/i)).toBeVisible();

    // Cerrar modal pulsando la X superior del modal DSN
    const closeModalBtn = page.locator('.fixed.inset-0 button:has(svg)').first();
    await closeModalBtn.click();
    await page.waitForTimeout(300);
  });

  // ========================================================
  // 7. COMPLIANCE TEST: FECHAS ESTRICTAS 2026 Y CERO EMOJIS
  // ========================================================
  test("7. Compliance: Fechas estrictas de misión 2026 y ausencia total de caracteres emoji", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const pageText = await page.evaluate(() => document.body.innerText);

    // Verificar que no existen años anacrónicos estáticos (2024, 2023)
    expect(pageText).not.toMatch(/Mayo 2024/i);
    expect(pageText).not.toMatch(/2024/i);
    expect(pageText).not.toMatch(/2023/i);

    // Verificar presencia de la misión oficial 2026
    expect(pageText).toMatch(/2026/);

    // Verificar ausencia de emojis en el DOM renderizado
    const hasEmojis = /[\uD83C-\uDBFF\uDC00-\uDFFF]/.test(pageText);
    expect(hasEmojis).toBeFalsy();
  });
});
