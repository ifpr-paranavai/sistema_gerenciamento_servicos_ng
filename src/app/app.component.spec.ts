import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ToastModule } from 'primeng/toast';
import { ToastService } from './core/services/toastr/toast.service';
import { MessageService } from 'primeng/api';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ToastModule,
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        MessageService,
      ],
    }).compileComponents();
  });

  it('Deve criar o componente principal', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`Deverá ter como título da aplicação 'sistema_gerenciamento_servicos_ng'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('sistema_gerenciamento_servicos_ng');
  });
});
