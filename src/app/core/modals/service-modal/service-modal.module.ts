import { NgModule } from "@angular/core";
import { ServiceModalComponent } from "./service-modal.component";
import { DialogModule } from 'primeng/dialog';
import { ServiceService } from "../../services/services-offer/service.service";
import { InputTextModule } from "primeng/inputtext";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputNumberModule } from "primeng/inputnumber";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";

@NgModule({
    imports: [
        DialogModule,
        InputTextModule, 
        FloatLabelModule,
        InputNumberModule,
        ReactiveFormsModule,
        FormsModule,
        ButtonModule
    ],
    exports: [ServiceModalComponent],
    declarations: [ServiceModalComponent],
    providers: [
        ServiceService
    ],
})
export class ServiceModalModule {}