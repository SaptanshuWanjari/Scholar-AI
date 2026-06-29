const fs = require('fs');
let code = fs.readFileSync('frontend/src/app/components/notebooks/utils.ts', 'utf8');

code = code.replace(
  /let docId: string \| undefined;\s*if \(hash\) \{\s*const dashIdx = hash\.lastIndexOf\("-p"\);\s*docId = dashIdx > 0 \? hash\.substring\(0, dashIdx\) : undefined;\s*\}/,
  `let docId: string | undefined;
      let noteId: string | undefined;
      if (hash) {
        const m = hash.match(/^(?:doc)?(\\d+)-n(\\d+)$/);
        if (m) {
          docId = m[1];
          noteId = m[2];
        } else {
          const dashIdx = hash.lastIndexOf("-p");
          docId = dashIdx > 0 ? hash.substring(hash.startsWith("doc") ? 3 : 0, dashIdx) : undefined;
        }
      }`
);

// Add noteId to ParsedNote interface
code = code.replace(
  /docId\?: string;/,
  `docId?: string;\n  noteId?: string;`
);

// Add noteId to the return object
code = code.replace(
  /docId,\s*};\s*}/g,
  `docId,\n        noteId,\n      };\n    }`
);

fs.writeFileSync('frontend/src/app/components/notebooks/utils.ts', code);
