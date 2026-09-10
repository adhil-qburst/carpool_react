type RedirectHandler = (to: string) => void;

const defaultHandler: RedirectHandler = (to: string) => {
  if (typeof window !== "undefined" && window.location) {
    try {
      if (window.location.pathname !== to) {
        window.location.href = to;
      }
    } catch {
      window.location.assign?.(to);
    }
  }
};

let redirectHandler: RedirectHandler = defaultHandler;

export function setRedirectHandler(handler: RedirectHandler): void {
  redirectHandler = handler;
}

export function resetRedirectHandler(): void {
  redirectHandler = defaultHandler;
}

export function redirectToLogin(): void {
  redirectHandler("/login");
}
