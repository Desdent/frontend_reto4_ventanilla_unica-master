export interface CreateActivityRequestStructure {
  name: string;
  extraTime: number;
  appointmentDuration: number;
  fieldId: string;
  companyId: string;
  roomIds?: string[] | null;
}
