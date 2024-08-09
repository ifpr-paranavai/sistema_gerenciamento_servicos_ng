import { NgModule } from "@angular/core";
import { LayoutComponent } from "./layout.component";
import { LayoutRoutingModule } from "./layout-routing.module";
import { SharedModule } from "../../core/shared/shared.module";
import { SidebarModule } from "../../components/sidebar/sidebar.module";

@NgModule({
    imports: [
        LayoutRoutingModule,
        SharedModule,
        SidebarModule
    ],
    exports: [],
    declarations: [LayoutComponent],
    providers: [],
})
export class LayoutModule {}
