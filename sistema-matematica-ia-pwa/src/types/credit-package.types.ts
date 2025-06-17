// src/types/credit-package.types.ts
export interface CreditPackageFE {
  id?: string;
  name?: string;
  description?: string | null;
  creditAmount?: number;
  credit_amount?: number;
  price?: number;
  isActive?: boolean;
  is_active?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
export type CreateCreditPackageData = Omit<
  CreditPackageFE,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateCreditPackageData = Partial<CreateCreditPackageData>;
