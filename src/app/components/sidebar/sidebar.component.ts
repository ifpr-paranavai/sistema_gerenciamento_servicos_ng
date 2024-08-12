import { ChangeDetectionStrategy, Component, ViewChild, WritableSignal, signal } from "@angular/core";
import { Sidebar } from "primeng/sidebar";
import { RoutesConstants } from "../../core/constants/routes.constants";
import { Router } from "@angular/router";

@Component({
    selector: 'sgs-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
    @ViewChild('sidebarRef') sidebarRef!: Sidebar;

    routesConstants = RoutesConstants;

    public sidebarVisible: WritableSignal<boolean> = signal(false);

    constructor(private router: Router) {}

    closeCallback(e: any): void {
        this.sidebarRef.close(e);
    }
    
    redirectRoute(route: string): void {
        this.router.navigate([route]);
        this.sidebarVisible.set(false);
    }
}