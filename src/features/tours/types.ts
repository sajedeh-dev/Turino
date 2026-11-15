export type Vehicle = "bus" | "train" | "airplane" | "ship" | "suv" | "other";

export interface Place {
  id: string;
  /** Display name in Persian when known, otherwise as the API sent it. */
  name: string;
}

/** A tour as the UI uses it. Built from the API's TourDto by `toTour()`. */
export interface Tour {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  origin: Place;
  destination: Place;
  /** ISO date-times. */
  startDate: string;
  endDate: string;
  /** Price per person, in toman. */
  price: number;
  capacity: number;
  availableSeats: number;
  vehicle: Vehicle;
  insurance: boolean;
  options: string[];
}

export type TourFilters = {
  destinationId?: string;
  originId?: string;
  startDate?: string;
  endDate?: string;
};
