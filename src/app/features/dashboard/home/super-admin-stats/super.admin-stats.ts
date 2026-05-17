import { AfterViewInit, Component, Input, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Payload } from '../../../../core/interfaces/payload/payload-structure.interface';
import { UserService } from '../../../../core/services/users/users.service';
import { CompanyService } from '../../../../core/services/company/company.service';
import { Roles } from '../../../../core/enums/role.enum';
import { ActivityService } from '../../../../core/services/activity/activity.service';
import { AppointmentResponseDto } from '../../../../core/dto/appointment/appointment-response.dto';
import { AppointmentService } from '../../../../core/services/appointment/appointment.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-super-admin-stats',
  imports: [],
  templateUrl: './super-admin-stats.html',
  styleUrl: './super-admin-stats.css',
})
export class SuperAdminStats implements AfterViewInit {
  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private activityService: ActivityService,
    private appointmentService: AppointmentService,
  ) {}

  @Input() tokenSend!: string;
  payload = signal<Payload | null>(null);
  id = signal<string>('');
  companyId = signal<string | undefined>('');
  role = signal<string>('');

  countUsers = signal<number>(0);
  countCompanies = signal<number>(0);
  countActivities = signal<number>(0);
  appointments = signal<AppointmentResponseDto[]>([]);
  appointmentsPerMonth = signal<number[]>(Array(12).fill(0));

  chart!: Chart;

  ngOnInit() {
    if (this.tokenSend) {
      this.payload.set(jwtDecode(this.tokenSend!));
      this.id.set(this.payload()?.userId!);
      this.companyId.set(this.payload()?.companyId);
      this.role.set(this.payload()?.role!);

      this.loadData();
    }
  }

  loadData() {
    this.userService.getAll().subscribe({
      next: (resp) => {
        console.log(resp);
        this.countUsers.set(resp.data?.length ?? 0);
      },
    });

    this.companyService.findAllPaginated(1, 3, 'asc', 'cif').subscribe({
      next: (resp) => {
        this.countCompanies.set(resp.data?.total ?? 0);
      },
    });

    this.activityService.getAll().subscribe({
      next: (resp) => {
        console.log(resp.data);
        this.countActivities.set(resp.data?.length ?? 0);
      },
    });

    this.appointmentService.findAll().subscribe({
      next: (resp) => {
        this.appointments.set(resp.data ?? []);

        const months = Array(12).fill(0);

        this.appointments().forEach((appointment) => {
          const date = new Date(appointment.date);
          const month = date.getMonth();
          months[month]++;
        });

        this.appointmentsPerMonth.set(months);

        this.updateChart();
      },
    });
  }

  ngAfterViewInit(): void {
    const ctx = document.getElementById('appointmentsChart') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'bar',

      data: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dic',
        ],

        datasets: [
          {
            label: 'Appointments',
            data: this.appointmentsPerMonth(),
            backgroundColor: '#e75b44',
          },
        ],
      },
    });
  }

  updateChart() {
    if (!this.chart) return;

    this.chart.data.datasets[0].data = this.appointmentsPerMonth();
    this.chart.update();
  }
}
