export interface CustomerAddress {
  id: string;
  customerId: string;
  recipientName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addressLine: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressPayload {
  recipientName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addressLine: string;
  isDefault?: boolean;
}

export type UpdateAddressPayload = CreateAddressPayload;

export interface WardOption {
  code: string;
  name: string;
}

export interface DistrictOption {
  code: string;
  name: string;
  wards: WardOption[];
}

export interface ProvinceOption {
  code: string;
  name: string;
  districts: DistrictOption[];
}
