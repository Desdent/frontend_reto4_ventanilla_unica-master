export interface AdminViewWorkerStructure {
  id?: string;
  email: string;
  name: string;
  surname1: string;
  dni: string;
  surname2?: string;
  address?: string;
  phone?: string;
  vacationIds?: string[];
  counterNumber?: number;
  counterId?: string;
  roomNumber?: number;
  roomId?: string;
  service: string;
}
