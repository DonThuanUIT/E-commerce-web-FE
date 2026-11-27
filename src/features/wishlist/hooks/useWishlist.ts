import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '../services/wishlistService';
import { customerTokenStorage } from '../../auth/utils/customerTokenStorage';

export const WISHLIST_QUERY_KEY = ['wishlist'];
export const WISHLIST_STATUS_QUERY_KEY = (productId: string) => [
  'wishlist',
  'status',
  productId,
];

export function useWishlist() {
  const queryClient = useQueryClient();
  const isAuthenticated = Boolean(customerTokenStorage.getAccessToken());

  const {
    data: items = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: wishlistService.getWishlist,
    enabled: isAuthenticated,
  });

  const addMutation = useMutation({
    mutationFn: (productId: string) => wishlistService.add(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      queryClient.setQueryData(WISHLIST_STATUS_QUERY_KEY(productId), true);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => wishlistService.remove(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      queryClient.setQueryData(WISHLIST_STATUS_QUERY_KEY(productId), false);
    },
  });

  return {
    items,
    isLoading,
    isError,
    error,
    refetch,
    isAuthenticated,
    addToWishlist: addMutation.mutateAsync,
    removeFromWishlist: removeMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}

export function useProductWishlistStatus(productId: string | undefined) {
  const queryClient = useQueryClient();
  const isAuthenticated = Boolean(customerTokenStorage.getAccessToken());

  const { data: isWishlisted = false, isLoading } = useQuery({
    queryKey: WISHLIST_STATUS_QUERY_KEY(productId || ''),
    queryFn: () => (productId ? wishlistService.checkStatus(productId) : false),
    enabled: Boolean(productId) && isAuthenticated,
  });

  const toggleMutation = useMutation({
    mutationFn: async () => {
      if (!productId) return;
      if (isWishlisted) {
        await wishlistService.remove(productId);
      } else {
        await wishlistService.add(productId);
      }
    },
    onMutate: async () => {
      if (!productId) return;
      await queryClient.cancelQueries({
        queryKey: WISHLIST_STATUS_QUERY_KEY(productId),
      });
      const previousValue = queryClient.getQueryData<boolean>(
        WISHLIST_STATUS_QUERY_KEY(productId),
      );
      queryClient.setQueryData(
        WISHLIST_STATUS_QUERY_KEY(productId),
        !isWishlisted,
      );
      return { previousValue };
    },
    onError: (_err, _vars, context) => {
      if (productId && context?.previousValue !== undefined) {
        queryClient.setQueryData(
          WISHLIST_STATUS_QUERY_KEY(productId),
          context.previousValue,
        );
      }
    },
    onSettled: () => {
      if (productId) {
        queryClient.invalidateQueries({
          queryKey: WISHLIST_STATUS_QUERY_KEY(productId),
        });
        queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      }
    },
  });

  return {
    isWishlisted,
    isLoading,
    isAuthenticated,
    toggleWishlist: toggleMutation.mutateAsync,
    isToggling: toggleMutation.isPending,
  };
}
