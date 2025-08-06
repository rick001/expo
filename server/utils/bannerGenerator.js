const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');

// Function to generate banner with logo
async function generateBannerWithLogo(exhibitor, bannerPath) {
  try {
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    // Create gradient background with green colors
    const gradient = ctx.createLinearGradient(0, 0, 800, 0);
    gradient.addColorStop(0, '#3d8b5a'); // Dark green
    gradient.addColorStop(1, '#2f6f47'); // Darker green
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 400);

    // Load and draw logo
    if (exhibitor.logo && exhibitor.logo.filename) {
      try {
        const logoPath = path.join(__dirname, '..', 'uploads', 'logos', exhibitor.logo.filename);
        if (fs.existsSync(logoPath)) {
          const logo = await loadImage(logoPath);
          
          // Calculate logo position and size
          const logoSize = 80;
          const logoX = 400 - logoSize / 2;
          const logoY = 200 - logoSize / 2;
          
          // Draw white background circle for logo
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.beginPath();
          ctx.arc(400, 200, logoSize / 2 + 10, 0, 2 * Math.PI);
          ctx.fill();
          
          // Draw logo
          ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
        }
      } catch (logoError) {
        console.error('Error loading logo:', logoError);
        // Fallback to company initial if logo fails to load
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(400, 200, 50, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#3d8b5a';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(exhibitor.companyName.charAt(0).toUpperCase(), 400, 200);
      }
    }

    // Draw event name
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(exhibitor.marketingBanner?.eventName || 'Small Business Expo 2024', 400, 100);

    // Draw company name
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(exhibitor.companyName, 400, 300);

    // Draw booth information
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '16px Arial';
    ctx.fillText(`Booth ${exhibitor.boothNumber || 'TBD'} • ${exhibitor.boothSize}`, 400, 330);

    // Save the banner
    const bannerFullPath = path.join(__dirname, '..', bannerPath);
    const bannerDir = path.dirname(bannerFullPath);
    
    // Ensure the banners directory exists
    if (!fs.existsSync(bannerDir)) {
      fs.mkdirSync(bannerDir, { recursive: true });
    }
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(bannerFullPath, buffer);
    
    console.log(`Banner generated successfully: ${bannerPath}`);
    return true;
  } catch (error) {
    console.error('Error generating banner:', error);
    return false;
  }
}

module.exports = { generateBannerWithLogo }; 