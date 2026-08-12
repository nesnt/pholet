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
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
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

  // Find lucide-react imports
  const lucideMatch = content.match(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/);
  if (lucideMatch) {
    const icons = lucideMatch[1]
      .split(',')
      .map(i => {
        const parts = i.trim().split(/\s+as\s+/);
        return parts.length > 1 ? parts[1] : parts[0];
      })
      .filter(Boolean);

    icons.forEach(icon => {
      // Find: <IconName ... className="..." ... >
      const regex = new RegExp(`<${icon}\\b([^>]*)className=(["'])([^"']*)(["'])([^>]*)(/?)>`, 'g');
      content = content.replace(regex, (match, p1, q1, className, q2, p3, p4) => {
        let newClassName = className;
        if (newClassName.match(/text-\S+/)) {
          // Replace all text- colors with text-[#FF4C29]
          newClassName = newClassName.replace(/text-[a-zA-Z0-9\[\]\#\-]+/g, 'text-[#FF4C29]');
        } else {
          // Append if no text- class
          newClassName += ' text-[#FF4C29]';
        }
        return `<${icon}${p1}className=${q1}${newClassName.trim()}${q2}${p3}${p4}>`;
      });
    });
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
