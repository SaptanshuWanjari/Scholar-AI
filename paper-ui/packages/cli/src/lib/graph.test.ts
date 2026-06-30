import { describe, it, expect } from 'vitest';
import { parseImports, classifyImport, packageName } from './graph';

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
