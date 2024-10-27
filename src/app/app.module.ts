import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastModule } from "primeng/toast";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MessageService } from 'primeng/api';
import { ToastService } from './core/requests/toastr/toast.service';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import ptBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

registerLocaleData(ptBr);

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        ToastModule,
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'pt' },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        ToastService,
        MessageService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
