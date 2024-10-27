import { ChangeDetectionStrategy, Component, OnInit, ViewChild, WritableSignal, signal } from "@angular/core";
import { ServiceRequest } from "../../../core/requests/services/service.request";
import { ServiceResponse } from "../../../core/interfaces/service-response.interface";
import { catchError, of, take } from "rxjs";
import { ITableColumn } from "../../../core/interfaces/table-columns.interface";
import { ServicesCols } from "../../../core/constants/services.constants";
import { ToastService } from "../../../core/requests/toastr/toast.service";
import { ServiceModalComponent } from "../../../core/modals/service-modal/service-modal.component";

@Component({
    selector: "sgs-services-list",
    templateUrl: "./services-list.component.html",
    styleUrls: ["./services-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesListComponent implements OnInit {
    @ViewChild('serviceModal') serviceModal?: ServiceModalComponent;

    services: WritableSignal<ServiceResponse[]> = signal([]);
    servicesColumns: ITableColumn[] = ServicesCols;

    constructor(
        private serviceRequest: ServiceRequest,
        private toastService: ToastService,
    ) { }

    ngOnInit() {
        this.loadServices();
    }

    loadServices(): void {
        this.serviceRequest.getServices()
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

    editService(service: ServiceResponse): void {
        if (!this.serviceModal) throw new Error('ServiceModalComponent not found');

        this.serviceModal.openDialog(service);
    }

    deleteService(service: ServiceResponse): void {
        this.serviceRequest
            .deleteService(service.id!)
            .pipe(
                take(1),
                catchError(() => {
                    this.toastService.error("", "Falha ao deletar o serviço");
                    return of(null);
                }),
            ).subscribe(() => {
                this.services.update((services) => services.filter((s) => s.id !== service.id));
                this.toastService.success("", "Serviço deletado com sucesso")
            });
    }

    openModalService(): void {
        if (!this.serviceModal) throw new Error('ServiceModalComponent not found');

        this.serviceModal.openDialog();
    }

    addService(service: ServiceResponse): void {
        const index = this.services().findIndex((s) => s.id === service.id);
        if (index !== -1) {
            this.services().splice(index, 1, service);
            return;
        }

        this.services().push(service);
    }
}
