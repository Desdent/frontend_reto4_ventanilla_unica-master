export interface RoomStructure {
  id?: string;
  number: number;
  floor: number;

  counterIds?: string[];
  companyId: string;
  serviceId: string;
}
