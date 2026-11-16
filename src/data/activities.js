const hotelActivities = {
  "westin-los-angeles": [
    {
      id: "westin-manhattan-beach",
      name: "Manhattan Beach Pier & Waterfront",
      location: "Manhattan Beach",
      duration: "2.5 hours",
      pricePerPerson: 0,
      rating: 4.8,
      reviews: 1820,
      description:
        "Spend a relaxed afternoon along the beach, pier, and nearby coastal paths south of Los Angeles.",
      includes: ["Beach access", "Pier walk", "Coastal viewpoints"],
    },
    {
      id: "westin-santa-monica",
      name: "Santa Monica Pier & Beach Day",
      location: "Santa Monica",
      duration: "3 hours",
      pricePerPerson: 24,
      rating: 4.7,
      reviews: 2460,
      description:
        "Explore the iconic pier, Pacific Park, and the surrounding beachfront at your own pace.",
      includes: ["Pier access", "Beach walk", "Local guide"],
    },
    {
      id: "westin-sofi-tour",
      name: "SoFi Stadium Guided Tour",
      location: "Inglewood",
      duration: "1.5 hours",
      pricePerPerson: 55,
      rating: 4.8,
      reviews: 980,
      description:
        "Take a guided look at the stadium and its public areas; tour availability varies by event schedule.",
      includes: ["Guided stadium tour", "Public-area access", "Photo stops"],
    },
  ],
  "hyatt-regency-lax": [
    {
      id: "hyatt-marina-del-rey",
      name: "Marina del Rey Harbor Cruise",
      location: "Marina del Rey",
      duration: "1.5 hours",
      pricePerPerson: 38,
      rating: 4.7,
      reviews: 1510,
      description:
        "See the marina and coastline from the water on a narrated harbor cruise.",
      includes: ["Harbor cruise", "Coastal views", "Onboard narration"],
    },
    {
      id: "hyatt-venice-beach",
      name: "Venice Beach & Canals Walk",
      location: "Venice",
      duration: "2 hours",
      pricePerPerson: 18,
      rating: 4.6,
      reviews: 2030,
      description:
        "Walk the lively boardwalk and quieter Venice Canals with time to explore local shops.",
      includes: ["Local guide", "Boardwalk route", "Canal district"],
    },
    {
      id: "hyatt-getty-center",
      name: "Getty Center Art & Gardens",
      location: "Brentwood",
      duration: "3 hours",
      pricePerPerson: 29,
      rating: 4.9,
      reviews: 3210,
      description:
        "Explore museum galleries, architecture, and gardens with views across Los Angeles.",
      includes: ["Timed entry", "Garden access", "Audio guide"],
    },
  ],
  "hilton-lax": [
    {
      id: "hilton-hollywood-tour",
      name: "Hollywood Studio Tour",
      location: "Hollywood",
      duration: "3 hours",
      pricePerPerson: 78,
      rating: 4.8,
      reviews: 2750,
      description:
        "Go behind the scenes on a guided studio tour; sets and route depend on the day's production schedule.",
      includes: ["Studio admission", "Guided tour", "Shuttle transport"],
    },
    {
      id: "hilton-griffith-observatory",
      name: "Griffith Observatory & City Views",
      location: "Griffith Park",
      duration: "2.5 hours",
      pricePerPerson: 22,
      rating: 4.8,
      reviews: 2380,
      description:
        "Take in the observatory exhibits and sweeping views of the Los Angeles basin.",
      includes: ["Observatory visit", "Viewpoints", "Local guide"],
    },
    {
      id: "hilton-venice-bike",
      name: "Venice Beach Bike Ride",
      location: "Venice Beach",
      duration: "2 hours",
      pricePerPerson: 32,
      rating: 4.7,
      reviews: 1110,
      description:
        "Ride an easy coastal route past the boardwalk, beach, and nearby neighborhoods.",
      includes: ["Bike rental", "Helmet", "Coastal route"],
    },
  ],
  "baltimore-airport-marriott": [
    {
      id: "bwi-inner-harbor",
      name: "Baltimore Inner Harbor & Waterfront",
      location: "Inner Harbor",
      duration: "2.5 hours",
      pricePerPerson: 0,
      rating: 4.7,
      reviews: 2240,
      description:
        "Explore the harbor promenade, historic ships, and waterfront public spaces.",
      includes: ["Waterfront route", "Historic ship views", "Local map"],
    },
    {
      id: "bwi-national-aquarium",
      name: "National Aquarium Visit",
      location: "Inner Harbor",
      duration: "3 hours",
      pricePerPerson: 49,
      rating: 4.8,
      reviews: 3070,
      description:
        "Visit the aquarium's exhibits and aquatic habitats in Baltimore's Inner Harbor.",
      includes: ["Timed admission", "Exhibit access", "Harbor location"],
    },
    {
      id: "bwi-fells-point",
      name: "Fells Point Food & History Walk",
      location: "Fells Point",
      duration: "2.5 hours",
      pricePerPerson: 42,
      rating: 4.7,
      reviews: 1280,
      description:
        "Discover waterfront streets, historic architecture, and local bites in Fells Point.",
      includes: ["Local guide", "Food tastings", "Historic walk"],
    },
  ],
  "hotel-diamond": [
    {
      id: "diamond-bidwell-park",
      name: "Bidwell Park Scenic Walk",
      location: "Bidwell Park",
      duration: "2 hours",
      pricePerPerson: 0,
      rating: 4.8,
      reviews: 2140,
      description:
        "A relaxed walk through Chico's iconic park with river views, shaded trails, and easy access to nature right in the city.",
      includes: [
        "Trail access",
        "Scenic viewpoints",
        "Local nature guide",
      ],
    },
    {
      id: "diamond-downtown-chico",
      name: "Downtown Chico Food & Culture Tour",
      location: "Downtown Chico",
      duration: "3 hours",
      pricePerPerson: 38,
      rating: 4.7,
      reviews: 1310,
      description:
        "Browse local cafés, artisan stores, and historic downtown streets with a tasting-focused city tour.",
      includes: [
        "Local guide",
        "Food tastings",
        "Historic district walk",
      ],
    },
    {
      id: "diamond-riverfront",
      name: "Sacramento River Walk",
      location: "Riverfront Park",
      duration: "1.5 hours",
      pricePerPerson: 12,
      rating: 4.6,
      reviews: 980,
      description:
        "Take in river views, open-air paths, and quiet stretches of Chico's scenic waterfront.",
      includes: [
        "Riverfront access",
        "Photo stops",
        "Easy walking route",
      ],
    },
  ],
  "hotel-katerina": [
    {
      id: "katerina-creative-arts",
      name: "Chico Art Walk",
      location: "Downtown Chico",
      duration: "2.5 hours",
      pricePerPerson: 24,
      rating: 4.7,
      reviews: 1180,
      description:
        "Discover galleries, murals, and creative spaces across downtown Chico with an easy self-guided cultural route.",
      includes: [
        "Art gallery access",
        "Creative district map",
        "Local insight",
      ],
    },
    {
      id: "katerina-ceramics",
      name: "Local Wine & Tasting Experience",
      location: "Chico Valley",
      duration: "3 hours",
      pricePerPerson: 64,
      rating: 4.8,
      reviews: 1680,
      description:
        "Enjoy a relaxed tasting session with a curated mix of local wines and small-batch producers from the region.",
      includes: [
        "Wine tasting",
        "Regional pairing",
        "Expert host",
      ],
    },
    {
      id: "katerina-botanical",
      name: "Chico Botanical Gardens",
      location: "North Chico",
      duration: "2 hours",
      pricePerPerson: 18,
      rating: 4.6,
      reviews: 760,
      description:
        "Explore a peaceful garden setting with colorful blooms, shaded paths, and photo-worthy viewpoints.",
      includes: [
        "Garden access",
        "Scenic walk",
        "Entry ticket",
      ],
    },
  ],
  "residence-inn-by-marriott-chico": [
    {
      id: "residence-sierra",
      name: "Sierra Nevada Brewery Tour",
      location: "Chico",
      duration: "2 hours",
      pricePerPerson: 28,
      rating: 4.8,
      reviews: 2035,
      description:
        "A favorite Chico stop for craft beer lovers, with a guided look at one of the region's best-known breweries.",
      includes: [
        "Brewery tour",
        "Tasting flight",
        "Behind-the-scenes access",
      ],
    },
    {
      id: "residence-bmx",
      name: "Butte Creek Trail Adventure",
      location: "Butte Creek",
      duration: "2.5 hours",
      pricePerPerson: 16,
      rating: 4.5,
      reviews: 620,
      description:
        "Take a scenic outdoor outing along a local creek trail with relaxed walking and riverside views.",
      includes: [
        "Trail map",
        "Water stop",
        "Nature walk",
      ],
    },
    {
      id: "residence-roller",
      name: "Chico Farmers Market Morning",
      location: "Downtown Chico",
      duration: "1.5 hours",
      pricePerPerson: 10,
      rating: 4.7,
      reviews: 1040,
      description:
        "Start the day with local produce, handmade goods, and a casual exploration of Chico's lively market scene.",
      includes: [
        "Market entry",
        "Local vendors",
        "Breakfast stop",
      ],
    },
  ],
  "oxford-suites-chico": [
    {
      id: "oxford-family-golf",
      name: "Family Mini Golf & Arcade",
      location: "Central Chico",
      duration: "2 hours",
      pricePerPerson: 22,
      rating: 4.6,
      reviews: 910,
      description:
        "A fun activity for families looking for a low-key outing with playful energy and easy group-friendly entertainment.",
      includes: [
        "Mini golf access",
        "Arcade play",
        "Family-friendly fun",
      ],
    },
    {
      id: "oxford-picnic",
      name: "Picnic at Upper Park",
      location: "Upper Park",
      duration: "2 hours",
      pricePerPerson: 14,
      rating: 4.5,
      reviews: 680,
      description:
        "Enjoy a relaxed picnic with open lawns, shade, and easy access to nearby walking routes.",
      includes: [
        "Picnic area access",
        "Shade seating",
        "Easy family outing",
      ],
    },
    {
      id: "oxford-lake",
      name: "Lake Chico Sunset stroll",
      location: "Lake Chico",
      duration: "1.5 hours",
      pricePerPerson: 0,
      rating: 4.8,
      reviews: 2170,
      description:
        "A simple, beautiful sunset walk with lake views, nearby trails, and a relaxed Chico evening atmosphere.",
      includes: [
        "Lake access",
        "Sunset viewing",
        "Walking route",
      ],
    },
  ],
  "doubletree-by-hilton-chico": [
    {
      id: "doubletree-pool",
      name: "Poolside Relaxation & Cabana Day",
      location: "Chico Resort Area",
      duration: "3 hours",
      pricePerPerson: 30,
      rating: 4.7,
      reviews: 1040,
      description:
        "A leisurely afternoon with poolside lounging, chill music, and a resort-style reset after travel.",
      includes: [
        "Pool access",
        "Cabana seating",
        "Refreshments",
      ],
    },
    {
      id: "doubletree-historic",
      name: "Historic Downtown Chico Walk",
      location: "Historic District",
      duration: "2 hours",
      pricePerPerson: 18,
      rating: 4.6,
      reviews: 770,
      description:
        "See the city's historic core, architecture, and local spots with an easy downtown walking route.",
      includes: [
        "Walking tour",
        "Landmark stops",
        "Local history",
      ],
    },
    {
      id: "doubletree-cafe",
      name: "Coffee & Brunch Crawl",
      location: "Downtown Chico",
      duration: "2 hours",
      pricePerPerson: 26,
      rating: 4.7,
      reviews: 1120,
      description:
        "Visit local coffeehouses and brunch spots in downtown Chico for a relaxed and flavorful city experience.",
      includes: [
        "Coffee tasting",
        "Brunch stop",
        "Local recommendations",
      ],
    },
  ],
  "hampton-inn-suites-chico": [
    {
      id: "hampton-bike",
      name: "Bike Ride on Scenic Trails",
      location: "Chico Trail Network",
      duration: "2.5 hours",
      pricePerPerson: 24,
      rating: 4.7,
      reviews: 840,
      description:
        "Take a scenic ride through Chico's bike-friendly trails with a comfortable, active outing for the day.",
      includes: [
        "Bike rental",
        "Trail route",
        "Safety briefing",
      ],
    },
    {
      id: "hampton-paddle",
      name: "Riverfront Paddle Session",
      location: "Sacramento River",
      duration: "2 hours",
      pricePerPerson: 45,
      rating: 4.8,
      reviews: 1430,
      description:
        "A calm paddle outing along the river that gives travelers a good mix of scenery and active adventure.",
      includes: [
        "Paddle equipment",
        "Safety gear",
        "Guide support",
      ],
    },
    {
      id: "hampton-brewery",
      name: "Evening Patio Social",
      location: "Downtown Chico",
      duration: "2 hours",
      pricePerPerson: 32,
      rating: 4.6,
      reviews: 900,
      description:
        "An easygoing social outing with local drinks, patio seating, and a lively downtown atmosphere.",
      includes: [
        "Drink tasting",
        "Patio seating",
        "Local recommendations",
      ],
    },
  ],
  "best-western-heritage-inn-chico": [
    {
      id: "heritage-parks",
      name: "City Parks & Picnic Day",
      location: "Chico Community Parks",
      duration: "2 hours",
      pricePerPerson: 12,
      rating: 4.5,
      reviews: 640,
      description:
        "A casual outdoor escape with green space, picnic spots, and a laid-back way to enjoy Chico.",
      includes: [
        "Park access",
        "Picnic setup",
        "Walking route",
      ],
    },
    {
      id: "heritage-museum",
      name: "Local History Museum Visit",
      location: "Chico",
      duration: "1.5 hours",
      pricePerPerson: 16,
      rating: 4.6,
      reviews: 520,
      description:
        "Explore local stories and exhibits that highlight the city’s cultural and historical roots.",
      includes: [
        "Museum admission",
        "Historical exhibits",
        "Guided overview",
      ],
    },
    {
      id: "heritage-market",
      name: "Weekend Market Stroll",
      location: " Downtown Chico",
      duration: "1.5 hours",
      pricePerPerson: 8,
      rating: 4.4,
      reviews: 560,
      description:
        "Browse local vendors, handmade goods, and regional flavors in a cozy public market setting.",
      includes: [
        "Market access",
        "Local vendor browse",
        "Casual exploring",
      ],
    },
  ],
};

const allActivities = Object.entries(hotelActivities).flatMap(
  ([hotelId, hotelActivityList]) =>
    hotelActivityList.map((activity) => ({ ...activity, hotelId }))
);

export function getHotelActivities(hotelId) {
  if (!hotelId) return allActivities;
  const hotelIdString = String(hotelId);
  const matchingActivities = allActivities.filter(
    (activity) => String(activity.hotelId ?? activity.hotel_id) === hotelIdString
  );
  const globalActivities = allActivities.filter((activity) => {
    const activityHotelId = activity.hotelId ?? activity.hotel_id;
    return activityHotelId === undefined || activityHotelId === null;
  });
  const propertyActivities =
    matchingActivities.length > 0
      ? matchingActivities
      : hotelActivities[hotelIdString];

  if (propertyActivities) {
    return [...propertyActivities, ...globalActivities];
  }
  return globalActivities.length ? globalActivities : allActivities;
}

export default allActivities;