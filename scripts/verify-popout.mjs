import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./paths.mjs";

const outDir = path.join(ROOT, "shots");
fs.mkdirSync(outDir, { recursive: true });

async function run() {
  const bundledExecutable = chromium.executablePath();
  const systemChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const executablePath = fs.existsSync(bundledExecutable)
    ? bundledExecutable
    : fs.existsSync(systemChrome)
      ? systemChrome
      : undefined;
  const browser = await chromium.launch(executablePath ? { executablePath } : undefined);
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const baseUrl = process.env.CFAB_MAP_URL ?? "http://127.0.0.1:5173";

  console.log(`Navigating to ${baseUrl}/?view=cloud&lang=pl...`);
  await page.goto(`${baseUrl}/?view=cloud&lang=pl`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1000);

  // Take screenshot before click
  await page.screenshot({ path: path.join(outDir, "1-initial-cloud.png") });

  // Click on a node in the graph
  // Let's find nodes that have connections, e.g. "hub.render.ledger" or any feature circle
  console.log("Clicking on a node...");
  const firstNode = page.locator(".graph-node:not(.orbit-center)").first();
  await firstNode.click();
  await page.waitForTimeout(600);

  // Check if .graph-node-popped and .node-bubble are rendered
  const popped = await page.locator(".graph-node-popped").count();
  const bubble = await page.locator(".node-bubble").count();
  console.log(`Popped node count: ${popped}, Bubble count: ${bubble}`);
  assert.equal(popped, 1, "A selected node should render exactly one popped foreground node");
  assert.equal(bubble, 1, "A selected node should render exactly one speech bubble");

  // Get bubble details
  const bubbleTitle = await page.locator(".bubble-title").textContent();
  const bubbleStatus = await page.locator(".bubble-status").textContent();
  const connectionsCount = await page.locator(".bubble-connections-list li").count();
  console.log(`Bubble Title: "${bubbleTitle}", Status: "${bubbleStatus}", Connections: ${connectionsCount}`);

  await page.screenshot({ path: path.join(outDir, "2-node-popped-bubble.png") });

  // If there are connections, click on the first connection chip
  if (connectionsCount > 0) {
    const firstConn = page.locator(".bubble-connections-list .connection-chip").first();
    const connName = await firstConn.locator(".connection-name").textContent();
    await firstConn.hover();
    const connectionListOverflow = await page.locator(".bubble-connections-list").evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      overflowX: getComputedStyle(element).overflowX,
    }));
    assert.equal(connectionListOverflow.overflowX, "hidden", "Connection hover must not expose a horizontal scrollbar");
    assert.ok(connectionListOverflow.scrollWidth <= connectionListOverflow.clientWidth, "Connection list must not overflow horizontally");
    console.log(`Clicking on connection chip: "${connName}"...`);
    await firstConn.click();
    await page.waitForTimeout(600);

    const newBubbleTitle = await page.locator(".bubble-title").textContent();
    console.log(`Navigated to: "${newBubbleTitle}"`);
    assert.notEqual(newBubbleTitle, bubbleTitle, "A connection chip should select its target node");
    await page.screenshot({ path: path.join(outDir, "3-after-connection-nav.png") });
  }

  // Close the bubble
  console.log("Closing bubble via close button...");
  await page.locator(".bubble-close-btn").click();
  await page.waitForTimeout(400);

  const bubbleAfterClose = await page.locator(".node-bubble").count();
  const poppedAfterClose = await page.locator(".graph-node-popped").count();
  console.log(`After close: Bubble count: ${bubbleAfterClose}, Popped count: ${poppedAfterClose}`);
  assert.equal(bubbleAfterClose, 0, "Closing should remove the speech bubble");
  assert.equal(poppedAfterClose, 0, "Closing should remove the popped foreground node");

  await page.screenshot({ path: path.join(outDir, "4-after-close.png") });

  console.log("Checking compact viewport bounds...");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/?view=cloud&lang=pl`);
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".graph-node:not(.orbit-center)").first().click();
  await page.waitForTimeout(500);

  const compactBounds = await page.evaluate(() => {
    const bubbleRect = document.querySelector(".node-bubble")?.getBoundingClientRect();
    const mapRect = document.querySelector(".cloud-wrap")?.getBoundingClientRect();
    if (!bubbleRect || !mapRect) return null;
    return {
      bubble: { left: bubbleRect.left, top: bubbleRect.top, right: bubbleRect.right, bottom: bubbleRect.bottom },
      map: { left: mapRect.left, top: mapRect.top, right: mapRect.right, bottom: mapRect.bottom },
    };
  });
  assert.ok(compactBounds, "The compact viewport should still render the bubble");
  console.log("Compact bounds:", compactBounds);
  await page.screenshot({ path: path.join(outDir, "5-compact-node-bubble.png") });
  assert.ok(compactBounds.bubble.left >= compactBounds.map.left - 1, "Bubble should stay inside the map on the left");
  assert.ok(compactBounds.bubble.right <= compactBounds.map.right + 1, "Bubble should stay inside the map on the right");
  assert.ok(compactBounds.bubble.top >= compactBounds.map.top - 1, "Bubble should stay inside the map at the top");
  assert.ok(compactBounds.bubble.bottom <= compactBounds.map.bottom + 1, "Bubble should stay inside the map at the bottom");

  await browser.close();
  console.log("Verification finished successfully!");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
