import {
  MapPin,
  Clock,
  Star,
  Check,
  Ticket,
  Plus,
} from "lucide-react";

import activities from "../../data/activities";

import { formatDate } from "../../utils/dates";

import "./Activities.css";


function Activities({
  travellers = 1,
  startDate,
  endDate,
  selectedActivities = [],
  onSelectActivities,
}) {

  const dateRange = startDate && endDate
    ? `${formatDate(startDate)} – ${formatDate(endDate)}`
    : "";

  const handleToggle = (activityId) => {

    if (!onSelectActivities) return;

    const isSelected =
      selectedActivities.includes(activityId);

    if (isSelected) {

      onSelectActivities(
        selectedActivities.filter(
          (id) => id !== activityId
        )
      );

    } else {

      onSelectActivities([
        ...selectedActivities,
        activityId,
      ]);

    }

  };

  return (
    <section
      className="activities"
      id="things-to-do"
    >

      <div className="container">

        <div className="activity-heading">

          <div>
            <span className="section-eyebrow">
              Explore Los Angeles
            </span>

            <h2>
              Things to do
            </h2>

            <p>
              Top activities and experiences in
              Los Angeles · {dateRange}
            </p>
          </div>

          <div className="activity-badge">
            <Ticket size={18} />

            {activities.length} experiences
          </div>

        </div>


        <div className="activity-list">

          {activities.map((activity) => {

            const total =
              activity.pricePerPerson *
              travellers;

            const isSelected =
              selectedActivities.includes(
                activity.id
              );

            return (
              <article
                className={"activity-card" + (isSelected ? " selected" : "")}
                key={activity.id}
              >

                <div className="activity-card-top">

                  <div>
                    <span className="activity-type">
                      {activity.location}
                    </span>

                    <h3>
                      {activity.name}
                    </h3>

                    <p>
                      {activity.description}
                    </p>
                  </div>

                  <div className="activity-price">
                    <span>
                      ${activity.pricePerPerson} per person
                    </span>

                    <strong>
                      ${total}
                    </strong>

                    <small>
                      for {travellers}{" "}
                      {travellers === 1
                        ? "person"
                        : "people"}
                    </small>
                  </div>

                </div>


                <div className="activity-meta">

                  <div>
                    <MapPin size={16} />

                    <span>
                      {activity.location}
                    </span>
                  </div>

                  <div>
                    <Clock size={16} />

                    <span>
                      {activity.duration}
                    </span>
                  </div>

                  <div>
                    <Star size={16} />

                    <span>
                      {activity.rating} · {activity.reviews} reviews
                    </span>
                  </div>

                </div>


                <div className="activity-includes">

                  {activity.includes.map((item) => (
                    <div
                      className="activity-include"
                      key={item}
                    >
                      <Check size={15} />

                      <span>
                        {item}
                      </span>
                    </div>
                  ))}

                </div>


                {onSelectActivities && (
                  <button
                    className={"select-activity-button" + (isSelected ? " activity-selected" : "")}
                    onClick={() =>
                      handleToggle(activity.id)
                    }
                  >
                    {isSelected ? (
                      <>
                        <Check size={17} />
                        Added to trip
                      </>
                    ) : (
                      <>
                        <Plus size={17} />
                        Add to trip
                      </>
                    )}
                  </button>
                )}

              </article>
            );
          })}

        </div>

      </div>

    </section>
  );
}

export default Activities;