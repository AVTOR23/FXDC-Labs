import { apiRequest } from "@/react-app/lib/api";

export type CourseCatalogItem = {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  currency: string;
  available: boolean;
};

export type PaymentOrderResponse = {
  paymentId: string;
  merchantOrderId: string;
  checkoutUrl: string;
  amount: string;
  currency: string;
  status: string;
};

export type PaymentRecord = {
  id: string;
  merchantOrderId: string;
  cipherbcOrderNo?: string;
  courseId: string;
  courseTitle: string;
  amount: string;
  currency: string;
  status: string;
  checkoutUrl?: string;
  paidAmount?: string;
  completedAt?: string;
};

export async function fetchCourses() {
  const response = await apiRequest<CourseCatalogItem[]>("/api/payments/courses");
  return response.data;
}

export async function createPaymentOrder(courseId: string) {
  const response = await apiRequest<PaymentOrderResponse>("/api/payments/create", {
    method: "POST",
    body: JSON.stringify({ courseId }),
  });
  return response.data;
}

export async function fetchPaymentStatus(merchantOrderId: string) {
  const response = await apiRequest<PaymentRecord>(
    `/api/payments/status/${encodeURIComponent(merchantOrderId)}`
  );
  return response.data;
}
