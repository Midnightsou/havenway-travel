export function startOfDay(date) {
  if (!date) return null;

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
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
  if (!date) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(date) {
  if (!date) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}