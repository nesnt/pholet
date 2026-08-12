const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const files = walkSync('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // globals.css replacements
  content = content.replace(/--color-pholet-espresso: #622B14;/g, '--color-pholet-espresso: #082032;');
  content = content.replace(/--color-pholet-terracotta: #995F2F;/g, '--color-pholet-terracotta: #2C394B;');
  content = content.replace(/--color-pholet-khaki: #978F66;/g, '--color-pholet-khaki: #334756;');
  content = content.replace(/--color-pholet-cream: #E4D6A9;/g, '--color-pholet-cream: #2C394B;');
  content = content.replace(/--color-pholet-parchment: #F8F4E8;/g, '--color-pholet-parchment: #082032;');
  content = content.replace(/--color-pholet-ink: #21120B;/g, '--color-pholet-ink: #F0F0F0;');

  content = content.replace(/background-color: #F8F4E8;/g, 'background-color: #082032;');
  content = content.replace(/color: #21120B;/g, 'color: #F8F9FA;');
  content = content.replace(/rgba\(98, 43, 20,/g, 'rgba(255, 76, 41,'); // Film grain
  
  // Tailwind Arbitrary Class Replacements
  // 1. Backgrounds
  content = content.replace(/bg-\[\#F8F4E8\]/g, 'bg-[#082032]'); // Page bg -> Darkest Blue
  content = content.replace(/bg-\[\#E4D6A9\]/g, 'bg-[#2C394B]'); // Cream Card bg -> Dark Blue-Grey
  content = content.replace(/bg-\[\#21120B\]/g, 'bg-[#082032]'); // Darkest Black bg -> Darkest Blue
  
  // Buttons and Accents
  content = content.replace(/bg-\[\#622B14\]/g, 'bg-[#FF4C29]'); // Espresso buttons -> Vibrant Orange
  content = content.replace(/bg-\[\#995F2F\]/g, 'bg-[#334756]'); // Terracotta bg -> Muted Blue-Grey
  content = content.replace(/hover:bg-\[\#995F2F\]/g, 'hover:bg-[#FF4C29]'); // Hover Terracotta -> Hover Vibrant Orange
  content = content.replace(/hover:bg-\[\#E4D6A9\]/g, 'hover:bg-[#2C394B]'); 
  content = content.replace(/hover:bg-\[\#f3e8c9\]/g, 'hover:bg-[#FF4C29]'); // FAB Hover
  
  // 2. Text colors
  content = content.replace(/text-\[\#21120B\]/g, 'text-gray-100'); // Ink text -> White/Gray
  content = content.replace(/text-\[\#E4D6A9\]/g, 'text-white'); // Cream text -> White
  content = content.replace(/text-\[\#622B14\]/g, 'text-[#FF4C29]'); // Espresso text -> Vibrant Orange
  content = content.replace(/text-\[\#995F2F\]/g, 'text-[#FF4C29]'); // Terracotta text -> Vibrant Orange
  content = content.replace(/text-\[\#978F66\]/g, 'text-gray-400'); // Khaki subtle text -> Muted gray
  content = content.replace(/text-\[\#7A7352\]/g, 'text-gray-400'); // Muted subtle text -> Muted gray
  content = content.replace(/text-\[\#F8F4E8\]/g, 'text-gray-200');

  // 3. Borders
  content = content.replace(/border-\[\#622B14\]/g, 'border-[#FF4C29]');
  content = content.replace(/border-\[\#995F2F\]/g, 'border-[#334756]');
  content = content.replace(/border-\[\#978F66\]/g, 'border-[#334756]');
  content = content.replace(/border-\[\#E4D6A9\]/g, 'border-[#2C394B]');
  content = content.replace(/border-\[\#21120B\]/g, 'border-[#082032]');

  // 4. Rings & Fills
  content = content.replace(/ring-\[\#622B14\]/g, 'ring-[#FF4C29]');
  content = content.replace(/ring-\[\#995F2F\]/g, 'ring-[#334756]');
  content = content.replace(/fill-\[\#E4D6A9\]/g, 'fill-white');
  content = content.replace(/fill-\[\#21120B\]/g, 'fill-[#082032]');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
