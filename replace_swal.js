const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('sweetalert2')) {
    // Replace import
    content = content.replace(/import\s+Swal\s+from\s+['"]sweetalert2['"];?/g, 'import { CustomSwal as Swal } from "@/lib/swal";');
    
    // Remove all local definitions of swalTheme
    content = content.replace(/const\s+swalTheme\s*=\s*\(\)\s*=>\s*\(\{[\s\S]*?\}\);/g, '');
    
    // Remove all usages of ...swalTheme() and any preceding commas if present
    content = content.replace(/,\s*\.\.\.swalTheme\(\)/g, '');
    content = content.replace(/\.\.\.swalTheme\(\)/g, '');

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
