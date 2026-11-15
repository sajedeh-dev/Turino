import type { PlaceDto, TourDto } from "./dto";
import { toPersianPlaceName } from "./place-names";
import type { Place, Tour, Vehicle } from "./types";

const knownVehicles: Vehicle[] = ["bus", "train", "airplane", "ship", "suv"];

function toVehicle(fleetVehicle: string): Vehicle {
  const value = fleetVehicle.trim().toLowerCase() as Vehicle;
  return knownVehicles.includes(value) ? value : "other";
}

function toPlace(dto: PlaceDto): Place {
  return { id: dto.id, name: toPersianPlaceName(dto.name) };
}

/** Turns the backend's TourDto into the Tour the UI renders. */
export function toTour(dto: TourDto): Tour {
  const destination = toPlace(dto.destination);

  return {
    id: dto.id,
    title: dto.title,
    image: dto.image,
    imageAlt: `تصویر ${dto.title}، ${destination.name}`,
    origin: toPlace(dto.origin),
    destination,
    startDate: dto.startDate,
    endDate: dto.endDate,
    price: dto.price,
    capacity: dto.capacity,
    availableSeats: dto.availableSeats,
    vehicle: toVehicle(dto.fleetVehicle),
    insurance: dto.insurance,
    options: dto.options,
  };
}
