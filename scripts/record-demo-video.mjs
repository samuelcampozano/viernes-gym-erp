import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function recordDemoVideo() {
  console.log('🎥 Starting High-Definition (1080p) Automated Demo Video Recording...');
  const outputDir = path.resolve('public/demo-video');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Launch Chromium with 1080p HD viewport and video recording enabled
  const browser = await chromium.launch({
    headless: true,
    args: ['--window-size=1920,1080', '--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1920, height: 1080 },
    },
    userAgent: 'Viernes-Demo-Recorder/1.0 (1080p HD)',
  });

  const page = await context.newPage();
  const targetUrl = 'https://viernes-gym-erp.vercel.app';

  console.log(`🌐 Navigating to ${targetUrl}...`);
  await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });

  // Helper for smooth mouse movements
  async function smoothHover(selector, delay = 800) {
    const el = page.locator(selector).first();
    if (await el.isVisible()) {
      await el.hover();
      await page.waitForTimeout(delay);
    }
  }

  // ==========================================
  // SCENE 1: INTRODUCTION & FLOOR COMMANDER (0:00 - 0:35)
  // ==========================================
  console.log('🎬 [0:00 - 0:35] Scene 1: Introduction & 2D Floor Blueprint...');
  await page.waitForTimeout(3000); // 3s opening overview

  // Hover over different equipment nodes across zones
  await smoothHover('div:has-text("RACK-01")');
  await smoothHover('div:has-text("CARDIO-01")');
  await smoothHover('div:has-text("RECOVERY-01")');

  // Click Sector Category filters
  console.log('🎬 Clicking Strength sector focus...');
  const strengthChip = page.locator('button:has-text("Strength")').first();
  if (await strengthChip.isVisible()) {
    await strengthChip.click();
    await page.waitForTimeout(2500);
  }

  // Click Repair Filter Button
  console.log('🎬 Clicking Repair Filter Button...');
  const repairBtn = page.locator('button:has-text("Repair")').first();
  if (await repairBtn.isVisible()) {
    await repairBtn.click();
    await page.waitForTimeout(3000);
  }

  // 1-Click Repair on RACK-03
  console.log('🎬 Marking RACK-03 as Operational in 1-Click...');
  const operationalBtn = page.locator('button:has-text("Operational")').first();
  if (await operationalBtn.isVisible()) {
    await operationalBtn.click();
    await page.waitForTimeout(2500);
  }

  // Reset filter back to All
  const allBtn = page.locator('button:has-text("All")').first();
  if (await allBtn.isVisible()) {
    await allBtn.click();
    await page.waitForTimeout(2000);
  }

  // ==========================================
  // SCENE 2: CLASS SCHEDULE TIMELINE (0:35 - 1:10)
  // ==========================================
  console.log('🎬 [0:35 - 1:10] Scene 2: Multi-Year Class Scheduler...');
  const scheduleTab = page.locator('button:has-text("CLASS SCHEDULE")');
  if (await scheduleTab.isVisible()) {
    await scheduleTab.click();
    await page.waitForTimeout(3000);

    // Switch Week to W2
    const w2Btn = page.locator('button:has-text("W2")');
    if (await w2Btn.isVisible()) {
      await w2Btn.click();
      await page.waitForTimeout(2000);
    }

    // Switch Day of Week to Friday
    const friBtn = page.locator('button:has-text("FRI")').first();
    if (await friBtn.isVisible()) {
      await friBtn.click();
      await page.waitForTimeout(2000);
    }

    // Click on a Class Card to open Class Detail Modal
    const classCard = page.locator('.stark-card:has-text("CLS-")').first();
    if (await classCard.isVisible()) {
      await classCard.click();
      await page.waitForTimeout(2500);

      // Simulate +1 booking in modal
      const plusBtn = page.locator('button:has-text("+1")').first();
      if (await plusBtn.isVisible()) {
        await plusBtn.click();
        await page.waitForTimeout(1000);
      }

      // Save class & trigger confetti
      const saveBtn = page.locator('button:has-text("Save & Update")').first();
      if (await saveBtn.isVisible()) {
        await saveBtn.click();
        await page.waitForTimeout(3000); // Allow confetti to burst
      }
    }
  }

  // ==========================================
  // SCENE 3: MEMBER RADAR & XAI CHURN CRM (1:10 - 1:45)
  // ==========================================
  console.log('🎬 [1:10 - 1:45] Scene 3: Member Radar & Explainable AI (XAI)...');
  const memberTab = page.locator('button:has-text("MEMBER RADAR")');
  if (await memberTab.isVisible()) {
    await memberTab.click();
    await page.waitForTimeout(3000);

    // Click on critical risk badge to open XAI 4-factor math modal
    const riskBadge = page.locator('button:has-text("RISK")').first();
    if (await riskBadge.isVisible()) {
      await riskBadge.click();
      await page.waitForTimeout(4000); // Show 4-factor diagnostic breakdown

      // Close modal
      const closeXai = page.locator('button:has(svg.lucide-x)').first();
      if (await closeXai.isVisible()) {
        await closeXai.click();
        await page.waitForTimeout(1500);
      }
    }

    // Open Retention Campaign Drawer for top at-risk member
    const draftPerkBtn = page.locator('button:has-text("Draft Perk")').first();
    if (await draftPerkBtn.isVisible()) {
      await draftPerkBtn.click();
      await page.waitForTimeout(3000);

      // Click "Edit Copy"
      const editCopyBtn = page.locator('button:has-text("Edit Copy")').first();
      if (await editCopyBtn.isVisible()) {
        await editCopyBtn.click();
        await page.waitForTimeout(1500);
      }

      // Dispatch retention campaign & trigger confetti
      const dispatchBtn = page.locator('button:has-text("Dispatch Retention Campaign")').or(page.locator('button:has-text("Save & Dispatch")')).first();
      if (await dispatchBtn.isVisible()) {
        await dispatchBtn.click();
        await page.waitForTimeout(3500); // Confetti celebration
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
  // SCENE 4: FACILITY TELEMETRY & MRR SIMULATOR (1:45 - 2:15)
  // ==========================================
  console.log('🎬 [1:45 - 2:15] Scene 4: Facility Telemetry & Financial Sensitivity...');
  const telemetryTab = page.locator('button:has-text("FACILITY TELEMETRY")');
  if (await telemetryTab.isVisible()) {
    await telemetryTab.click();
    await page.waitForTimeout(3000);

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
  // SCENE 5: WEBMCP CO-PILOT AI SCENARIOS & CLOSING (2:15 - 2:40)
  // ==========================================
  console.log('🎬 [2:15 - 2:40] Scene 5: WebMCP AI Co-Pilot Execution...');
  const floorTab = page.locator('button:has-text("FLOOR COMMANDER")');
  if (await floorTab.isVisible()) {
    await floorTab.click();
    await page.waitForTimeout(1500);
  }

  // Trigger Scenario 1 on Viernes HUD
  const scenarioBtn = page.locator('button:has-text("1. Broken Cable")');
  if (await scenarioBtn.isVisible()) {
    await scenarioBtn.click();
    await page.waitForTimeout(4000); // Watch WebMCP tool logs & canvas pulse ring
  }

  // Open Tool Execution Logs drawer
  const logsBtn = page.locator('button:has-text("Logs")');
  if (await logsBtn.isVisible()) {
    await logsBtn.click();
    await page.waitForTimeout(3000);
  }

  console.log('🎬 Closing browser and saving 1080p HD video file...');
  await page.waitForTimeout(2000);

  // Close context to finalize video writing
  await page.close();
  await context.close();
  await browser.close();

  // Find the generated video file
  const videoFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith('.webm'));
  if (videoFiles.length > 0) {
    const latestVideo = path.join(outputDir, videoFiles[videoFiles.length - 1]);
    const finalName = path.join(outputDir, 'viernes_hackathon_demo_1080p.webm');
    fs.copyFileSync(latestVideo, finalName);
    console.log(`\n🎉 High-Definition Demo Video RECORDED SUCCESSFULLY!`);
    console.log(`📁 File Location: ${finalName}`);
  }
}

recordDemoVideo().catch((err) => {
  console.error('❌ Video recording failed:', err);
  process.exit(1);
});
