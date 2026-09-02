import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function recordUltraHDDemo() {
  console.log('💎 Starting ULTRA-SHARP (1080p Full HD + 2x Retina Scale) Hackathon Demo Recording...');
  const outputDir = path.resolve('public/demo-video');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Launch Chromium with High DPI Retina settings for 100% crystal-clear, zero-blur text
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--window-size=1920,1080',
      '--force-device-scale-factor=2',
      '--high-dpi-support=1',
      '--disable-gpu-rasterization=false',
      '--no-sandbox',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2, // 2x Retina scaling for ultra-sharp vector typography
    colorScheme: 'dark',
    recordVideo: {
      dir: outputDir,
      size: { width: 1920, height: 1080 },
    },
    userAgent: 'Viernes-UltraHD-Recorder/2.0 (High-DPI 2x Retina)',
  });

  const page = await context.newPage();
  const targetUrl = 'https://viernes-gym-erp.vercel.app';

  console.log(`🌐 Navigating to ${targetUrl}...`);
  await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Helper for steady hover
  async function steadyHover(selector, delay = 1200) {
    const el = page.locator(selector).first();
    if (await el.isVisible()) {
      await el.hover();
      await page.waitForTimeout(delay);
    }
  }

  // ==========================================
  // SCENE 1: INTRODUCTION & 2D BLUEPRINT (0:00 - 0:32)
  // ==========================================
  console.log('🎬 [0:00 - 0:32] Scene 1: Ultra-Crisp Introduction & 2D Blueprint...');
  await page.waitForTimeout(3000);

  // Steady hover across machines to show crisp tooltips
  await steadyHover('div:has-text("RACK-01")');
  await steadyHover('div:has-text("CARDIO-01")');
  await steadyHover('div:has-text("RECOVERY-01")');

  // Click Sector Filter: Strength
  console.log('🎬 Clicking Strength sector filter...');
  const strengthBtn = page.locator('button:has-text("Strength")').first();
  if (await strengthBtn.isVisible()) {
    await strengthBtn.click();
    await page.waitForTimeout(2500);
  }

  // Click Repair Filter: Isolates broken machines
  console.log('🎬 Clicking Repair filter button...');
  const repairBtn = page.locator('button:has-text("Repair")').first();
  if (await repairBtn.isVisible()) {
    await repairBtn.click();
    await page.waitForTimeout(3000);
  }

  // 1-Click Operational Toggle
  console.log('🎬 Clicking 1-click Operational status pill...');
  const operationalBtn = page.locator('button:has-text("Operational")').first();
  if (await operationalBtn.isVisible()) {
    await operationalBtn.click();
    await page.waitForTimeout(2500);
  }

  // Reset filter back to All
  const allBtn = page.locator('button:has-text("All")').first();
  if (await allBtn.isVisible()) {
    await allBtn.click();
    await page.waitForTimeout(1500);
  }

  // ==========================================
  // SCENE 2: CLASS SCHEDULER & INTERACTIVE MODAL (0:32 - 1:05)
  // ==========================================
  console.log('🎬 [0:32 - 1:05] Scene 2: Class Scheduler & Booking Controls...');
  const scheduleTab = page.locator('button:has-text("CLASS SCHEDULE")');
  if (await scheduleTab.isVisible()) {
    await scheduleTab.click();
    await page.waitForTimeout(2500);

    // Click on Friday date
    const friBtn = page.locator('button:has-text("FRI")').first();
    if (await friBtn.isVisible()) {
      await friBtn.click();
      await page.waitForTimeout(2000);
    }

    // Click Class Card to open Interactive Modal
    const classCard = page.locator('.stark-card:has-text("CLS-")').first();
    if (await classCard.isVisible()) {
      await classCard.click();
      await page.waitForTimeout(2500);

      // Simulate +1 booking
      const plusBtn = page.locator('button:has-text("+1")').first();
      if (await plusBtn.isVisible()) {
        await plusBtn.click();
        await page.waitForTimeout(1200);
      }

      // Save & Update Schedule
      const saveBtn = page.locator('button:has-text("Save & Update")').first();
      if (await saveBtn.isVisible()) {
        await saveBtn.click();
        await page.waitForTimeout(3000); // Watch confetti
      }
    }
  }

  // ==========================================
  // SCENE 3: MEMBER RADAR & XAI CHURN CRM (1:05 - 1:40)
  // ==========================================
  console.log('🎬 [1:05 - 1:40] Scene 3: Member Radar & Explainable AI (XAI)...');
  const memberTab = page.locator('button:has-text("MEMBER RADAR")');
  if (await memberTab.isVisible()) {
    await memberTab.click();
    await page.waitForTimeout(2500);

    // Open XAI 4-factor math breakdown modal
    const riskBadge = page.locator('button:has-text("RISK")').first();
    if (await riskBadge.isVisible()) {
      await riskBadge.click();
      await page.waitForTimeout(4000); // Inspect 4-factor formula

      // Close modal
      const closeXai = page.locator('button:has(svg.lucide-x)').first();
      if (await closeXai.isVisible()) {
        await closeXai.click();
        await page.waitForTimeout(1500);
      }
    }

    // Open Retention Campaign Drawer
    const draftPerkBtn = page.locator('button:has-text("Draft Perk")').first();
    if (await draftPerkBtn.isVisible()) {
      await draftPerkBtn.click();
      await page.waitForTimeout(2500);

      // Click Edit Copy
      const editCopyBtn = page.locator('button:has-text("Edit Copy")').first();
      if (await editCopyBtn.isVisible()) {
        await editCopyBtn.click();
        await page.waitForTimeout(1500);
      }

      // Dispatch Campaign
      const dispatchBtn = page.locator('button:has-text("Dispatch Retention Campaign")').or(page.locator('button:has-text("Save & Dispatch")')).first();
      if (await dispatchBtn.isVisible()) {
        await dispatchBtn.click();
        await page.waitForTimeout(3500); // Confetti
      }

      // Close drawer
      const closeDrawer = page.locator('button:has(svg.lucide-x)').first();
      if (await closeDrawer.isVisible()) {
        await closeDrawer.click();
        await page.waitForTimeout(1500);
      }
    }
  }

  // ==========================================
  // SCENE 4: FACILITY TELEMETRY & MRR SIMULATOR (1:40 - 2:10)
  // ==========================================
  console.log('🎬 [1:40 - 2:10] Scene 4: Facility Telemetry & Sensitivity Presets...');
  const telemetryTab = page.locator('button:has-text("FACILITY TELEMETRY")');
  if (await telemetryTab.isVisible()) {
    await telemetryTab.click();
    await page.waitForTimeout(2500);

    // Click Preset 2: Hyrox Expansion
    const preset2 = page.locator('button:has-text("2. Hyrox Expansion")');
    if (await preset2.isVisible()) {
      await preset2.click();
      await page.waitForTimeout(2500);
    }

    // Click Preset 3: Obsidian Maximizer
    const preset3 = page.locator('button:has-text("3. Obsidian Maximizer")');
    if (await preset3.isVisible()) {
      await preset3.click();
      await page.waitForTimeout(3000);
    }
  }

  // ==========================================
  // SCENE 5: WEBMCP AI CO-PILOT AGENT SCENARIOS (2:10 - 2:38)
  // ==========================================
  console.log('🎬 [2:10 - 2:38] Scene 5: WebMCP AI Co-Pilot & Execution Logs...');
  const floorTab = page.locator('button:has-text("FLOOR COMMANDER")');
  if (await floorTab.isVisible()) {
    await floorTab.click();
    await page.waitForTimeout(1500);
  }

  // Trigger Scenario 1 on HUD
  const scenarioBtn = page.locator('button:has-text("1. Broken Cable")');
  if (await scenarioBtn.isVisible()) {
    await scenarioBtn.click();
    await page.waitForTimeout(4500); // Observe orange pulse on Rack node
  }

  // Open Tool Execution Logs Console
  const logsBtn = page.locator('button:has-text("Logs")');
  if (await logsBtn.isVisible()) {
    await logsBtn.click();
    await page.waitForTimeout(3500); // Show full JSON telemetry & 18ms latency
  }

  console.log('🎬 Finalizing Ultra-HD video recording...');
  await page.waitForTimeout(2000);

  await page.close();
  await context.close();
  await browser.close();

  // Find generated video and copy as ultra-sharp output
  const videoFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith('.webm'));
  if (videoFiles.length > 0) {
    const latestVideo = path.join(outputDir, videoFiles[videoFiles.length - 1]);
    const finalName = path.join(outputDir, 'viernes_ultra_hd_demo.webm');
    fs.copyFileSync(latestVideo, finalName);
    console.log(`\n💎 ULTRA-SHARP DEMO VIDEO RECORDED SUCCESSFULLY!`);
    console.log(`📁 File Location: ${finalName}`);
  }
}

recordUltraHDDemo().catch((err) => {
  console.error('❌ Recording failed:', err);
  process.exit(1);
});
