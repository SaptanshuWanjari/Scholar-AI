import React from 'react';
import { cn } from '@paper-ui/utils';

export interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  children,
  language,
  filename,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const lines = children.trimEnd().split('\n');

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden border border-[#d4cfc2] bg-[#f5f2ed]',
        className,
      )}
    >
      {/* Header bar — shown when filename is provided */}
      {filename && (
        <div className="flex items-center justify-between bg-[#ebe7df] px-4 py-2 border-b border-[#d4cfc2]">
          <div className="flex items-center gap-2">
            {/* Dot decorations */}
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4cfc2] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4cfc2] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4cfc2] inline-block" />
            <span className="font-architect text-xs text-[#9c9484] ml-2">{filename}</span>
          </div>
          {language && (
            <span className="font-architect text-xs text-[#9c9484] bg-[#ddd9d0] px-2 py-0.5 rounded">
              {language}
            </span>
          )}
        </div>
      )}

      {/* Code area */}
      <pre className="font-mono text-sm p-4 overflow-x-auto text-[#3a3733] leading-relaxed">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="flex">
              {showLineNumbers && (
                <span
                  className="select-none text-[#9c9484] mr-4 text-right inline-block"
                  style={{ minWidth: String(lines.length).length + 'ch' }}
                >
                  {i + 1}
                </span>
              )}
              <span>{line || '\u00A0'}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
