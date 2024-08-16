import { NgModule } from "@angular/core";
import { SchedulesComponent } from "./schedules.component";
import { SchedulesRoutingModule } from "./schedules-routing.module";
import { SchedulesListComponent } from "./schedules-list/schedules-list.component";
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../core/shared/shared.module";

@NgModule({
    imports: [
        SchedulesRoutingModule,
        SharedModule,
        TableModule, 
        TagModule, 
        RatingModule,          
    ],
    exports: [],
    declarations: [
        SchedulesComponent,
        SchedulesListComponent
    ],
    providers: [],
})
export class SchedulesModule {}