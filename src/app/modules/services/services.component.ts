import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ServiceResponse } from "../../core/interfaces/service-response.interface copy";
import { ServiceService } from "../../core/services/services_offer/service.service";

@Component({
    selector: "sgs-services",
    templateUrl: "./services.component.html",
    styleUrls: ["./services.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent{}