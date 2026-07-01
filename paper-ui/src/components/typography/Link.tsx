import React from 'react';
import { cn } from '@paper-ui/utils';
import { ExternalLink } from 'lucide-react';

export type LinkUnderline = 'always' | 'hover' | 'none';
export type LinkTone = 'ink' | 'sky' | 'sage';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  underline?: LinkUnderline;
  external?: boolean;
  tone?: LinkTone;
  children?: React.ReactNode;
}

const toneColorMap: Record<LinkTone, string> = {
  ink: '#3a3733',
  sky: '#4a6f91',
  sage: '#3f7a4e',
};

const underlineMap: Record<LinkUnderline, string> = {
  always: 'underline',
  hover: 'no-underline hover:underline',
  none: 'no-underline',
};

export function Link({
  underline = 'hover',
  external = false,
  tone = 'sky',
  className,
  style,
  children,
  href,
  ...props
}: LinkProps) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cn(
        'font-kalam inline-inline items-center gap-0.5 transition-opacity hover:opacity-80',
        underlineMap[underline],
        'decoration-current underline-offset-2',
        className,
      )}
      style={{ color: toneColorMap[tone], ...style }}
      {...props}
    >
      {children}
      {external && (
        <ExternalLink
          className="inline-block ml-0.5 align-middle"
          size={12}
          strokeWidth={1.8}
          aria-label="opens in new tab"
        />
      )}
    </a>
  );
}
