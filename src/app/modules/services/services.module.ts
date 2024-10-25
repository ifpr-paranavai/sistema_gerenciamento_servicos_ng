import { NgModule } from "@angular/core";
import { ServicesRoutingModule } from "./services-routing.module";
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { SharedModule } from "../../core/shared/shared.module";
import { ServicesComponent } from "./services.component";
import { ServicesListComponent } from "./services-list/services-list.component";
import { FormsModule } from "@angular/forms";
import { ServiceModalModule } from "../../core/modals/service-modal/service-modal.module";

@NgModule({
    imports: [
        ServicesRoutingModule,
        SharedModule,
        FormsModule,
        TableModule,
        TagModule,
        RatingModule,
        ServiceModalModule,
    ],
    exports: [],
    declarations: [
        ServicesComponent,
        ServicesListComponent
    ],
    providers: [],
})
export class ServicesModule {}
