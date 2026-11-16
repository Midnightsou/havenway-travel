const hotelIds = [
  "hotel-diamond",
  "hotel-katerina",
  "residence-inn-by-marriott-chico",
  "oxford-suites-chico",
  "doubletree-by-hilton-chico",
  "hampton-inn-suites-chico",
  "best-western-heritage-inn-chico",
];

const roomIds = [
  "diamond-standard-queen",
  "diamond-premium-king",
  "diamond-standard-king",
  "diamond-two-full-beds",
  "diamond-premium-suite",
  "diamond-deluxe-studio-suite",
  "katerina-boutique-king",
  "katerina-boutique-balcony",
  "katerina-boutique-queen",
  "katerina-deluxe-room",
  "residence-inn-suite-1-bedroom",
  "residence-inn-suite-2-bedroom",
  "oxford-suite-sleeper-sofa",
  "oxford-executive-suite-sleeper-sofa",
  "oxford-two-room-family-suite",
  "doubletree-room-1-king",
  "doubletree-room-king-pool-view",
  "doubletree-room-2-queen",
  "doubletree-room-queen-pool-view",
  "doubletree-2-queen-beds",
  "hampton-room-2-queen",
  "hampton-queen-120",
  "hampton-studio-suite",
  "heritage-standard-2-queen",
  "heritage-standard-king",
  "heritage-standard-2-room-beds",
  "heritage-queen-beds",
  "heritage-multiple-beds",
];

const hotelPhotoIds = [
  [34496715, 14750394, 28054852, 34496706],
  [34496701, 18801062, 14022458, 39526231],
  [36916378, 28011238, 4493299, 34040619],
  [5860693, 32021575, 20276961, 36852537],
  [39894364, 7746080, 3688261, 30898458],
  [39894363, 27638174, 28347473, 40665020],
  [7745929, 36162677, 37734643, 32988208],
];

const roomMainPhotoIds = [
  39894350, 34496702, 14750392, 14021918, 32389432, 26859049, 34733780,
  33400871, 31767049, 164595, 7031731, 33613748, 36852547, 32334231,
  17831034, 31146633, 10415975, 14021932, 35857662, 39333409, 14021928,
  5774037, 2725675, 31728412, 4887696, 38183822, 33105840, 36285704,
];

const roomSupportPhotoIds = [
  775219, 3659681, 4890676, 7258034, 7722164, 7746082, 8081396, 11857305,
  28962539, 29702285, 33389169, 33613728, 34538765, 36767624, 36816426,
  37098094, 37526146, 37734659, 37748241, 37964089, 38422116, 38683453,
  39447847, 39894345, 39894351, 39894353, 39894362, 39894371,
];

const roomPhotoIds = roomMainPhotoIds.map((photoId, index) => [
  photoId,
  roomSupportPhotoIds[index],
]);

const photoUrl = (photoId) =>
  `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

export const chicoHotelImages = Object.fromEntries(
  hotelIds.map((id, index) => [
    id,
    hotelPhotoIds[index].map(photoUrl),
  ])
);

export const chicoRoomImages = Object.fromEntries(
  roomIds.map((id, index) => [
    id,
    roomPhotoIds[index].map(photoUrl),
  ])
);
