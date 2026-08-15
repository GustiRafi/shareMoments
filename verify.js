const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navigate to home
  await page.goto('http://localhost:5173/');
  await page.waitForLoadState('networkidle');
  
  // Check if recent photos grid exists
  const photosGrid = await page.locator('.photos-grid');
  const gridExists = await photosGrid.isVisible().catch(() => false);
  
  if (gridExists) {
    const thumbs = await page.locator('.photo-thumb');
    const thumbCount = await thumbs.count();
    console.log(`✅ Photos grid visible with ${thumbCount} thumbnails`);
  } else {
    console.log(`❓ Photos grid not visible (no photos yet or styling issue)`);
  }
  
  // Take screenshot of home page
  await page.screenshot({ path: 'C:/laragon/www/sharemoments/home.png', fullPage: true });
  console.log('Screenshot saved: home.png');
  
  // Look for "LIHAT SEMUA" button
  const showAllBtn = await page.locator('a:has-text("LIHAT SEMUA")');
  const btnExists = await showAllBtn.isVisible().catch(() => false);
  
  if (btnExists) {
    console.log('✅ "LIHAT SEMUA" button visible');
    
    // Click it and verify navigation
    await showAllBtn.click();
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    if (currentUrl.includes('/gallery')) {
      console.log('✅ Navigation to /gallery works - current URL:', currentUrl);
    } else {
      console.log('❌ Navigation failed - still at:', currentUrl);
    }
    
    // Screenshot gallery page
    await page.screenshot({ path: 'C:/laragon/www/sharemoments/gallery.png', fullPage: true });
    console.log('Gallery screenshot saved: gallery.png');
  } else {
    console.log('❌ "LIHAT SEMUA" button not found');
  }
  
  await browser.close();
})().catch(console.error);
