import { Floor } from '../../enums/Floor.enum';

export interface ActivityResponseStructure {
  id: string;
  name: string;
  fieldName: string;
  fieldId: string;
  companyName: string;
  floors: Floor[];
  rooms?: number[];
  extraTime: number;
  appointmentDuration: number;
}
