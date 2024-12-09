import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, ViewChild, WritableSignal, signal } from "@angular/core";
import { Sidebar } from "primeng/sidebar";
import { RoutesConstants } from "../../core/constants/routes.constants";
import { Router } from "@angular/router";
import { AuthenticationRequest } from "../../core/requests/authentication/authentication.request";
import { catchError, interval, switchMap, take, throwError } from "rxjs";
import { IUser } from "../../core/interfaces/user.interface";
import { UserPermissionsState } from "../../core/abstractions/user-permissions.state";
import { IFeature } from "../../core/interfaces/feature.interface";
import { FrontPermissionsConstants } from "../../core/constants/front-permissions.constants";
import { UserState } from "../../core/abstractions/user.state";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from "@angular/common/http";
import { ChatMessageRequest } from "../../core/requests/chat-message/chat-message.request";

@Component({
    selector: 'sgs-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
    @ViewChild('sidebarRef') sidebarRef!: Sidebar;

    routesConstants = RoutesConstants;
    
    public sidebarVisible: WritableSignal<boolean> = signal(false);
    public currentUser: WritableSignal<IUser | null> = signal(null);
    public userPermissions: WritableSignal<string[]> = signal([]);
    frontPermissions = FrontPermissionsConstants;
    unreadCount: WritableSignal<number> = signal(0);

    constructor(
        private router: Router,
        private authenticationService: AuthenticationRequest,
        private userPermissionsState: UserPermissionsState,
        private userState: UserState,
        private destroyRef: DestroyRef,
        private cdr: ChangeDetectorRef,
        private chatMessageRequest: ChatMessageRequest,
    ) { }

    ngOnInit(): void {
        this.recoverUserPermissions();
        this.recoverUserFromLocalStorage();
        this.watchUserState();
        this.startListeningUnreadMessages();
    }

    recoverUserFromLocalStorage(): void {
        this.authenticationService.currentUser.pipe(take(1)).subscribe((data) => {
            if (!data || !data.user) return;
            this.currentUser.set(data.user);
            this.userState.update(data.user);
            this.cdr.detectChanges();
        });
    }

    watchUserState(): void {
        this.userState.get$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
            if (!user) {
                this.recoverUserFromLocalStorage();
            };

            this.currentUser.set(user);
            this.cdr.detectChanges();
        })
    }

    recoverUserPermissions(): void {
        this.userPermissionsState.get$().pipe(take(1)).subscribe((data) => {
            if (!data) return;
            this.userPermissions.set(data);
        });
    }

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

    startListeningUnreadMessages(): void {
        interval(5000)
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            switchMap(() => this.chatMessageRequest.getUnreadCount()),
            catchError((error: HttpErrorResponse) => {
              console.error('Erro ao buscar mensagens não lidas', error);
              return throwError(() => error);
            })
          ).subscribe(response => {
            this.unreadCount.set(response.count);
            this.cdr.detectChanges();
          });
      }
}
