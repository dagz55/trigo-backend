const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function convertSvgToPng(svgPath, pngPath) {
  try {
    // Create a data URL from the SVG
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;
    
    // Load the SVG image
    const img = await loadImage(dataUrl);
    
    // Create a canvas with the same dimensions
    const canvas = createCanvas(24, 24);
    const ctx = canvas.getContext('2d');
    
    // Draw the image on the canvas
    ctx.drawImage(img, 0, 0, 24, 24);
    
    // Save the canvas as PNG
    const pngBuffer = canvas.toBuffer('image/png');
    fs.writeFileSync(pngPath, pngBuffer);
    
    console.log(`Converted ${svgPath} to ${pngPath}`);
  } catch (error) {
    console.error(`Error converting ${svgPath} to PNG:`, error);
  }
}

async function main() {
  const socialIcons = ['telegram', 'whatsapp', 'wechat', 'imessage'];
  const baseDir = 'public/social-icons';
  
  for (const icon of socialIcons) {
    const svgPath = path.join(baseDir, `${icon}.svg`);
    const pngPath = path.join(baseDir, `${icon}.png`);
    await convertSvgToPng(svgPath, pngPath);
  }
}

main().catch(console.error);
