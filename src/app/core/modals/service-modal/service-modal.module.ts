import { NgModule } from "@angular/core";
import { ServiceModalComponent } from "./service-modal.component";
import { DialogModule } from 'primeng/dialog';
import { ServiceRequest } from "../../requests/services/service.request";
import { SharedModule } from "../../shared/shared.module";
import { TableModule } from "primeng/table";
import { CheckboxModule } from "primeng/checkbox";

@NgModule({
    imports: [
        SharedModule,
        DialogModule,
        TableModule,
        CheckboxModule,
    ],
    exports: [ServiceModalComponent],
    declarations: [ServiceModalComponent],
    providers: [
        ServiceRequest
    ],
})
export class ServiceModalModule {}
