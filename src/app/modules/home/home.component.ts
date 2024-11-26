import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, WritableSignal, computed, effect, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DashboardRequest } from '../../core/requests/dashboard/dashboard.request';
import { IDashboardResponse, IServiceMonthlyData } from '../../core/interfaces/dashboard-response.interface';
import { ToastService } from '../../core/requests/toastr/toast.service';
import { formatDistance, isBefore, isWithinInterval, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FrontPermissionsConstants } from '../../core/constants/front-permissions.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateUtil } from '../../core/utils/date.util';

interface IFilterFormFg {
    dateRange: FormControl<Date[] | null>;
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
    public userPermissions: WritableSignal<string[]> = signal([]);
    frontPermissions = FrontPermissionsConstants;

    now = new Date();
    filterForm: FormGroup<IFilterFormFg> = new FormGroup({
        dateRange: new FormControl<Date[] | null>(null)
    });
    currentView: 'chart' | 'table' = 'chart';

    viewOptions = [
        { label: 'Gráfico', value: 'chart', icon: 'pi pi-chart-bar' },
        { label: 'Tabela', value: 'table', icon: 'pi pi-table' }
    ];

    chartOptions = signal<any>({
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        return `${context.dataset.label}: ${new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(context.raw)}`;
                    }
                }
            }
        },
        layout: {
            padding: 20,
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
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    });

    dashboardData = signal<IDashboardResponse | null>(null);
    totalRevenue = computed(() => this.dashboardData()?.totalRevenue ?? 0);
    serviceStats = computed(() => this.dashboardData()?.serviceStats ?? []);
    currentAppointments = computed(() => this.dashboardData()?.currentAppointments ?? []);
    upcomingAppointments = computed(() => this.dashboardData()?.upcomingAppointments ?? []);

    chartData = computed(() => {
        const monthlyData = this.processServiceData();
        const months = this.getMonthsInRange();
        const services = Object.keys(monthlyData);
        const colors = this.generateColors(services.length);

        return {
            labels: months.map(date => this.formatMonth(date)),
            datasets: services.map((service, index) => ({
                label: service,
                data: months.map(month =>
                    monthlyData[service]?.[this.formatMonth(month)] || 0
                ),
                backgroundColor: colors[index]
            }))
        };
    });

    private processServiceData(): IServiceMonthlyData {
        const monthlyData: IServiceMonthlyData = {};

        this.serviceStats().forEach(stat => {
            // Inicializa o objeto para o serviço se não existir
            if (!monthlyData[stat.serviceName]) {
                monthlyData[stat.serviceName] = {};
            }

            // Formata o mês
            const month = new Date(stat.date).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'short'
            });

            // Acumula o valor para o serviço naquele mês
            monthlyData[stat.serviceName][month] =
                (monthlyData[stat.serviceName][month] || 0) + stat.totalValue;
        });

        return monthlyData;
    }

    private getMonthsInRange(): Date[] {
        const dateRange = this.filterForm.get('dateRange')?.value;
        const startDate = dateRange?.[0] || this.getDefaultStartDate();
        const endDate = dateRange?.[1] || new Date();
        const months: Date[] = [];

        let currentDate = new Date(startDate);
        currentDate.setDate(1); // Primeiro dia do mês

        while (currentDate <= endDate) {
            months.push(new Date(currentDate));
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return months;
    }

    private getDefaultStartDate(): Date {
        const date = new Date();
        date.setMonth(date.getMonth() - 5); // últimos 6 meses por padrão
        return date;
    }

    private formatMonth(date: Date): string {
        return date.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'short'
        });
    }

    constructor(
        private fb: FormBuilder,
        private dashboardRequest: DashboardRequest,
        private toastService: ToastService,
        private destroyRef: DestroyRef,
    ) {
        effect(() => {
            this.loadDashboardData();
        });
    }

    ngOnInit(): void {
        this.filterForm.controls.dateRange.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.loadDashboardData();
            });
    }

    private generateColors(count: number): string[] {
        return Array(count).fill(0).map((_, i) => {
            const hue = Math.floor(Math.random() * 360);
            const saturation = Math.floor(Math.random() * 100);
            const lightness = Math.floor(Math.random() * 50) + 50;
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        });
    }

    private loadDashboardData(): void {
        const dateRange = this.filterForm.controls.dateRange.value;
        const startDate = dateRange?.[0] || this.getDefaultStartDate();
        const endDate = dateRange?.[1] || new Date();

        const formattedStartDate = DateUtil.formatDateToISO(startDate);
        const formattedEndDate = DateUtil.formatDateToISO(endDate);

        this.dashboardRequest
            .getDashboardStats(formattedStartDate, formattedEndDate)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (data) => {
                    this.dashboardData.set(data);
                },
                error: (error) => {
                    console.error('Dashboard error:', error);
                    this.toastService.error(
                        error.error.detail || 'Erro inesperado',
                        'Ocorreu um erro ao carregar os dados do dashboard'
                    )
                }
            });
    }

    getAppointmentSeverity(appointment: any): 'success' | 'warning' | 'error' {
        const appointmentDate = new Date(appointment.appointment_date);
        const oneDayBefore = addDays(appointmentDate, -1);
        const now = this.now;

        if (isBefore(appointmentDate, now)) {
            return 'error';
        }

        if (isWithinInterval(now, {
            start: oneDayBefore,
            end: appointmentDate
        })) {
            return 'warning';
        }

        return 'success';
    }

    formatAppointmentDate(date: string | Date): string {
        const appointmentDate = new Date(date);
        return appointmentDate.toLocaleString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getTimeStatus(date: string | Date): string {
        const appointmentDate = new Date(date);
        const now = this.now;

        if (isBefore(appointmentDate, now)) {
            return `Atrasado por ${formatDistance(appointmentDate, now, {
                locale: ptBR,
                addSuffix: false
            })}`;
        }

        return `Em ${formatDistance(now, appointmentDate, {
            locale: ptBR,
            addSuffix: false
        })}`;
    }

    getAppointmentValue(appointment: any): number {
        return appointment.services?.reduce((total: number, service: any) =>
            total + (service.cost || 0), 0) || 0;
    }

    getAppointmentCardClass(appointment: any): string {
        const baseClass = 'appointment-card';
        const severity = this.getAppointmentSeverity(appointment);
        return `${baseClass} ${severity}-card`;
    }

    getStatusClass(appointment: any): string {
        const severity = this.getAppointmentSeverity(appointment);
        return severity === 'error' ? 'text-red-500' :
            severity === 'warning' ? 'text-yellow-500' :
                'text-green-500';
    }
}
