import axios from "axios";
import type { ApiError, HTTPValidationError } from "./api.types";

export function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError<HTTPValidationError>(error)) {
    const status = error.response?.status ?? null;
    const detail = error.response?.data?.detail;

    if (Array.isArray(detail)) {
      const fieldErrors: Record<string, string> = {};
      for (const item of detail) {
        const field = item.loc[item.loc.length - 1];
        if (typeof field === "string") fieldErrors[field] = item.msg;
      }
      return {
        status,
        message: detail[0]?.msg ?? "Please check the highlighted fields.",
        fieldErrors,
      };
    }

    if (typeof detail === "string" && detail.trim()) {
      return { status, message: detail, fieldErrors: {} };
    }

    return {
      status,
      message: error.message || "Something went wrong. Please try again.",
      fieldErrors: {},
    };
  }

  return {
    status: null,
    message: "Something went wrong. Please try again.",
    fieldErrors: {},
  };
}
