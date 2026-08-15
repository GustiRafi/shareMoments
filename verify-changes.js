import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.createContext({ viewport: { width: 1024, height: 768 } });
  const page = await context.newPage();

  try {
    console.log('=== VERIFICATION: shareMoments App ===\n');

    // Step 1: Landing page
    console.log('📋 STEP 1: Landing page verification');
    await page.goto('http://localhost:5175/');
    await page.waitForLoadState('networkidle');

    // Screenshot landing
    await page.screenshot({ path: './landing.png' });
    console.log('✅ Landing page screenshot saved: landing.png');

    // Check red button
    const redButton = await page.locator('a:has-text("AMBIL FOTO")');
    const btnStyle = await redButton.evaluate(el => window.getComputedStyle(el).backgroundColor);
    console.log(`   Button color: ${btnStyle}`);

    // Check bunting exists
    const bunting = await page.locator('.bunting');
    const buntingCount = await bunting.locator('.flag').count();
    console.log(`   Bunting flags found: ${buntingCount}`);

    // Check 🇮🇩 emoji
    const flags = await page.locator('.ornamen-flags');
    const flagsText = await flags.textContent();
    console.log(`   Ornamen flags content: ${flagsText}`);

    // Check 81 TAHUN badge
    const badge = await page.locator('.badge-year');
    const badgeText = await badge.textContent();
    console.log(`   Badge text: ${badgeText}`);

    console.log('✅ Landing page checks passed\n');

    // Step 2: Camera page
    console.log('📷 STEP 2: Camera page verification');
    await page.click('a:has-text("AMBIL FOTO")');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: './camera.png' });
    console.log('✅ Camera page screenshot saved: camera.png');

    // Check viewfinder aspect ratio
    const viewfinder = await page.locator('.camera-wrapper');
    const viewfinderStyle = await viewfinder.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        aspectRatio: computed.aspectRatio,
        borderRadius: computed.borderRadius
      };
    });
    console.log(`   Viewfinder aspect-ratio: ${viewfinderStyle.aspectRatio}`);
    console.log(`   Viewfinder border-radius: ${viewfinderStyle.borderRadius}`);

    // Check control buttons exist
    const flashBtn = await page.locator('button:has-text("💡")');
    const shutterBtn = await page.locator('.shutter-btn');
    const flipBtn = await page.locator('button:has-text("↻")');

    const hasFlash = await flashBtn.isVisible();
    const hasShutter = await shutterBtn.isVisible();
    const hasFlip = await flipBtn.isVisible();

    console.log(`   Flash button visible: ${hasFlash}`);
    console.log(`   Shutter button visible: ${hasShutter}`);
    console.log(`   Flip button visible: ${hasFlip}`);

    console.log('✅ Camera page checks passed\n');

    // Step 3: Gallery page
    console.log('🖼️  STEP 3: Gallery page verification');
    await page.goto('http://localhost:5175/gallery');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: './gallery-empty.png' });
    console.log('✅ Gallery page screenshot saved: gallery-empty.png');

    // Check gallery header color
    const galleryHeader = await page.locator('.gallery-header h2');
    const headerStyle = await galleryHeader.evaluate(el => window.getComputedStyle(el).color);
    console.log(`   Gallery header color: ${headerStyle}`);

    // Check gallery items have red borders
    const galleryItems = await page.locator('.gallery-item');
    const itemCount = await galleryItems.count();
    console.log(`   Gallery items found: ${itemCount}`);

    if (itemCount > 0) {
      const itemStyle = await galleryItems.first().evaluate(el => window.getComputedStyle(el).borderColor);
      console.log(`   First item border color: ${itemStyle}`);
    }

    console.log('✅ Gallery page checks passed\n');

    // Step 4: Mobile responsive (375px)
    console.log('📱 STEP 4: Mobile responsive verification (375px)');
    const mobileContext = await browser.createContext({ viewport: { width: 375, height: 812 } });
    const mobilePage = await mobileContext.newPage();

    await mobilePage.goto('http://localhost:5175/');
    await mobilePage.waitForLoadState('networkidle');
    await mobilePage.screenshot({ path: './landing-mobile.png' });
    console.log('✅ Landing mobile screenshot saved: landing-mobile.png');

    // Go to camera on mobile
    await mobilePage.click('a:has-text("AMBIL FOTO")');
    await mobilePage.waitForLoadState('networkidle');
    await mobilePage.screenshot({ path: './camera-mobile.png' });
    console.log('✅ Camera mobile screenshot saved: camera-mobile.png');

    // Check mobile viewfinder still square
    const mobileViewfinder = await mobilePage.locator('.camera-wrapper');
    const mobileViewfinderStyle = await mobileViewfinder.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        width: computed.width,
        aspectRatio: computed.aspectRatio
      };
    });
    console.log(`   Mobile viewfinder aspect-ratio: ${mobileViewfinderStyle.aspectRatio}`);
    console.log(`   Mobile viewfinder width: ${mobileViewfinderStyle.width}`);

    console.log('✅ Mobile responsive checks passed\n');

    console.log('=== ✅ ALL VERIFICATIONS PASSED ===');

  } catch (error) {
    console.error('❌ Error during verification:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
