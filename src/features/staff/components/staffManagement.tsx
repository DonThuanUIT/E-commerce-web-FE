import React, { useState } from 'react';
import {
  useStaffList,
  useStaffStats,
  useStaffRoles,
  useCreateStaff,
  useLockStaff,
  useUnlockStaff,
  useChangeStaffRole,
  useResendInvitation,
} from '../hooks/useStaff';
import { StaffHeader } from './staffHeader';
import { StaffFilters } from './staffFilters';
import { StaffTable } from './staffTable';
import { StaffDrawer } from './staffDrawer';
import { ChangeRoleModal } from './changeRoleModal';
import { LockStaffModal } from './lockStaffModal';
import type { StaffMember, CreateStaffCommand } from '../types/staffType';

export const StaffManagement: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [roleId, setRoleId] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStaffForRole, setSelectedStaffForRole] =
    useState<StaffMember | null>(null);
  const [selectedStaffForLock, setSelectedStaffForLock] =
    useState<StaffMember | null>(null);
  const [resendingStaffId, setResendingStaffId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useStaffList({
    keyword: keyword || undefined,
    status,
    roleId,
    page,
    size: pageSize,
  });

  const { data: roles = [] } = useStaffRoles();
  const createMutation = useCreateStaff();
  const lockMutation = useLockStaff();
  const unlockMutation = useUnlockStaff();
  const changeRoleMutation = useChangeStaffRole();
  const resendInviteMutation = useResendInvitation();

  const handleKeywordChange = (val: string) => {
    setKeyword(val);
    setPage(0);
  };

  const handleStatusChange = (val: number | undefined) => {
    setStatus(val);
    setPage(0);
  };

  const handleRoleIdChange = (val: string | undefined) => {
    setRoleId(val);
    setPage(0);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setStatus(undefined);
    setRoleId(undefined);
    setPage(0);
  };

  const handleCreateStaff = async (command: CreateStaffCommand) => {
    await createMutation.mutateAsync(command);
  };

  const handleChangeRole = async (staffId: string, newRoleId: string) => {
    await changeRoleMutation.mutateAsync({
      id: staffId,
      command: { roleId: newRoleId },
    });
  };

  const handleConfirmLock = async (staffId: string) => {
    await lockMutation.mutateAsync(staffId);
  };

  const handleConfirmUnlock = async (staffId: string) => {
    await unlockMutation.mutateAsync(staffId);
  };

  const handleResendInvite = async (staff: StaffMember) => {
    try {
      setResendingStaffId(staff.id);
      await resendInviteMutation.mutateAsync(staff.id);
      alert(`Activation email resent to ${staff.email}`);
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : 'Failed to resend invitation email',
      );
    } finally {
      setResendingStaffId(null);
    }
  };

  const { data: stats } = useStaffStats();

  const totalCount = stats?.totalCount ?? (data?.totalElements || 0);
  const activeCount = stats?.activeCount ?? 0;
  const lockedCount = stats?.lockedCount ?? 0;

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Stitch Screen 9 Staff Header with Bento Metric Cards */}
      <StaffHeader
        totalCount={totalCount}
        activeCount={activeCount}
        lockedCount={lockedCount}
        rolesCount={roles.length}
        onOpenAddModal={() => setIsDrawerOpen(true)}
      />

      {/* Stitch Screen 9 Filters & Search */}
      <StaffFilters
        keyword={keyword}
        onKeywordChange={handleKeywordChange}
        status={status}
        onStatusChange={handleStatusChange}
        roleId={roleId}
        onRoleIdChange={handleRoleIdChange}
        roles={roles}
        onReset={handleResetFilters}
      />

      {/* Stitch Screen 9 Staff Table */}
      <StaffTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onPageChange={setPage}
        onChangeRole={(staff) => setSelectedStaffForRole(staff)}
        onToggleLock={(staff) => setSelectedStaffForLock(staff)}
        onResendInvite={handleResendInvite}
        resendingStaffId={resendingStaffId}
      />

      {/* Stitch Screen 9 Slide-out Drawer */}
      <StaffDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleCreateStaff}
        roles={roles}
        isLoading={createMutation.isPending}
      />

      {/* Change Role Modal */}
      <ChangeRoleModal
        staff={selectedStaffForRole}
        isOpen={Boolean(selectedStaffForRole)}
        onClose={() => setSelectedStaffForRole(null)}
        onSubmit={handleChangeRole}
        roles={roles}
        isLoading={changeRoleMutation.isPending}
      />

      {/* Lock/Unlock Modal */}
      <LockStaffModal
        staff={selectedStaffForLock}
        isOpen={Boolean(selectedStaffForLock)}
        onClose={() => setSelectedStaffForLock(null)}
        onConfirmLock={handleConfirmLock}
        onConfirmUnlock={handleConfirmUnlock}
        isLoading={lockMutation.isPending || unlockMutation.isPending}
      />
    </div>
  );
};
