import { chicoHotelImages } from "./chicoImages.js";

const hotel = [

  {
    id: "westin-los-angeles",

    name: "The Westin Los Angeles Airport",

    location:
      "5400 W Century Blvd, Los Angeles, CA",

    rating: 8.6,

    ratingLabel: "Excellent",

    reviewCount: 1248,

    description:
      "Hotel in Los Angeles with comfortable accommodations, convenient airport access, and easy connections to some of the city's most popular attractions.",

    longDescription:
      "Located near Los Angeles International Airport, this hotel offers a comfortable base for your trip to Los Angeles. Enjoy convenient access to the airport, spacious accommodations, dining options, and popular attractions across the city.",

    checkIn: "3:00 PM",

    checkOut: "11:00 AM",

    amenities: [
      "Outdoor pool",
      "Restaurant",
      "Bar",
      "Fitness center",
      "Free WiFi",
      "Airport shuttle",
      "Parking available",
      "24-hour front desk",
    ],

    highlights: [
      "Convenient location near Los Angeles International Airport",
      "Outdoor pool and fitness center",
      "On-site restaurant and bar",
      "Easy access to popular Los Angeles attractions",
    ],

    images: [
      "/images/hotel/image 1.jpeg",
      "/images/hotel/image 2.jpeg",
      "/images/hotel/image 3.jpeg",
      "/images/hotel/image 4.jpeg",
      "/images/hotel/image 5.jpeg",
    ],
  },


  {
    id: "hyatt-regency-lax",

    name:
      "Hyatt Regency Los Angeles International Airport",

    location:
      "6225 W Century Blvd, Los Angeles, CA",

    rating: 8.7,

    ratingLabel: "Excellent",

    reviewCount: 2184,

    description:
      "A modern Los Angeles airport hotel offering comfortable accommodations, convenient airport access, and easy connections to the city's major attractions.",

    longDescription:
      "Located close to Los Angeles International Airport, Hyatt Regency Los Angeles International Airport offers modern accommodations, convenient dining options, and easy access to the airport and surrounding Los Angeles attractions.",

    checkIn: "3:00 PM",

    checkOut: "11:00 AM",

    amenities: [
      "Outdoor pool",
      "Restaurant",
      "Bar",
      "Fitness center",
      "Free WiFi",
      "Airport shuttle",
      "Parking available",
      "24-hour front desk",
    ],

    highlights: [
      "Convenient location near Los Angeles International Airport",
      "Modern rooms and comfortable accommodations",
      "Outdoor pool and fitness facilities",
      "Easy airport and city access",
    ],

    images: [
      "/images/hotel/image 6.jpeg",
      "/images/hotel/image 2.jpeg",
      "/images/hotel/image 3.jpeg",
      "/images/hotel/image 4.jpeg",
      "/images/hotel/image 5.jpeg",
    ],
  },


  {
    id: "hilton-lax",

    name:
      "Hilton Los Angeles Airport",

    location:
      "5711 W Century Blvd, Los Angeles, CA",

    rating: 8.3,

    ratingLabel: "Very good",

    reviewCount: 3156,

    description:
      "A comfortable Los Angeles airport hotel with spacious accommodations, dining options, and convenient access to LAX and the surrounding area.",

    longDescription:
      "Hilton Los Angeles Airport provides a convenient base for travelers visiting Los Angeles. The hotel offers comfortable accommodations, dining options, fitness facilities, and convenient access to Los Angeles International Airport.",

    checkIn: "3:00 PM",

    checkOut: "11:00 AM",

    amenities: [
      "Outdoor pool",
      "Restaurant",
      "Bar",
      "Fitness center",
      "Free WiFi",
      "Airport shuttle",
      "Parking available",
      "24-hour front desk",
    ],

    highlights: [
      "Close to Los Angeles International Airport",
      "Comfortable rooms for travelers",
      "On-site dining options",
      "Pool and fitness facilities",
    ],

    images: [
      "/images/hotel/image 7.jpeg",
      "/images/hotel/image 3.jpeg",
      "/images/hotel/image 1.jpeg",
      "/images/hotel/image 4.jpeg",
      "/images/hotel/image 5.jpeg",
    ],
  },


  {
    id: "baltimore-airport-marriott",

    name: "Baltimore Airport Marriott",

    location:
      "1743 W Nursery Rd, Linthicum Heights, MD",

    rating: 8.5,

    ratingLabel: "Excellent",

    reviewCount: 1680,

    description:
      "A comfortable airport hotel near Baltimore with convenient access to Baltimore/Washington International Thurgood Marshall Airport and the surrounding area.",

    longDescription:
      "Baltimore Airport Marriott offers comfortable accommodations and convenient access to Baltimore/Washington International Thurgood Marshall Airport. The hotel provides a practical base for travelers visiting Baltimore, Washington, D.C., and the surrounding Maryland area.",

    checkIn: "3:00 PM",

    checkOut: "11:00 AM",

    amenities: [
      "Outdoor pool",
      "Restaurant",
      "Bar",
      "Fitness center",
      "Free WiFi",
      "Airport shuttle",
      "Parking available",
      "24-hour front desk",
    ],

    highlights: [
      "Convenient access to Baltimore/Washington International Airport",
      "Comfortable rooms and suites",
      "Airport shuttle service",
      "Easy access to Baltimore and surrounding attractions",
    ],

    images: [
      "/images/hotel/bwi 2 .jpeg",
      "/images/hotel/bwi 1.jpeg",
      "/images/hotel/bwi 3.jpeg",
      "/images/hotel/bwi deluxe 5.jpeg",
      "/images/hotel/bwi qween.jpeg",
    ],
  },

  {
    id: "hotel-diamond",
    name: "Hotel Diamond",
    location: "Chico, CA",
    airportCode: "CIC",
    airportName: "Chico Regional Airport",
    airportLocation: "150 Airpark Blvd, Chico, CA",
    rating: 8.6,
    ratingLabel: "Excellent",
    reviewCount: 986,
    description:
      "Comfortable Chico hotel with a range of room styles, convenient airport access, and straightforward stays for business or leisure travelers.",
    longDescription:
      "Hotel Diamond offers a practical and comfortable base for guests visiting Chico. With multiple room options, quick access to Chico Regional Airport, and a central location near the city, it is a convenient choice for short or extended stays.",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    amenities: [
      "Free WiFi",
      "Air conditioning",
      "Parking available",
      "Front desk service",
      "Flat-screen TV",
      "Coffee maker",
    ],
    highlights: [
      "Convenient access to Chico Regional Airport",
      "Multiple room styles and bed configurations",
      "Comfortable value-focused accommodations",
      "Easy base for travel and local visits",
    ],
    images: chicoHotelImages["hotel-diamond"],
  },

  {
    id: "hotel-katerina",
    name: "Hotel Káterina",
    location: "Chico, CA",
    airportCode: "CIC",
    airportName: "Chico Regional Airport",
    airportLocation: "150 Airpark Blvd, Chico, CA",
    rating: 8.4,
    ratingLabel: "Very good",
    reviewCount: 742,
    description:
      "Boutique-style Chico lodging with thoughtfully designed rooms and a relaxed, comfortable atmosphere.",
    longDescription:
      "Hotel Káterina offers boutique accommodations with a stylish feel and practical room options for travelers. The property is well suited to guests seeking a more intimate stay while staying close to Chico Regional Airport and the city core.",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    amenities: [
      "Free WiFi",
      "Private balconies in select rooms",
      "Air conditioning",
      "Parking available",
      "Flat-screen TV",
      "Coffee maker",
    ],
    highlights: [
      "Boutique accommodations with premium room options",
      "Balcony upgrades available",
      "Comfortable rooms and flexible layouts",
      "Close to airport and local attractions",
    ],
    images: chicoHotelImages["hotel-katerina"],
  },

  {
    id: "residence-inn-by-marriott-chico",
    name: "Residence Inn by Marriott Chico",
    location: "Chico, CA",
    airportCode: "CIC",
    airportName: "Chico Regional Airport",
    airportLocation: "150 Airpark Blvd, Chico, CA",
    rating: 8.8,
    ratingLabel: "Excellent",
    reviewCount: 1336,
    description:
      "Extended-stay apartment-style lodging with spacious suites and practical amenities for longer visits.",
    longDescription:
      "Residence Inn by Marriott Chico offers functional suite accommodations with room to stretch out and relax. Ideal for longer stays, the property combines home-like conveniences with easy access to Chico Regional Airport and local destinations.",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    amenities: [
      "Free WiFi",
      "Suite accommodations",
      "Kitchenette or full kitchen in select rooms",
      "Parking available",
      "Breakfast option",
      "Work desk",
    ],
    highlights: [
      "Spacious suite layouts",
      "Good option for longer stays",
      "Apartment-style comfort",
      "Convenient airport access",
    ],
    images: chicoHotelImages["residence-inn-by-marriott-chico"],
  },

  {
    id: "oxford-suites-chico",
    name: "Oxford Suites Chico",
    location: "Chico, CA",
    airportCode: "CIC",
    airportName: "Chico Regional Airport",
    airportLocation: "150 Airpark Blvd, Chico, CA",
    rating: 8.5,
    ratingLabel: "Excellent",
    reviewCount: 892,
    description:
      "Comfortable Chico suites designed for quick airport access and relaxed family stays.",
    longDescription:
      "Oxford Suites Chico combines practical room layouts, family-friendly accommodations, and quick access to Chico Regional Airport. The property is a strong fit for travelers who want a comfortable and affordable base in the Chico area.",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    amenities: [
      "Free WiFi",
      "Air conditioning",
      "Parking available",
      "Flat-screen TV",
      "Coffee maker",
      "Family-friendly layouts",
    ],
    highlights: [
      "Good family-oriented room layouts",
      "Value-friendly pricing options",
      "Comfortable and practical design",
      "Easy airport access",
    ],
    images: chicoHotelImages["oxford-suites-chico"],
  },

  {
    id: "doubletree-by-hilton-chico",
    name: "DoubleTree by Hilton Chico",
    location: "Chico, CA",
    airportCode: "CIC",
    airportName: "Chico Regional Airport",
    airportLocation: "150 Airpark Blvd, Chico, CA",
    rating: 8.4,
    ratingLabel: "Very good",
    reviewCount: 1175,
    description:
      "Reliable Chico stay with flexible room choices, pool views, and a comfortable hotel experience near the airport.",
    longDescription:
      "DoubleTree by Hilton Chico offers dependable lodging with comfortable rooms, varied bed configurations, and attractive pool-view options. It is a convenient choice for guests seeking a polished stay near Chico Regional Airport.",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    amenities: [
      "Free WiFi",
      "Outdoor pool",
      "Parking available",
      "Air conditioning",
      "Coffee maker",
      "Front desk service",
    ],
    highlights: [
      "Pool view rooms available",
      "Popular choice for reliable value",
      "Comfortable room options",
      "Near Chico Regional Airport",
    ],
    images: chicoHotelImages["doubletree-by-hilton-chico"],
  },

  {
    id: "hampton-inn-suites-chico",
    name: "Hampton Inn & Suites Chico",
    location: "Chico, CA",
    airportCode: "CIC",
    airportName: "Chico Regional Airport",
    airportLocation: "150 Airpark Blvd, Chico, CA",
    rating: 8.7,
    ratingLabel: "Excellent",
    reviewCount: 1034,
    description:
      "Modern, family-friendly Chico hotel with practical rooms and helpful amenities for short or extended stays.",
    longDescription:
      "Hampton Inn & Suites Chico provides a dependable stay with comfortable room selections and helpful amenities. Its convenient location near Chico Regional Airport makes it a strong option for business travelers and families alike.",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    amenities: [
      "Free WiFi",
      "Outdoor pool",
      "Parking available",
      "Breakfast service",
      "Air conditioning",
      "Coffee maker",
    ],
    highlights: [
      "Comfortable family-friendly rooms",
      "Breakfast included on select stays",
      "Convenient access to Chico airport",
      "Reliable, modern accommodations",
    ],
    images: chicoHotelImages["hampton-inn-suites-chico"],
  },

  {
    id: "best-western-heritage-inn-chico",
    name: "Best Western Heritage Inn - Chico",
    location: "Chico, CA",
    airportCode: "CIC",
    airportName: "Chico Regional Airport",
    airportLocation: "150 Airpark Blvd, Chico, CA",
    rating: 8.2,
    ratingLabel: "Very good",
    reviewCount: 774,
    description:
      "Value-minded Chico accommodations with flexible room layouts and easy access to the airport and nearby city conveniences.",
    longDescription:
      "Best Western Heritage Inn - Chico delivers practical lodging with a range of room types and convenient access to Chico Regional Airport. It is a dependable option for those prioritizing comfort, value, and straightforward travel logistics.",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    amenities: [
      "Free WiFi",
      "Air conditioning",
      "Parking available",
      "Front desk service",
      "Flat-screen TV",
      "Coffee maker",
    ],
    highlights: [
      "Budget-friendly choices",
      "Flexible room layouts",
      "Convenient airport proximity",
      "Strong value for Chico stays",
    ],
    images: chicoHotelImages["best-western-heritage-inn-chico"],
  },

];


export default hotel;