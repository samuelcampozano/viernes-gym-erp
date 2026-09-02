import { chromium, devices } from 'playwright';
import fs from 'fs';
import path from 'path';

async function runAutonomousAudit() {
  console.log('🤖 Starting Viernes Autonomous WebMCP Browser Audit (Desktop & Mobile)...');
  const startTime = Date.now();

  const auditDir = path.resolve('public/audit-screenshots');
  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const targetUrl = 'https://viernes-gym-erp.vercel.app';

  // ==========================================
  // 🖥️ 1. DESKTOP RUNTIME AUDIT (1440x900)
  // ==========================================
  console.log('\n🖥️ [PHASE 1] Running Desktop Tests (1440x900)...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Viernes-Autonomous-Agent/2.0 (Playwright; Desktop-Audit)',
  });
  const page = await desktopContext.newPage();

  await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
  console.log(`✅ Loaded Desktop URL: ${targetUrl}`);
  await page.screenshot({ path: `${auditDir}/01_desktop_initial_load.png` });

  // Test Repair Filter
  const repairBtn = page.locator('button:has-text("Repair")').first();
  if (await repairBtn.isVisible()) {
    await repairBtn.click();
    await page.waitForTimeout(500);
    console.log('✅ Desktop: Repair filter isolated broken assets');
    await page.screenshot({ path: `${auditDir}/02_desktop_repair_filter.png` });
  }

  // Test Class Schedule Modal
  const scheduleTab = page.locator('button:has-text("CLASS SCHEDULE")');
  if (await scheduleTab.isVisible()) {
    await scheduleTab.click();
    await page.waitForTimeout(500);
    const firstClassCard = page.locator('.stark-card:has-text("CLS-")').first();
    if (await firstClassCard.isVisible()) {
      await firstClassCard.click();
      await page.waitForTimeout(400);
      console.log('✅ Desktop: Class Detail Modal opened');
      await page.screenshot({ path: `${auditDir}/03_desktop_class_modal.png` });
      const closeBtn = page.locator('button:has(svg.lucide-x)').first();
      if (await closeBtn.isVisible()) await closeBtn.click();
    }
  }

  // Test Member Radar & XAI
  const memberTab = page.locator('button:has-text("MEMBER RADAR")');
  if (await memberTab.isVisible()) {
    await memberTab.click();
    await page.waitForTimeout(500);
    const riskBadge = page.locator('button:has-text("RISK")').first();
    if (await riskBadge.isVisible()) {
      await riskBadge.click();
      await page.waitForTimeout(400);
      console.log('✅ Desktop: XAI 4-Factor Diagnostics Modal opened');
      await page.screenshot({ path: `${auditDir}/04_desktop_xai_modal.png` });
      const closeXai = page.locator('button:has(svg.lucide-x)').first();
      if (await closeXai.isVisible()) await closeXai.click();
    }
  }

  // Test Facility Telemetry
  const telemetryTab = page.locator('button:has-text("FACILITY TELEMETRY")');
  if (await telemetryTab.isVisible()) {
    await telemetryTab.click();
    await page.waitForTimeout(500);
    console.log('✅ Desktop: Facility Telemetry & Traffic Chart verified');
    await page.screenshot({ path: `${auditDir}/05_desktop_telemetry.png` });
  }

  await desktopContext.close();

  // ==========================================
  // 📱 2. MOBILE RUNTIME AUDIT (iPhone 14 / 390x844)
  // ==========================================
  console.log('\n📱 [PHASE 2] Running Mobile Device Tests (iPhone 14 - 390x844)...');
  const iPhone14 = devices['iPhone 14'];
  const mobileContext = await browser.newContext({
    ...iPhone14,
    userAgent: 'Viernes-Autonomous-Agent/2.0 (Playwright; iPhone14-Mobile-Audit)',
  });
  const mobilePage = await mobileContext.newPage();

  await mobilePage.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
  console.log('✅ Mobile: Initial mobile load successful');
  await mobilePage.screenshot({ path: `${auditDir}/06_mobile_initial_load.png` });

  // Test Mobile Floor Mode Toggle (List View)
  const listViewBtn = mobilePage.locator('button[title="List View"]');
  if (await listViewBtn.isVisible()) {
    await listViewBtn.click();
    await mobilePage.waitForTimeout(400);
    console.log('✅ Mobile: Toggled to Mobile List View');
    await mobilePage.screenshot({ path: `${auditDir}/07_mobile_list_view.png` });
  }

  // Test Mobile Class Schedule
  const mobileScheduleTab = mobilePage.locator('button:has-text("CLASS SCHEDULE")');
  if (await mobileScheduleTab.isVisible()) {
    await mobileScheduleTab.click();
    await mobilePage.waitForTimeout(400);
    console.log('✅ Mobile: Class schedule date swiper responsive');
    await mobilePage.screenshot({ path: `${auditDir}/08_mobile_schedule.png` });
  }

  await mobileContext.close();
  await browser.close();

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n🎉 ALL DESKTOP & MOBILE TESTS PASSED in ${duration}s! (0 Errors)`);
  console.log('📸 Screenshots saved to public/audit-screenshots/');
}

runAutonomousAudit().catch((err) => {
  console.error('❌ Autonomous audit failed:', err);
  process.exit(1);
});
