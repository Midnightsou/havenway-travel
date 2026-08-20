import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapPin,
  CalendarDays,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import TravellerSelector from "../TravellerSelector/TravellerSelector";

import "./SearchBar.css";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = [
  "Su",
  "Mo",
  "Tu",
  "We",
  "Th",
  "Fr",
  "Sa",
];

function startOfDay(date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function formatDate(date) {
  if (!date) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function sameDate(date1, date2) {
  if (!date1 || !date2) return false;

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function differenceInDays(start, end) {
  if (!start || !end) return 0;

  const startDay = startOfDay(start);
  const endDay = startOfDay(end);

  return Math.round(
    (endDay - startDay) / (1000 * 60 * 60 * 24)
  );
}

function SearchBar({
  travellers,
  setTravellers,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) {
  const [calendarOpen, setCalendarOpen] =
    useState(false);

  const [selectingReturn, setSelectingReturn] =
    useState(false);

  const [hoverDate, setHoverDate] =
    useState(null);

  const [currentMonth, setCurrentMonth] =
    useState(new Date());

  const calendarRef = useRef(null);

  const today = startOfDay(new Date());

  /*
   * Close calendar when clicking outside.
   */
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setCalendarOpen(false);
        setHoverDate(null);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /*
   * Generate the 42 calendar cells.
   */
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const firstWeekday = firstDay.getDay();

    const days = [];

    for (
      let i = 0;
      i < 42;
      i++
    ) {
      const date = new Date(
        year,
        month,
        i - firstWeekday + 1
      );

      days.push(date);
    }

    return days;
  }, [currentMonth]);

  /*
   * Open calendar.
   */
  const handleCalendarOpen = () => {
    setCalendarOpen((previous) => !previous);

    if (startDate) {
      setCurrentMonth(
        new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          1
        )
      );
    }
  };

  /*
   * Select a date.
   */
  const handleDateSelect = (date) => {
    if (date < today) {
      return;
    }

    /*
     * First selection:
     * choose departure/check-in.
     */
    if (!startDate || !selectingReturn) {
      setStartDate(date);
      setEndDate(null);
      setSelectingReturn(true);
      setHoverDate(null);

      return;
    }

    /*
     * User clicked a date before
     * their departure date.
     *
     * Treat it as a new departure.
     */
    if (date < startDate) {
      setStartDate(date);
      setEndDate(null);
      setSelectingReturn(true);
      setHoverDate(null);

      return;
    }

    /*
     * Second selection:
     * choose return/check-out.
     */
    setEndDate(date);
    setSelectingReturn(false);
    setHoverDate(null);

    /*
     * Close after completing
     * the date range.
     */
    setCalendarOpen(false);
  };

  /*
   * Previous month.
   */
  const goToPreviousMonth = () => {
    const previousMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );

    const minimumMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    if (previousMonth < minimumMonth) {
      return;
    }

    setCurrentMonth(previousMonth);
  };

  /*
   * Next month.
   */
  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );
  };

  /*
   * Determine whether a date is
   * inside the selected range.
   */
  const isInRange = (date) => {
    if (!startDate) {
      return false;
    }

    if (endDate) {
      return (
        date > startDate &&
        date < endDate
      );
    }

    /*
     * Preview the range while
     * selecting the return date.
     */
    if (
      selectingReturn &&
      hoverDate
    ) {
      const rangeStart =
        hoverDate < startDate
          ? hoverDate
          : startDate;

      const rangeEnd =
        hoverDate > startDate
          ? hoverDate
          : startDate;

      return (
        date > rangeStart &&
        date < rangeEnd
      );
    }

    return false;
  };

  const nights =
    differenceInDays(
      startDate,
      endDate
    );

  const days =
    nights > 0
      ? nights + 1
      : 0;

  return (
    <section className="search-section">

      <div className="container">

        <div className="search-bar">

          {/* DESTINATION */}

          <button
            type="button"
            className="search-field location-field"
          >
            <MapPin size={21} />

            <div className="field-content">

              <span className="field-label">
                Destination
              </span>

              <strong>
                Los Angeles, California
              </strong>

            </div>
          </button>


          {/* DATES */}

          <div
            className="search-date-wrapper"
            ref={calendarRef}
          >

            <button
              type="button"
              className="search-field"
              onClick={handleCalendarOpen}
              aria-expanded={calendarOpen}
            >

              <CalendarDays size={21} />

              <div className="field-content">

                <span className="field-label">
                  Dates
                </span>

                <strong>
                  {startDate && endDate
                    ? `${formatDate(
                        startDate
                      )} – ${formatDate(
                        endDate
                      )}`
                    : startDate
                    ? `${formatDate(
                        startDate
                      )} – Select return`
                    : "Select dates"}
                </strong>

              </div>

            </button>


            {/* CALENDAR POPUP */}

            {calendarOpen && (

              <div className="date-picker">

                <div className="date-picker-header">

                  <div>

                    <span className="date-picker-label">
                      {selectingReturn
                        ? "Select return date"
                        : "Select departure date"}
                    </span>

                    <strong>
                      {startDate
                        ? endDate
                          ? `${formatDate(
                              startDate
                            )} – ${formatDate(
                              endDate
                            )}`
                          : `${formatDate(
                              startDate
                            )} – Select return`
                        : "Select your travel dates"}
                    </strong>

                  </div>

                </div>


                {/* MONTH NAVIGATION */}

                <div className="date-picker-navigation">

                  <button
                    type="button"
                    onClick={
                      goToPreviousMonth
                    }
                    aria-label="Previous month"
                  >
                    <ChevronLeft
                      size={18}
                    />
                  </button>

                  <strong>
                    {
                      MONTHS[
                        currentMonth.getMonth()
                      ]
                    }{" "}
                    {currentMonth.getFullYear()}
                  </strong>

                  <button
                    type="button"
                    onClick={
                      goToNextMonth
                    }
                    aria-label="Next month"
                  >
                    <ChevronRight
                      size={18}
                    />
                  </button>

                </div>


                {/* WEEKDAYS */}

                <div className="calendar-weekdays">

                  {WEEKDAYS.map(
                    (day) => (
                      <span key={day}>
                        {day}
                      </span>
                    )
                  )}

                </div>


                {/* DAYS */}

                <div className="calendar-days">

                  {calendarDays.map(
                    (date) => {

                      const isPast =
                        date < today;

                      const isStart =
                        sameDate(
                          date,
                          startDate
                        );

                      const isEnd =
                        sameDate(
                          date,
                          endDate
                        );

                      const isToday =
                        sameDate(
                          date,
                          today
                        );

                      const isRange =
                        isInRange(
                          date
                        );

                      const isOutsideMonth =
                        date.getMonth() !==
                        currentMonth.getMonth();

                      return (
                        <button
                          type="button"
                          key={date.toISOString()}
                          disabled={isPast}
                          onClick={() =>
                            handleDateSelect(
                              date
                            )
                          }
                          onMouseEnter={() =>
                            !isPast &&
                            selectingReturn &&
                            setHoverDate(
                              date
                            )
                          }
                          onMouseLeave={() =>
                            setHoverDate(null)
                          }
                          className={[
                            "calendar-day",
                            isOutsideMonth
                              ? "outside-month"
                              : "",
                            isPast
                              ? "past-date"
                              : "",
                            isToday
                              ? "today"
                              : "",
                            isStart
                              ? "selected-start"
                              : "",
                            isEnd
                              ? "selected-end"
                              : "",
                            isRange
                              ? "selected-range"
                              : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {date.getDate()}
                        </button>
                      );
                    }
                  )}

                </div>


                {/* TRIP DURATION */}

                {startDate &&
                  endDate && (
                    <div className="date-picker-summary">

                      <span>
                        Trip duration
                      </span>

                      <strong>
                        {nights}{" "}
                        {nights === 1
                          ? "night"
                          : "nights"}{" "}
                        /{" "}
                        {days}{" "}
                        {days === 1
                          ? "day"
                          : "days"}
                      </strong>

                    </div>
                  )}

              </div>

            )}

          </div>


          {/* TRAVELERS */}

          <button
            type="button"
            className="search-field"
          >

            <Users size={21} />

            <div className="field-content">

              <span className="field-label">
                Travelers
              </span>

              <strong>
                {travellers}{" "}
                {travellers === 1
                  ? "traveler"
                  : "travelers"}
              </strong>

            </div>

          </button>

        </div>


        <div className="search-traveller-selector">

          <TravellerSelector
            travellers={travellers}
            setTravellers={setTravellers}
          />

        </div>

      </div>

    </section>
  );
}

export default SearchBar;