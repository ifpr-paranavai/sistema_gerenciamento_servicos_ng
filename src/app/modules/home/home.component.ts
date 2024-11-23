// src/app/modules/home/home.component.ts
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DashboardRequest } from '../../core/requests/dashboard/dashboard.request';
import { IDashboardResponse, IServiceStats, IAppointmentStats } from '../../core/interfaces/dashboard-response.interface';
import { ToastService } from '../../core/requests/toastr/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  filterForm: FormGroup;
  chartOptions = signal<any>({
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(context.raw);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(value);
          }
        }
      }
    }
  });

  // Signals para os dados do dashboard
  dashboardData = signal<IDashboardResponse | null>(null);
  totalRevenue = computed(() => this.dashboardData()?.totalRevenue ?? 0);
  serviceStats = computed(() => this.dashboardData()?.serviceStats ?? []);
  currentAppointments = computed(() => this.dashboardData()?.currentAppointments ?? []);
  upcomingAppointments = computed(() => this.dashboardData()?.upcomingAppointments ?? []);
  
  chartData = computed(() => ({
    labels: this.serviceStats().map(s => s.serviceName),
    datasets: [{
      data: this.serviceStats().map(s => s.totalValue),
      backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726']
    }]
  }));

  constructor(
    private fb: FormBuilder,
    private dashboardRequest: DashboardRequest,
    private toastService: ToastService
  ) {
    this.filterForm = this.fb.group({
      dateRange: [null]
    });

    // Efeito para atualizar dados quando o filtro mudar
    effect(() => {
      this.loadDashboardData();
    });
  }

  ngOnInit(): void {
    this.filterForm.get('dateRange')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadDashboardData();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    try {
      const dateRange = this.filterForm.get('dateRange')?.value;
      const startDate = dateRange?.[0];
      const endDate = dateRange?.[1];

      this.dashboardRequest
        .getDashboardStats(startDate, endDate)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.dashboardData.set(data);
          },
          error: (error) => {
            console.error('Dashboard error:', error);
            this.toastService.error(
              'Erro ao carregar dados do dashboard',
              'Tente novamente mais tarde'
            );
          }
        });
    } catch (error) {
      console.error('Unexpected error:', error);
      this.toastService.error(
        'Erro inesperado',
        'Ocorreu um erro ao processar os dados'
      );
    }
  }
}