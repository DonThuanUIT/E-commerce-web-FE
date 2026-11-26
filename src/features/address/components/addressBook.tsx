import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Plus,
  RefreshCw,
  User,
  XCircle,
} from 'lucide-react';
import { ApiRequestError } from '../../../shared/api/apiRequestError';
import { customerTokenStorage } from '../../auth/utils/customerTokenStorage';
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useUpdateAddress,
} from '../hooks/useAddresses';
import type {
  CreateAddressPayload,
  CustomerAddress,
} from '../types/addressType';
import { AddressCard } from './addressCard';
import { AddressFormModal } from './addressFormModal';
import { DeleteAddressModal } from './deleteAddressModal';

interface ToastState {
  type: 'success' | 'error';
  message: string;
}

/**
 * Customer Address Book screen matching Stitch Screen 6 (My Account & Address Book).
 */
export const AddressBook: React.FC = () => {
  const customer = customerTokenStorage.getCustomerProfile();
  const {
    data: addresses = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useAddresses();
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const deleteMutation = useDeleteAddress();
  const setDefaultMutation = useSetDefaultAddress();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(
    null,
  );
  const [deletingAddress, setDeletingAddress] =
    useState<CustomerAddress | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const sortedAddresses = useMemo(() => {
    return [...addresses].sort(
      (a, b) => Number(b.isDefault) - Number(a.isDefault),
    );
  }, [addresses]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 4000);
  };

  const extractErrorMessage = (err: unknown, fallback: string): string => {
    if (err instanceof ApiRequestError) {
      if (err.status === 401) {
        return 'Your session has expired. Please sign in again.';
      }
      if (err.status === 404) {
        return err.message || 'Address not found.';
      }
      if (err.status === 409 || err.status === 400) {
        return err.message || fallback;
      }
      return err.message || fallback;
    }
    if (err instanceof Error) return err.message;
    return fallback;
  };

  const handleOpenCreate = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (address: CustomerAddress) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (payload: CreateAddressPayload) => {
    try {
      if (editingAddress) {
        await updateMutation.mutateAsync({ id: editingAddress.id, payload });
        showToast('success', 'Delivery address updated successfully.');
      } else {
        await createMutation.mutateAsync(payload);
        showToast('success', 'New delivery address added.');
      }
      setIsFormOpen(false);
      setEditingAddress(null);
    } catch (err) {
      showToast(
        'error',
        extractErrorMessage(err, 'Failed to save delivery address.'),
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingAddress) return;
    try {
      await deleteMutation.mutateAsync(deletingAddress.id);
      showToast('success', 'Delivery address removed.');
      setDeletingAddress(null);
    } catch (err) {
      showToast(
        'error',
        extractErrorMessage(err, 'Failed to delete delivery address.'),
      );
    }
  };

  const handleSetDefault = async (id: string) => {
    setSettingDefaultId(id);
    try {
      await setDefaultMutation.mutateAsync(id);
      showToast('success', 'Default delivery address updated.');
    } catch (err) {
      showToast(
        'error',
        extractErrorMessage(err, 'Failed to update default address.'),
      );
    } finally {
      setSettingDefaultId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-lg font-bold tracking-widest text-black uppercase"
            >
              ATELIER
            </Link>
            <span className="hidden font-mono text-[10px] tracking-widest text-gray-400 uppercase sm:inline">
              Maison Client Portal
            </span>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-wider text-gray-600 uppercase transition hover:text-black"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Boutique</span>
          </Link>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed right-4 bottom-4 z-50 max-w-sm">
          <div
            role="status"
            className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-xs font-medium shadow-lg ${
              toast.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-rose-200 bg-rose-50 text-rose-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Account Sidebar */}
          <aside className="lg:col-span-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
              <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {customer?.fullName || 'Maison Client'}
                  </p>
                  <p className="truncate font-mono text-[11px] text-gray-500">
                    {customer?.email || 'Authenticated Session'}
                  </p>
                </div>
              </div>

              <nav className="space-y-1 text-xs font-medium">
                <Link
                  to="/account/addresses"
                  className="flex items-center gap-2.5 rounded-lg bg-black px-3.5 py-2.5 text-white"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Address Book</span>
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Address Book Content */}
          <main className="lg:col-span-9">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-2xs">
              <div className="mb-6 flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase">
                    Client Logistics
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
                    Address Book
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Pre-registered locations for priority shipping and concierge
                    returns.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-neutral-800 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-44 animate-pulse rounded-xl border border-gray-200 bg-gray-100"
                    />
                  ))}
                </div>
              ) : isError ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
                  <p className="text-sm font-medium text-rose-800">
                    {extractErrorMessage(
                      error,
                      'Unable to load your delivery addresses.',
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-rose-300 bg-white px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Retry</span>
                  </button>
                </div>
              ) : sortedAddresses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
                  <MapPin className="mx-auto h-10 w-10 text-gray-400" />
                  <h2 className="mt-3 text-base font-semibold text-gray-900">
                    No saved delivery addresses
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Add your first shipping destination for faster checkout.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold tracking-wider text-white uppercase hover:bg-neutral-800 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Address</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {sortedAddresses.map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      isOnlyAddress={sortedAddresses.length <= 1}
                      isSettingDefault={settingDefaultId === address.id}
                      onEdit={handleOpenEdit}
                      onDelete={setDeletingAddress}
                      onSetDefault={handleSetDefault}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {isFormOpen && (
        <AddressFormModal
          key={editingAddress?.id ?? 'new'}
          isOpen={isFormOpen}
          editingAddress={editingAddress}
          totalAddressCount={sortedAddresses.length}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onClose={() => {
            setIsFormOpen(false);
            setEditingAddress(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      <DeleteAddressModal
        address={deletingAddress}
        isDeleting={deleteMutation.isPending}
        onCancel={() => setDeletingAddress(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
