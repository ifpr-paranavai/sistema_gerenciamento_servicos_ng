import { NgModule } from "@angular/core";
import { LayoutComponent } from "./layout.component";
import { LayoutRoutingModule } from "./layout-routing.module";
import { TopbarModule } from "../../components/topbar/topbar.module";
import { HomeModule } from "../home/home.module";

@NgModule({
    imports: [
        LayoutRoutingModule,
        TopbarModule,
        HomeModule,
    ],
    exports: [],
    declarations: [LayoutComponent],
    providers: [],
})
export class LayoutModule {}
