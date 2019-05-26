import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './authentication.routing';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

@NgModule({
  imports: [
    CommonModule,
    routing,
    FormsModule,
   
  ],
  declarations: [
    LoginComponent,
    RegistrationComponent
  ],
  providers: [  ]
})
export class AuthenticationModule { }
