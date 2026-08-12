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
      // Find <IconName ... > spanning multiple lines
      const tagRegex = new RegExp(`<${icon}\\b([^>]*?)>`, 'gs');
      content = content.replace(tagRegex, (match, inner) => {
        let newInner = inner;

        // If it's a dynamic className: className={`...`}
        if (inner.includes('className={`')) {
            newInner = newInner.replace(/className=\{`([^`]+)`\}/g, (m, classes) => {
                let updated = classes;
                if (updated.match(/text-[a-zA-Z0-9\[\]\#\-]+/)) {
                    updated = updated.replace(/text-[a-zA-Z0-9\[\]\#\-]+/g, 'text-[#FF4C29]');
                } else {
                    updated += ' text-[#FF4C29]';
                }
                return `className={\`${updated}\`}`;
            });
        } 
        // If it's a static className: className="..."
        else if (inner.includes('className="')) {
            newInner = newInner.replace(/className="([^"]+)"/g, (m, classes) => {
                let updated = classes;
                if (updated.match(/text-[a-zA-Z0-9\[\]\#\-]+/)) {
                    updated = updated.replace(/text-[a-zA-Z0-9\[\]\#\-]+/g, 'text-[#FF4C29]');
                } else {
                    updated += ' text-[#FF4C29]';
                }
                return `className="${updated}"`;
            });
        }
        // If it has no className
        else {
            if (newInner.endsWith('/')) {
                newInner = newInner.slice(0, -1) + ' className="text-[#FF4C29]" /';
            } else {
                newInner += ' className="text-[#FF4C29]"';
            }
        }

        return `<${icon}${newInner}>`;
      });
    });
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
