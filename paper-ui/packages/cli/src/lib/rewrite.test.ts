import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { rewriteSource } from './rewrite';

const SRC = path.resolve(__dirname, '../../../../src');
const ALIAS = '@/paper-ui';

describe('rewriteSource', () => {
  const from = path.join(SRC, 'components/cards/CourseCard.tsx');

  it('rewrites @paper-ui/utils and @paper-ui/core to the alias', () => {
    const out = rewriteSource(
      'import { cn } from "@paper-ui/utils";\nimport { PaperCard } from "@paper-ui/core";',
      from, SRC, ALIAS,
    );
    expect(out).toContain('from "@/paper-ui/utils"');
    expect(out).toContain('from "@/paper-ui/core"');
  });

  it('preserves relative cross-component imports', () => {
    const out = rewriteSource('import { Tape } from "../decorations/Tape";', from, SRC, ALIAS);
    expect(out).toContain('from "../decorations/Tape"');
  });

  it('rewrites a relative import that points into src/utils', () => {
    const fromInputs = path.join(SRC, 'components/inputs/PaperInput.tsx');
    const out = rewriteSource("import { cn } from '../../utils/cn';", fromInputs, SRC, ALIAS);
    expect(out).toContain("'@/paper-ui/utils'");
  });

  it('leaves npm imports untouched', () => {
    const out = rewriteSource('import React from "react";', from, SRC, ALIAS);
    expect(out).toBe('import React from "react";');
  });
});
