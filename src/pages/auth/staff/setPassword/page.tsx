import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { SetPasswordForm } from '../../../../features/staff';

export const StaffSetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {token ? (
        <SetPasswordForm token={token} />
      ) : (
        <div className="w-full max-w-md rounded-2xl bg-white border border-gray-200 p-8 text-center text-gray-700 shadow-md">
          <p className="font-semibold text-rose-600 font-serif uppercase">
            Mã kích hoạt không hợp lệ hoặc bị thiếu
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Vui lòng kiểm tra lại liên kết trong email mời của bạn hoặc liên hệ
            Quản trị viên để nhận lại mã kích hoạt mới.
          </p>
        </div>
      )}
    </div>
  );
};
