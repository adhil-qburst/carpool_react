import type { TripRouteOption } from "@features/trips/types/trips.api.types";

export function parseDateParts(dateStr?: string): { month: string; day: string } {
  if (!dateStr) return { month: "--", day: "--" };
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return { month: "--", day: "--" };
  const date = new Date(year, month - 1, day);
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: String(day),
  };
}

export function formatDepartureDate(dateStr?: string): string {
  if (!dateStr) return "-";
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return dateStr;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export function formatDepartureTime(timeStr?: string): string {
  if (!timeStr) return "--:--";
  const [hStr, mStr] = timeStr.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return timeStr.slice(0, 5);
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 || 12;
  const displayM = m < 10 ? `0${m}` : `${m}`;
  return `${displayH.toString().padStart(2, "0")}:${displayM} ${period}`;
}

export function getRouteDetails(route?: TripRouteOption): {
  origin: string;
  destination: string;
  stopsCount: number;
  routeCode: string;
  duration: string;
  distance: string;
} {
  if (!route) {
    return {
      origin: "Unassigned Route",
      destination: "-",
      stopsCount: 0,
      routeCode: "N/A",
      duration: "-",
      distance: "-",
    };
  }

  const routeCode = route.name || `RT-${route.id.slice(0, 6).toUpperCase()}`;

  if (route.route_stops && route.route_stops.length > 0) {
    const sorted = [...route.route_stops].sort(
      (a, b) => a.sequence - b.sequence,
    );
    const startStop = sorted[0];
    const endStop = sorted[sorted.length - 1];
    const origin =
      startStop?.location?.name || startStop?.location?.city || "Origin";
    const destination =
      sorted.length > 1
        ? endStop?.location?.name || endStop?.location?.city || "Destination"
        : "Destination";

    const lat1 = Number(startStop?.location?.lat);
    const lon1 = Number(startStop?.location?.lng);
    const lat2 = Number(endStop?.location?.lat);
    const lon2 = Number(endStop?.location?.lng);

    let distance = "-";
    let duration = "-";

    if (
      !isNaN(lat1) &&
      !isNaN(lon1) &&
      !isNaN(lat2) &&
      !isNaN(lon2) &&
      lat1 !== 0 &&
      lat2 !== 0
    ) {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distKm = Math.round(R * c);
      distance = `${distKm} km`;
      const hours = Math.floor(distKm / 45);
      const mins = Math.round(((distKm % 45) / 45) * 60);
      duration = hours > 0 ? `~ ${hours}h ${mins}m` : `~ ${mins}m`;
    }

    return {
      origin,
      destination,
      stopsCount: sorted.length,
      routeCode,
      duration,
      distance,
    };
  }

  let origin = route.name;
  let destination = "-";
  if (route.name.includes(" - ")) {
    const parts = route.name.split(" - ");
    origin = parts[0]?.trim() || route.name;
    destination = parts[1]?.trim() || "-";
  } else if (route.name.includes(" to ")) {
    const parts = route.name.split(" to ");
    origin = parts[0]?.trim() || route.name;
    destination = parts[1]?.trim() || "-";
  }

  return {
    origin,
    destination,
    stopsCount: 0,
    routeCode,
    duration: "-",
    distance: "-",
  };
}

export function getStatusBadge(status?: string): { label: string; className: string } {
  switch (status?.toLowerCase()) {
    case "scheduled":
      return {
        label: "Scheduled",
        className: "border-surface-mint-border bg-surface-mint text-primary",
      };
    case "completed":
      return {
        label: "Completed",
        className: "border-border-subtle bg-surface-container text-text-muted",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        className: "border-amber-200 bg-amber-50 text-amber-700",
      };
    case "deleted":
      return {
        label: "Deleted",
        className: "border-rose-200 bg-rose-50 text-rose-700",
      };
    default:
      return {
        label: status ? status.charAt(0).toUpperCase() + status.slice(1) : "-",
        className: "border-border-subtle bg-surface-container text-text-muted",
      };
  }
}
