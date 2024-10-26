import { NgModule } from "@angular/core";
import { ServiceModalComponent } from "./service-modal.component";
import { DialogModule } from 'primeng/dialog';
import { ServiceOfferService } from "../../services/services-offer/service-offer.service";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
    imports: [
        SharedModule,
        DialogModule,
    ],
    exports: [ServiceModalComponent],
    declarations: [ServiceModalComponent],
    providers: [
        ServiceOfferService
    ],
})
export class ServiceModalModule {}
