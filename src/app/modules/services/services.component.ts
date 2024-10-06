import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ServiceResponse } from "../../core/interfaces/service-response.interface copy";
import { ServiceService } from "../../core/services/services_offer/service.service";

@Component({
    selector: "sgs-services",
    templateUrl: "./services.component.html",
    styleUrls: ["./services.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent implements OnInit {
    services: ServiceResponse[] = [];

    constructor(private serviceService: ServiceService) {}

    ngOnInit() {
        this.loadServices();
    }

    loadServices() {
        this.serviceService.getServices().subscribe(
            (services: ServiceResponse[]) => {
                this.services = services;
                console.log('Serviços carregados:', this.services);
            },
            (error: Error) => {
                console.error('Erro ao carregar serviços:', error);
            }
        );
    }
}