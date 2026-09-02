
const rooms = [

  /*
   * =========================================================
   * LOS ANGELES HOTELS
   * =========================================================
   */

  {
    id: "la-deluxe-king",
    hotelId: "westin-los-angeles",

    name: "Deluxe King Room",
    beds: "1 King Bed",
    guests: "Sleeps 2",
    pricePerNight: 185,

    amenities: [
      "Free WiFi",
      "Smart TV",
      "Mini Fridge",
      "Coffee Maker",
    ],

    images: [
      "/images/hotel/deluxe room 1.jpeg",
      "/images/hotel/deluxe room 2.jpeg",
      "/images/hotel/deluxe room 3.jpeg",
      "/images/hotel/deluxe room 4.jpeg",
      "/images/hotel/deluxe room 5.jpeg",
    ],
  },

  {
    id: "la-two-queen",
    hotelId: "westin-los-angeles",

    name: "Two Queen Beds",
    beds: "2 Queen Beds",
    guests: "Sleeps 4",
    pricePerNight: 210,

    amenities: [
      "Free WiFi",
      "Smart TV",
      "Mini Fridge",
      "Coffee Maker",
      "Work Desk",
    ],

    images: [
      "/images/hotel/queen room 1.jpeg",
      "/images/hotel/queen room 2.jpeg",
      "/images/hotel/queen room 3.jpeg",
      "/images/hotel/queen room 4.jpeg",
      "/images/hotel/queen room 5.jpeg",
    ],
  },

  {
    id: "la-premium-king",
    hotelId: "westin-los-angeles",

    name: "Premium King Room",
    beds: "1 King Bed",
    guests: "Sleeps 2",
    pricePerNight: 245,

    amenities: [
      "Free WiFi",
      "Smart TV",
      "Mini Fridge",
      "Coffee Maker",
      "Work Desk",
      "City View",
    ],

    images: [
      "/images/hotel/king room 1.jpeg",
      "/images/hotel/king room 2.jpeg",
      "/images/hotel/king room 3.jpeg",
      "/images/hotel/king room 4.jpeg",
      "/images/hotel/king room 5.jpeg",
    ],
  },

  {
    id: "la-one-bedroom-suite",
    hotelId: "westin-los-angeles",

    name: "One Bedroom Suite",
    beds: "1 King Bed + Sofa Bed",
    guests: "Sleeps 4",
    pricePerNight: 310,

    amenities: [
      "Free WiFi",
      "Smart TV",
      "Mini Fridge",
      "Coffee Maker",
      "Work Desk",
      "City View",
      "Separate Living Area",
    ],

    images: [
      "/images/hotel/image 1.jpeg",
      "/images/hotel/image 2.jpeg",
      "/images/hotel/image 3.jpeg",
      "/images/hotel/image 4.jpeg",
      "/images/hotel/image 5.jpeg",
    ],
  },


  /*
   * =========================================================
   * HYATT REGENCY LAX
   * =========================================================
   */

  {
    id: "hyatt-deluxe-king",
    hotelId: "hyatt-regency-lax",

    name: "Deluxe King Room",
    beds: "1 King Bed",
    guests: "Sleeps 2",
    pricePerNight: 195,

    amenities: [
      "Free WiFi",
      "Smart TV",
      "Mini Fridge",
      "Coffee Maker",
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
    id: "hyatt-two-queen",
    hotelId: "hyatt-regency-lax",

    name: "Two Queen Beds",
    beds: "2 Queen Beds",
    guests: "Sleeps 4",
    pricePerNight: 220,

    amenities: [
      "Free WiFi",
      "Smart TV",
      "Mini Fridge",
      "Coffee Maker",
      "Work Desk",
    ],

    images: [
      "/images/hotel/queen room 1.jpeg",
      "/images/hotel/queen room 2.jpeg",
      "/images/hotel/queen room 3.jpeg",
      "/images/hotel/queen room 4.jpeg",
      "/images/hotel/queen room 5.jpeg",
    ],
  },

  {
    id: "hyatt-premium-king",
    hotelId: "hyatt-regency-lax",

    name: "Premium King Room",
    beds: "1 King Bed",
    guests: "Sleeps 2",
    pricePerNight: 255,

    amenities: [
      "Free WiFi",
      "Smart TV",
      "Mini Fridge",
      "Coffee Maker",
      "Work Desk",
      "City View",
    ],

    images: [
      "/images/hotel/king room 1.jpeg",
      "/images/hotel/king room 2.jpeg",
      "/images/hotel/king room 3.jpeg",
      "/images/hotel/king room 4.jpeg",
      "/images/hotel/king room 5.jpeg",
    ],
  },

  {
    id: "hyatt-suite",
    hotelId: "hyatt-regency-lax",

    name: "One Bedroom Suite",
    beds: "1 King Bed + Sofa Bed",
    guests: "Sleeps 4",
    pricePerNight: 320,

    amenities: [
      "Free WiFi",
      "Smart TV",
      "Mini Fridge",
      "Coffee Maker",
      "Work Desk",
      "City View",
      "Separate Living Area",
    ],

    images: [
      "/images/hotel/image 1.jpeg",
      "/images/hotel/image 2.jpeg",
      "/images/hotel/image 3.jpeg",
      "/images/hotel/image 4.jpeg",
      "/images/hotel/image 5.jpeg",
    ],
  },


  /*
   * =========================================================
   * HILTON LAX
   * =========================================================
   */

  {
    id: "hilton-deluxe-king",
    hotelId: "hilton-lax",

    name: "Deluxe King Room",
    beds: "1 King Bed",
    guests: "Sleeps 2",
    pricePerNight: 175,

    amenities: [
      "Free WiFi",
      "Smart TV",
      "Mini Fridge",
      "Coffee Maker",
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
    id: "hilton-two-queen",
    hotelId: "hilton-lax",

    name: "Two Queen Beds",
    beds: "2 Queen Beds",
    guests: "Sleeps 4",
    pricePerNight: 200,

    amenities: [
      "Free WiFi",
      "Smart TV",
      "Mini Fridge",
      "Coffee Maker",
      "Work Desk",
    ],

    images: [
      "/images/hotel/queen room 1.jpeg",
      "/images/hotel/queen room 2.jpeg",
      "/images/hotel/queen room 3.jpeg",
      "/images/hotel/queen room 4.jpeg",
      "/images/hotel/queen room 5.jpeg",
    ],
  },

  {
    id: "hilton-premium-king",
    hotelId: "hilton-lax",

    name: "Premium King Room",
    beds: "1 King Bed",
    guests: "Sleeps 2",
    pricePerNight: 235,

    amenities: [
      "Free WiFi",
      "Smart TV",
      "Mini Fridge",
      "Coffee Maker",
      "Work Desk",
      "City View",
    ],

    images: [
      "/images/hotel/king room 1.jpeg",
      "/images/hotel/king room 2.jpeg",
      "/images/hotel/king room 3.jpeg",
      "/images/hotel/king room 4.jpeg",
      "/images/hotel/king room 5.jpeg",
    ],
  },

  {
    id: "hilton-suite",
    hotelId: "hilton-lax",

    name: "One Bedroom Suite",
    beds: "1 King Bed + Sofa Bed",
    guests: "Sleeps 4",
    pricePerNight: 300,

    amenities: [
      "Free WiFi",
      "Smart TV",
      "Mini Fridge",
      "Coffee Maker",
      "Work Desk",
      "City View",
      "Separate Living Area",
    ],

    images: [
      "/images/hotel/image 1.jpeg",
      "/images/hotel/image 2.jpeg",
      "/images/hotel/image 3.jpeg",
      "/images/hotel/image 4.jpeg",
      "/images/hotel/image 5.jpeg",
    ],
  },


  /*
   * =========================================================
   * BALTIMORE AIRPORT MARRIOTT
   * =========================================================
   */

  {
    id: "bwi-standard-king",
    hotelId: "baltimore-airport-marriott",

    name: "Standard King Room",
    beds: "1 King Bed",
    guests: "Sleeps 2",
    pricePerNight: 138,

    amenities: [
      "Free WiFi",
      "Smart TV",
      "Mini Fridge",
      "Coffee Maker",
    ],

    images: [
      "/images/hotel/bwi standard  1.jpeg",
      "/images/hotel/bwi standard 2.jpeg",
      "/images/hotel/bwi standard 3.jpeg",
      "/images/hotel/bwi standard 4.jpeg",
      "/images/hotel/bwi standard 5.jpeg",
    ],
  },

  {
    id: "bwi-two-queen",
    hotelId: "baltimore-airport-marriott",

    name: "Two Queen Beds",
    beds: "2 Queen Beds",
    guests: "Sleeps 4",
    pricePerNight: 155,

    amenities: [
      "Free WiFi",
      "Smart TV",
      "Mini Fridge",
      "Coffee Maker",
      "Work Desk",
    ],

    images: [
      "/images/hotel/bwi qween.jpeg",
      "/images/hotel/bwi qween 2.jpeg",
      "/images/hotel/bwi qween 3.jpeg",
      "/images/hotel/bwi qween 4.jpeg",
      "/images/hotel/bwi qween 5.jpeg",
    ],
  },

  {
    id: "bwi-deluxe-king",
    hotelId: "baltimore-airport-marriott",

    name: "Deluxe King Room",
    beds: "1 King Bed",
    guests: "Sleeps 2",
    pricePerNight: 185,

    amenities: [
      "Free WiFi",
      "Smart TV",
      "Mini Fridge",
      "Coffee Maker",
      "Work Desk",
    ],

    images: [
      "/images/hotel/bwi delixe.jpeg",
      "/images/hotel/bwi deluxe 2.jpeg",
      "/images/hotel/bwi deluxe 3.jpeg",
      "/images/hotel/bwi deluxe 4.jpeg",
      "/images/hotel/bwi deluxe 5.jpeg",
    ],
  },

  {
    id: "bwi-suite",
    hotelId: "baltimore-airport-marriott",

    name: "One Bedroom Suite",
    beds: "1 King Bed + Sofa Bed",
    guests: "Sleeps 4",
    pricePerNight: 240,

    amenities: [
      "Free WiFi",
      "Smart TV",
      "Mini Fridge",
      "Coffee Maker",
      "Work Desk",
      "Separate Living Area",
    ],

    images: [
      "/images/hotel/bwi one bed copy.jpeg",
      "/images/hotel/bwi one bed 2 copy.jpeg",
      "/images/hotel/bwi one bed 3 copy.jpeg",
      "/images/hotel/bwi one bed 4 copy.jpeg",
      "/images/hotel/bwi one bed 5 copy.jpeg",
    ],
  },

];

export default rooms;
