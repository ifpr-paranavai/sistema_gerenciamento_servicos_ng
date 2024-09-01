import { NgModule } from "@angular/core";
import { ServicesRoutingModule } from "./services-routing.module";
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { SharedModule } from "../../core/shared/shared.module";
import { ServicesComponent } from "./services.component";
import { ServicesListComponent } from "./services-list/services-list.component";

@NgModule({
    imports: [
        ServicesRoutingModule,
        SharedModule,
        TableModule,
        TagModule,
        RatingModule,
    ],
    exports: [],
    declarations: [
        ServicesComponent,
        ServicesListComponent
    ],
    providers: [],
})
export class ServicesModule {}
