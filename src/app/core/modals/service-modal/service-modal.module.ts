import { NgModule } from "@angular/core";
import { ServiceModalComponent } from "./service-modal.component";
import { DialogModule } from 'primeng/dialog';
import { ServiceRequest } from "../../requests/services/service.request";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
    imports: [
        SharedModule,
        DialogModule,
    ],
    exports: [ServiceModalComponent],
    declarations: [ServiceModalComponent],
    providers: [
        ServiceRequest
    ],
})
export class ServiceModalModule {}
