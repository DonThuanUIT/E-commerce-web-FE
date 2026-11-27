import { WishlistGrid } from '../../../features/wishlist';
import { CustomerProtectedRoute } from '../../../features/auth';

const WishlistPage = () => {
  return (
    <CustomerProtectedRoute>
      <WishlistGrid />
    </CustomerProtectedRoute>
  );
};

export default WishlistPage;
