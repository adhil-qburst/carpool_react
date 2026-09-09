import { describe, expect, it } from "vitest";
import { toApiError } from "./apiError";

function axiosError(overrides: {
  status?: number;
  data?: unknown;
  message?: string;
}) {
  return {
    isAxiosError: true,
    message: overrides.message ?? "Request failed",
    response: overrides.status
      ? { status: overrides.status, data: overrides.data }
      : undefined,
  };
}

describe("toApiError", () => {
  it("maps FastAPI validation errors to field errors", () => {
    const error = axiosError({
      status: 422,
      data: {
        detail: [
          { loc: ["body", "email"], msg: "Invalid email", type: "value_error" },
          { loc: ["body", "password"], msg: "Too short", type: "value_error" },
        ],
      },
    });

    const result = toApiError(error);

    expect(result.status).toBe(422);
    expect(result.message).toBe("Invalid email");
    expect(result.fieldErrors).toEqual({
      email: "Invalid email",
      password: "Too short",
    });
  });

  it("falls back to a generic message when there is no validation detail", () => {
    const error = axiosError({
      status: 500,
      data: {},
      message: "Server error",
    });

    const result = toApiError(error);

    expect(result.status).toBe(500);
    expect(result.message).toBe("Server error");
    expect(result.fieldErrors).toEqual({});
  });

  it("handles non-axios errors", () => {
    const result = toApiError(new Error("Network down"));

    expect(result.status).toBeNull();
    expect(result.message).toBe("Something went wrong. Please try again.");
    expect(result.fieldErrors).toEqual({});
  });
});
