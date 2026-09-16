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

export type WorkshopApplication = {
  id: string;
  name: string;
  username?: string;
  email?: string;
  telegram?: string;
  whatsapp?: string;
  trainingSetup?: string;
  classSchedule?: string;
  onsiteClassSchedule?: string;
  language?: string;
  languageOther?: string;
  remarks?: string;
  merchantOrderId?: string;
  paymentAmount?: string;
  courseTitle?: string;
};

export async function fetchMyWorkshopApplication(applicationId?: string) {
  const query = applicationId ? `?applicationId=${encodeURIComponent(applicationId)}` : "";
  const response = await apiRequest<WorkshopApplication>(`/api/learning-path-applications/me${query}`);
  return response.data;
}

export async function attachWorkshopPayment(input: {
  merchantOrderId: string;
  paymentAmount?: string;
  courseTitle?: string;
  applicationId?: string;
}) {
  const response = await apiRequest<WorkshopApplication>("/api/learning-path-applications/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return response.data;
}
