import type { Request, Response } from "express";
import {
  createTradingToolsApplication,
  deleteTradingToolsApplication,
  getTradingToolsApplication,
  listTradingToolsApplications,
  updateTradingToolsApplication,
} from "../services/tradingToolsApplication.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { TradingToolsApplicationInput } from "../validators/tradingToolsApplication.validator.js";
import type {
  ApplicationUpdate,
  IdParams,
  PaginationQuery,
} from "../validators/common.validator.js";

export const submitTradingToolsApplication = asyncHandler(async (req: Request, res: Response) => {
  const data = await createTradingToolsApplication(
    req.body as TradingToolsApplicationInput,
    {
      ip: req.ip,
      userAgent: req.get("user-agent"),
      userId: req.user?.sub,
    }
  );

  res.status(201).json(new ApiResponse(true, "Application submitted", data));
});

export const listTradingTools = asyncHandler(async (req: Request, res: Response) => {
  const result = await listTradingToolsApplications(req.query as unknown as PaginationQuery);
  res.status(200).json(
    new ApiResponse(true, "Trading tools applications", result.items, result.meta)
  );
});

export const getTradingTools = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as IdParams;
  const item = await getTradingToolsApplication(id);
  res.status(200).json(new ApiResponse(true, "Trading tools application", item));
});

export const updateTradingTools = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as IdParams;
  const item = await updateTradingToolsApplication(id, req.body as ApplicationUpdate);
  res.status(200).json(new ApiResponse(true, "Application updated", item));
});

export const removeTradingTools = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as IdParams;
  await deleteTradingToolsApplication(id);
  res.status(200).json(new ApiResponse(true, "Application deleted"));
});
