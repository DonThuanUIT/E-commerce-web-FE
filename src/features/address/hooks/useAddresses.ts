import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addressService } from '../services/addressService';
import type {
  CreateAddressPayload,
  UpdateAddressPayload,
} from '../types/addressType';

export const addressKeys = {
  all: ['customer-addresses'] as const,
  list: () => [...addressKeys.all, 'list'] as const,
};

export function useAddresses() {
  return useQuery({
    queryKey: addressKeys.list(),
    queryFn: ({ signal }) => addressService.getAddresses(signal),
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAddressPayload) =>
      addressService.createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAddressPayload;
    }) => addressService.updateAddress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressService.setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
    },
  });
}
