import { AppointmentStatus } from '../../enums/appointment-status';

export interface WorkerUpdateAppointmentStructure {
  status: AppointmentStatus;
  notes?: string;
}
