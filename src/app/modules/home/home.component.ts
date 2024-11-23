import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { count, Subject, takeUntil } from 'rxjs';
import { DashboardRequest } from '../../core/requests/dashboard/dashboard.request';
import { IDashboardResponse, IServiceMonthlyData, IServiceStats } from '../../core/interfaces/dashboard-response.interface';
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
        private toastService: ToastService
    ) {
        this.filterForm = this.fb.group({
            dateRange: [null]
        });

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

    private generateColors(count: number): string[] {
        

        return Array(count).fill(0).map((_, i) => {
            const hue = Math.floor(Math.random() * 360);
            const saturation = Math.floor(Math.random() * 100);
            const lightness = Math.floor(Math.random() * 50) + 50;
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        });
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
                            error.error.detail || 'Erro inesperado',
                            'Ocorreu um erro ao carregar os dados do dashboard'
                        )
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