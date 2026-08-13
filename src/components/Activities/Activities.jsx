import {
  MapPin,
  Clock,
  Star,
  Check,
  Ticket,
} from "lucide-react";

import activities from "../../data/activities";

import "./Activities.css";


function Activities({ travellers = 1 }) {
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
              Los Angeles · Oct 12 – Oct 15, 2026
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

            return (
              <article
                className="activity-card"
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

              </article>
            );
          })}

        </div>

      </div>

    </section>
  );
}

export default Activities;