import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { parseImports, classifyImport, packageName, resolveFile, resolveFileGraph } from './graph';

describe('parseImports', () => {
  it('extracts all module specifiers', () => {
    const src = [
      'import React from "react";',
      'import { cn } from "@paper-ui/utils";',
      "import { PaperCard } from '@paper-ui/core';",
      'import { Tape } from "../decorations/Tape";',
      'import { ArrowDoodle } from "../doodles";',
    ].join('\n');
    expect(parseImports(src)).toEqual([
      'react',
      '@paper-ui/utils',
      '@paper-ui/core',
      '../decorations/Tape',
      '../doodles',
    ]);
  });
});

describe('classifyImport', () => {
  it('classifies each specifier kind', () => {
    expect(classifyImport('@paper-ui/core')).toBe('core');
    expect(classifyImport('@paper-ui/utils')).toBe('utils');
    expect(classifyImport('@paper-ui/tokens/paper.css')).toBe('tokens');
    expect(classifyImport('../decorations/Tape')).toBe('relative');
    expect(classifyImport('lucide-react')).toBe('npm');
  });
});

describe('packageName', () => {
  it('extracts the installable package name', () => {
    expect(packageName('lucide-react')).toBe('lucide-react');
    expect(packageName('date-fns/format')).toBe('date-fns');
    expect(packageName('@radix-ui/react-slot')).toBe('@radix-ui/react-slot');
    expect(packageName('@radix-ui/react-slot/dist')).toBe('@radix-ui/react-slot');
  });
});

const SRC = path.resolve(__dirname, '../../../../src'); // paper-ui/src

describe('resolveFile', () => {
  it('resolves a sibling .tsx component', () => {
    const from = path.join(SRC, 'components/cards/CourseCard.tsx');
    const r = resolveFile(from, '../decorations/Tape', SRC);
    expect(r).toBe(path.join(SRC, 'components/decorations/Tape.tsx'));
  });
  it('resolves a directory import to its index', () => {
    const from = path.join(SRC, 'components/cards/CourseCard.tsx');
    const r = resolveFile(from, '../doodles', SRC);
    expect(r).toBe(path.join(SRC, 'components/doodles/index.tsx'));
  });
  it('returns null for npm specifiers', () => {
    const from = path.join(SRC, 'components/cards/CourseCard.tsx');
    expect(resolveFile(from, 'react', SRC)).toBeNull();
  });
});

describe('resolveFileGraph', () => {
  it('collects transitive component files + flags core/utils + npm deps', () => {
    const entry = path.join(SRC, 'components/cards/CourseCard.tsx');
    const g = resolveFileGraph([entry], SRC);
    // CourseCard imports SketchProgress, PaperBadge, Tape, doodles, plus core + utils.
    expect(g.componentFiles).toContain(entry);
    expect(g.componentFiles).toContain(path.join(SRC, 'components/progress/SketchProgress.tsx'));
    expect(g.componentFiles).toContain(path.join(SRC, 'components/badges/PaperBadge.tsx'));
    expect(g.componentFiles).toContain(path.join(SRC, 'components/decorations/Tape.tsx'));
    expect(g.componentFiles).toContain(path.join(SRC, 'components/doodles/index.tsx'));
    expect(g.needsCore).toBe(true);
    expect(g.needsUtils).toBe(true);
    expect(g.npmDeps).toContain('lucide-react');
    // never traverses into core/ or utils/:
    expect(g.componentFiles.every((f) => f.includes(`${path.sep}components${path.sep}`))).toBe(true);
  });
});
