import { ChangeDetectionStrategy, Component, ViewChild, WritableSignal, signal } from "@angular/core";
import { Sidebar } from "primeng/sidebar";
import { RoutesConstants } from "../../core/constants/routes.constants";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../core/services/authentication/authentication.service";

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

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
    ) {}

    closeCallback(e: any): void {
        this.sidebarRef.close(e);
    }
    
    redirectRoute(route: string): void {
        this.router.navigate([route]);
        this.sidebarVisible.set(false);
    }

    logout(): void {
        this.authenticationService.logout();
        this.router.navigate([RoutesConstants.AUTH]);
    }
}