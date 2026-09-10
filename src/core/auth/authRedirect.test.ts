import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  redirectToLogin,
  resetRedirectHandler,
  setRedirectHandler,
} from "./authRedirect";

describe("authRedirect", () => {
  beforeEach(() => {
    resetRedirectHandler();
  });

  afterEach(() => {
    resetRedirectHandler();
  });

  it("calls custom redirect handler if provided", () => {
    const customHandler = vi.fn();
    setRedirectHandler(customHandler);

    redirectToLogin();

    expect(customHandler).toHaveBeenCalledWith("/login");
  });

  it("resets to default handler", () => {
    const customHandler = vi.fn();
    setRedirectHandler(customHandler);
    resetRedirectHandler();

    // Default handler will touch window.location
    expect(() => redirectToLogin()).not.toThrow();
    expect(customHandler).not.toHaveBeenCalled();
  });
});
