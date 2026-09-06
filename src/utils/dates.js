function toDate(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate()
    );
  }

  if (typeof value === "string") {
    /*
     * Trip dates are calendar dates, not timestamps.
     *
     * If Supabase/API returns:
     * 2026-10-10T00:00:00.000Z
     *
     * we preserve:
     * 2026-10-10
     *
     * instead of allowing the browser timezone
     * to turn it into October 9.
     */
    const dateOnlyMatch = value.match(
      /^(\d{4})-(\d{2})-(\d{2})/
    );

    if (dateOnlyMatch) {
      const [, year, month, day] = dateOnlyMatch;

      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );
    }

    const parsed = new Date(value);

    return Number.isNaN(parsed.getTime())
      ? null
      : parsed;
  }

  if (typeof value === "number") {
    const parsed = new Date(value);

    return Number.isNaN(parsed.getTime())
      ? null
      : parsed;
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

  if (!startDay || !endDay) return 0;

  return Math.round(
    (endDay - startDay) /
      (1000 * 60 * 60 * 24)
  );
}

export function getTripDuration(
  startDate,
  endDate
) {
  const nights = differenceInDays(
    startDate,
    endDate
  );

  const days =
    nights > 0 ? nights + 1 : 0;

  return {
    nights,
    days,
  };
}

export function formatDate(date) {
  const parsed = toDate(date);

  if (!parsed) return "";

  return parsed.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

export function formatShortDate(date) {
  const parsed = toDate(date);

  if (!parsed) return "";

  return parsed.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );
}
