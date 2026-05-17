import { AppointmentStatus } from '../../enums/appointment-status';
import { WorkerUpdateAppointmentStructure } from '../../interfaces/appointment/worker-update-appointment-request-structure.interface';

export class WorkerUpdateAppointment {
  status: AppointmentStatus;
  notes?: string;

  constructor(data: WorkerUpdateAppointmentStructure) {
    this.status = data.status;
    this.notes = data.notes;
  }
}
