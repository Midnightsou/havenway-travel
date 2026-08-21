function toDate(value) {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

export function startOfDay(date) {
  const parsed = toDate(date);
  if (!parsed) return null;

  return new Date(
    parsed.getFullYear(),
    parsed.getMonth(),
    parsed.getDate()
  );
}

export function differenceInDays(start, end) {
  if (!start || !end) return 0;

  const startDay = startOfDay(start);
  const endDay = startOfDay(end);

  return Math.round(
    (endDay - startDay) / (1000 * 60 * 60 * 24)
  );
}

export function getTripDuration(startDate, endDate) {
  const nights = differenceInDays(startDate, endDate);
  const days = nights > 0 ? nights + 1 : 0;

  return { nights, days };
}

export function formatDate(date) {
  const parsed = toDate(date);
  if (!parsed) return "";

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(date) {
  const parsed = toDate(date);
  if (!parsed) return "";

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
