import { AddressBook } from '../../../features/address';
import { CustomerProtectedRoute } from '../../../features/auth';

const AddressesPage = () => {
  return (
    <CustomerProtectedRoute>
      <AddressBook />
    </CustomerProtectedRoute>
  );
};

export default AddressesPage;
