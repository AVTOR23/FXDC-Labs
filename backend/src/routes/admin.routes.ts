import { Router } from "express";
import {
  getEducation,
  listEducation,
  removeEducation,
  updateEducation,
} from "../controllers/educationApplication.controller.js";
import {
  getTradingTools,
  listTradingTools,
  removeTradingTools,
  updateTradingTools,
} from "../controllers/tradingToolsApplication.controller.js";
import { getStats } from "../controllers/stats.controller.js";
import {
  listUploads,
  removeMedia,
  uploadMedia,
} from "../controllers/upload.controller.js";
import { requireAdmin } from "../middlewares/auth.js";
import { uploadImage } from "../middlewares/upload.js";
import { uploadLimiter } from "../middlewares/rateLimiters.js";
import { validate } from "../middlewares/validate.js";
import {
  applicationUpdateSchema,
  idParamsSchema,
  paginationQuerySchema,
} from "../validators/common.validator.js";
import {
  adminUpdateUserSchema,
  userListQuerySchema,
} from "../validators/auth.validator.js";
import {
  getAdminUser,
  listAdminUsers,
  updateAdminUser,
} from "../controllers/user.controller.js";
import {
  getContact,
  listContacts,
  removeContact,
  updateContact,
} from "../controllers/contact.controller.js";
import {
  getAdminPayment,
  getAdminPaymentStats,
  listAdminPaymentEvents,
  listAdminPayments,
  patchAdminPayment,
  resyncAdminPayment,
} from "../controllers/payment.controller.js";
import {
  adminPaymentUpdateSchema,
  paymentListQuerySchema,
} from "../validators/payment.validator.js";

const router = Router();

router.use(requireAdmin);

router.get("/stats", getStats);

router.get("/users", validate(userListQuerySchema, "query"), listAdminUsers);
router.get("/users/:id", validate(idParamsSchema, "params"), getAdminUser);
router.patch(
  "/users/:id",
  validate(idParamsSchema, "params"),
  validate(adminUpdateUserSchema),
  updateAdminUser
);

router.get(
  "/education-applications",
  validate(paginationQuerySchema, "query"),
  listEducation
);
router.get(
  "/education-applications/:id",
  validate(idParamsSchema, "params"),
  getEducation
);
router.patch(
  "/education-applications/:id",
  validate(idParamsSchema, "params"),
  validate(applicationUpdateSchema),
  updateEducation
);
router.delete(
  "/education-applications/:id",
  validate(idParamsSchema, "params"),
  removeEducation
);

router.get(
  "/trading-tools-applications",
  validate(paginationQuerySchema, "query"),
  listTradingTools
);
router.get(
  "/trading-tools-applications/:id",
  validate(idParamsSchema, "params"),
  getTradingTools
);
router.patch(
  "/trading-tools-applications/:id",
  validate(idParamsSchema, "params"),
  validate(applicationUpdateSchema),
  updateTradingTools
);
router.delete(
  "/trading-tools-applications/:id",
  validate(idParamsSchema, "params"),
  removeTradingTools
);

router.get("/media", validate(paginationQuerySchema, "query"), listUploads);
router.post("/media", uploadLimiter, uploadImage, uploadMedia);
router.delete("/media/:id", validate(idParamsSchema, "params"), removeMedia);

router.get(
  "/contact-submissions",
  validate(paginationQuerySchema, "query"),
  listContacts
);
router.get(
  "/contact-submissions/:id",
  validate(idParamsSchema, "params"),
  getContact
);
router.patch(
  "/contact-submissions/:id",
  validate(idParamsSchema, "params"),
  validate(applicationUpdateSchema),
  updateContact
);
router.delete(
  "/contact-submissions/:id",
  validate(idParamsSchema, "params"),
  removeContact
);

router.get("/payments/stats", getAdminPaymentStats);
router.get("/payments", validate(paymentListQuerySchema, "query"), listAdminPayments);
router.get("/payments/:id/events", validate(idParamsSchema, "params"), listAdminPaymentEvents);
router.get("/payments/:id", validate(idParamsSchema, "params"), getAdminPayment);
router.patch(
  "/payments/:id",
  validate(idParamsSchema, "params"),
  validate(adminPaymentUpdateSchema),
  patchAdminPayment
);
router.post("/payments/:id/resync", validate(idParamsSchema, "params"), resyncAdminPayment);

export default router;
