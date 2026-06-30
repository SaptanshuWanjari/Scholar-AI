import React from 'react';
import { Collapse, CollapseProps } from './Collapse';

export const Expand = React.forwardRef<HTMLDivElement, CollapseProps>((props, ref) => {
  return <Collapse ref={ref} {...props} />;
});

Expand.displayName = 'Expand';
