import React from 'react';
import { useStaffPermission } from '../hooks/useStaffPermission.ts';

export interface CanProps {
  perform?: string | string[];
  mode?: 'any' | 'all';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Declarative component for granular permission checks in admin UI.
 *
 * Example:
 * <Can perform="staff:write" fallback={<DisabledButton />}>
 *   <AddStaffButton />
 * </Can>
 */
export const Can: React.FC<CanProps> = ({
  perform,
  mode = 'any',
  fallback = null,
  children,
}) => {
  const allowed = useStaffPermission(perform, mode);

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
