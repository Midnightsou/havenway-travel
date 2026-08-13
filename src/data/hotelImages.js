import rooms from "./rooms";

const hotelImages = rooms.flatMap((room) =>
  room.images.map((image, index) => ({
    id: `${room.id}-${index + 1}`,

    category: room.name,

    roomId: room.id,

    alt: `${room.name} - Photo ${index + 1}`,

    image,
  }))
);

export default hotelImages;