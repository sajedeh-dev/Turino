/**
 * Shapes exactly as the backend returns them (GET /tour, GET /tour/:id).
 * Nothing outside src/features/tours reads these; pages use the mapped `Tour`.
 */
export interface PlaceDto {
  id: string;
  /** English name, e.g. "Tehran". */
  name: string;
}

export interface TourDto {
  id: string;
  title: string;
  origin: PlaceDto;
  destination: PlaceDto;
  /** ISO date-time, e.g. "2025-10-01T00:00:00.000Z". */
  startDate: string;
  endDate: string;
  /** e.g. "bus", "airplane", "SUV". */
  fleetVehicle: string;
  price: number;
  availableSeats: number;
  capacity: number;
  insurance: boolean;
  options: string[];
  /** Absolute URL served by the backend. */
  image: string;
}

/** Query parameters accepted by GET /tour. */
export interface TourQueryDto {
  destinationId?: string;
  originId?: string;
  /** ISO date, e.g. "2026-01-10". */
  startDate?: string;
  endDate?: string;
}
