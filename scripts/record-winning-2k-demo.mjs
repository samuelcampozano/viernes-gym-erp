import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function recordWinningDemoVideo() {
  console.log('🏆 Starting 2K QHD (2560x1440) WINNING WebMCP Hackathon Demo Recording...');
  const outputDir = path.resolve('public/demo-video');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Launch Chromium in 2K QHD resolution (2560x1440)
  const browser = await chromium.launch({
    headless: true,
    args: ['--window-size=2560,1440', '--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 2560, height: 1440 },
    recordVideo: {
      dir: outputDir,
      size: { width: 2560, height: 1440 },
    },
    userAgent: 'Viernes-WebMCP-Winning-Agent/2.0 (2K-QHD)',
  });

  const page = await context.newPage();
  const targetUrl = 'https://viernes-gym-erp.vercel.app';

  console.log(`🌐 Navigating to ${targetUrl}...`);
  await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });

  // ==========================================
  // SCENE 1 (0:00 - 0:30): THE WEBMCP HOOK & AGENTIC ARCHITECTURE
  // ==========================================
  console.log('🎬 [0:00 - 0:30] Scene 1: Introduction & WebMCP Document Tools...');
  await page.waitForTimeout(3000); // Intro establishing shot

  // Open the WebMCP Tool Execution Logger drawer immediately
  console.log('🎬 Expanding WebMCP Live Execution Console...');
  const logsBtn = page.locator('button:has-text("Logs")');
  if (await logsBtn.isVisible()) {
    await logsBtn.click();
    await page.waitForTimeout(3500); // Show tool logs & JSON telemetry
  }

  // ==========================================
  // SCENE 2 (0:30 - 1:05): WEBMCP SCENARIO 1 — AUTONOMOUS INCIDENT RESOLUTION
  // ==========================================
  console.log('🎬 [0:30 - 1:05] Scene 2: WebMCP Tool: update_equipment_status & manage_class_schedule...');
  
  // Close logs drawer to show floor canvas
  const closeLogs = page.locator('button:has-text("Logs")');
  if (await closeLogs.isVisible()) {
    await closeLogs.click();
    await page.waitForTimeout(1000);
  }

  // Trigger Scenario 1: Broken Cable & Move Class
  console.log('🎬 Triggering Scenario 1: Broken Cable on Olympic Rack & Class Reallocation...');
  const scenario1 = page.locator('button:has-text("1. Broken Cable")');
  if (await scenario1.isVisible()) {
    await scenario1.click();
    await page.waitForTimeout(4500); // Observe glowing orange radar pulse on 2D floor node!
  }

  // Re-open logs to show the executed tool payload with latency badge
  if (await logsBtn.isVisible()) {
    await logsBtn.click();
    await page.waitForTimeout(3000); // Show "update_equipment_status" & "manage_class_schedule" (16ms latency)
    await logsBtn.click();
    await page.waitForTimeout(1000);
  }

  // ==========================================
  // SCENE 3 (1:05 - 1:40): WEBMCP SCENARIO 2 — PREDICTIVE CHURN & RETENTION CAMPAIGN
  // ==========================================
  console.log('🎬 [1:05 - 1:40] Scene 3: WebMCP Tool: launch_retention_campaign & XAI Churn Engine...');
  
  // Switch to Member Radar
  const memberTab = page.locator('button:has-text("MEMBER RADAR")');
  if (await memberTab.isVisible()) {
    await memberTab.click();
    await page.waitForTimeout(2500);
  }

  // Trigger Scenario 2 on HUD: Churn Radar & Retention
  console.log('🎬 Triggering Scenario 2: Autonomous Churn Detection & Perk Dispatch...');
  const scenario2 = page.locator('button:has-text("2. Churn Radar")');
  if (await scenario2.isVisible()) {
    await scenario2.click();
    await page.waitForTimeout(4000); // Watch XAI diagnostics calculation and perk drafting
  }

  // Click on a critical risk badge to inspect the Explainable AI (XAI) 4-factor math formula
  const riskBadge = page.locator('button:has-text("RISK")').first();
  if (await riskBadge.isVisible()) {
    await riskBadge.click();
    await page.waitForTimeout(3500); // Show 4-Factor Churn Formula
    const closeXai = page.locator('button:has(svg.lucide-x)').first();
    if (await closeXai.isVisible()) {
      await closeXai.click();
      await page.waitForTimeout(1200);
    }
  }

  // ==========================================
  // SCENE 4 (1:40 - 2:10): WEBMCP SCENARIO 3 — SENSITIVITY MODELING & REVENUE BOOST
  // ==========================================
  console.log('🎬 [1:40 - 2:10] Scene 4: WebMCP Tool: simulate_revenue_forecast...');
  
  // Switch to Facility Telemetry
  const telemetryTab = page.locator('button:has-text("FACILITY TELEMETRY")');
  if (await telemetryTab.isVisible()) {
    await telemetryTab.click();
    await page.waitForTimeout(2500);
  }

  // Trigger Scenario 3 on HUD: +$6k MRR Boost
  console.log('🎬 Triggering Scenario 3: Autonomous Sensitivity & Revenue Optimization...');
  const scenario3 = page.locator('button:has-text("3. +$6k MRR")');
  if (await scenario3.isVisible()) {
    await scenario3.click();
    await page.waitForTimeout(4000); // Watch MRR curve surge to $127,235/mo!
  }

  // Click 1-Click Preset "Obsidian Maximizer"
  const preset3 = page.locator('button:has-text("3. Obsidian Maximizer")');
  if (await preset3.isVisible()) {
    await preset3.click();
    await page.waitForTimeout(3000);
  }

  // ==========================================
  // SCENE 5 (2:10 - 2:35): FULL ECOSYSTEM HARMONY & CLOSING
  // ==========================================
  console.log('🎬 [2:10 - 2:35] Scene 5: Return to 2D Floor Blueprint & Closing...');
  const floorTab = page.locator('button:has-text("FLOOR COMMANDER")');
  if (await floorTab.isVisible()) {
    await floorTab.click();
    await page.waitForTimeout(2000);
  }

  // Final look at WebMCP logs console
  if (await logsBtn.isVisible()) {
    await logsBtn.click();
    await page.waitForTimeout(4000); // Show full trail of 6 WebMCP tools executed seamlessly
  }

  console.log('🎬 Finalizing 2K QHD video recording...');
  await page.waitForTimeout(2000);

  await page.close();
  await context.close();
  await browser.close();

  // Copy to final 2K video location
  const videoFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith('.webm'));
  if (videoFiles.length > 0) {
    const latestVideo = path.join(outputDir, videoFiles[videoFiles.length - 1]);
    const finalName = path.join(outputDir, 'viernes_hackathon_demo_2k.webm');
    fs.copyFileSync(latestVideo, finalName);
    console.log(`\n🏆 WINNING 2K DEMO VIDEO RECORDED SUCCESSFULLY!`);
    console.log(`📁 File Location: ${finalName}`);
  }
}

recordWinningDemoVideo().catch((err) => {
  console.error('❌ 2K Video recording failed:', err);
  process.exit(1);
});
