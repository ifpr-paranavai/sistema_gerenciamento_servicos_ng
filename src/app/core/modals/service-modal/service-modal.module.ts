import { NgModule } from "@angular/core";
import { ServiceModalComponent } from "./service-modal.component";
import { DialogModule } from 'primeng/dialog';
import { ServiceService } from "../../services/services-offer/service.service";
import { InputTextModule } from "primeng/inputtext";
import { FloatLabelModule } from "primeng/floatlabel";

@NgModule({
    imports: [
        DialogModule,
        InputTextModule, 
        FloatLabelModule,
    ],
    exports: [ServiceModalComponent],
    declarations: [ServiceModalComponent],
    providers: [
        ServiceService
    ],
})
export class ServiceModalModule {}