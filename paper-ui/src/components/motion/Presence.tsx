import React from 'react';

export interface PresenceProps {
  isPresent: boolean;
  children: React.ReactElement;
  fallback?: React.ReactNode;
}

export const Presence: React.FC<PresenceProps> = ({
  isPresent,
  children,
  fallback = null,
}) => {
  // A simplified presence component for our basic motion primitives.
  // In a real robust implementation, this would handle delay unmounting based on transition events.
  // Here, we rely on the child motion components (like Fade, Slide) having `unmountOnExit={true}`
  // and passing them the `in` prop.
  
  if (!React.isValidElement(children)) {
    return isPresent ? <>{children}</> : <>{fallback}</>;
  }

  return React.cloneElement(children as React.ReactElement<any>, {
    in: isPresent,
    unmountOnExit: true,
  });
};
