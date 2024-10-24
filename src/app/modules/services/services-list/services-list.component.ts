import { ChangeDetectionStrategy, Component, OnInit, WritableSignal, signal } from "@angular/core";

import { ServiceService } from "../../../core/services/services_offer/service.service";
import { ServiceResponse } from "../../../core/interfaces/service-response.interface";
import { catchError, of, take } from "rxjs";
import { ITableColumn } from "../../../core/interfaces/table-columns.interface";
import { ServicesCols } from "../../../core/constants/services.constants";
import { ToastService } from "../../../core/services/toastr/toast.service";

@Component({
    selector: "sgs-services-list",
    templateUrl: "./services-list.component.html",
    styleUrls: ["./services-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesListComponent implements OnInit {
    services: WritableSignal<ServiceResponse[]> = signal([]);
    servicesColumns: ITableColumn[] = ServicesCols;
    
    constructor(
        private serviceService: ServiceService,
        private toastService: ToastService,
    ) { }

    ngOnInit() {
        this.loadServices();
    }

    getSeverity(status: string): string {
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

    loadServices(): void {
        this.serviceService.getServices()
            .pipe(
                take(1),
                catchError(error => {
                    console.log(error);
                    return of();
                })
            )
            .subscribe({
                next: (services) => {
                    this.services.set(services);
                    console.log('Serviços carregados:', this.services());
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
