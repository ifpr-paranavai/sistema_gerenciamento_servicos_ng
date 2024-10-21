import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, WritableSignal, signal } from "@angular/core";

import { ServiceService } from "../../../core/services/services_offer/service.service";
import { ServiceResponse } from "../../../core/interfaces/service-response.interface";

interface Column {
    field: string;
    header: string;
    type?: string;
}

@Component({
    selector: "sgs-services-list",
    templateUrl: "./services-list.component.html",
    styleUrls: ["./services-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesListComponent implements OnInit {
    services: ServiceResponse[] = [];

    cols: Column[] = [
        { field: 'name', header: 'Nome' },
        { field: 'description', header: 'Descrição' },
        { field: 'cost', header: 'Valor', type: 'currency' },
        { field: 'duration', header: 'Duração', type: 'time' },
        { field: 'ratting_avg', header: 'Avaliação', type: 'rating' },
    ];

    constructor(
        private serviceService: ServiceService,
        private cdr: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.loadServices();
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'success';
        }
    }

    loadServices() {
        this.serviceService.getServices().subscribe({
            next: (services: ServiceResponse[]) => {
                this.services = services;
                console.log('Serviços carregados:', this.services);
                this.cdr.detectChanges();
            },
            error: (error: Error) => {
                console.error('Erro ao carregar serviços:', error);
            }
        });
    }
    editService(service: ServiceResponse) {
        // Implement edit logic
        console.log('Edit service:', service);
    }

    deleteService(service: ServiceResponse) {
        // Implement delete logic
        console.log('Delete service:', service);
    }
}
