import { NgModule } from "@angular/core";
import { LayoutComponent } from "./layout.component";
import { LayoutRoutingModule } from "./layout-routing.module";
import { SharedModule } from "../../core/shared/shared.module";
import { TopbarModule } from "../../components/topbar/topbar.module";

@NgModule({
    imports: [
        LayoutRoutingModule,
        SharedModule,
        TopbarModule,
    ],
    exports: [],
    declarations: [LayoutComponent],
    providers: [],
})
export class LayoutModule {}
