import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserRegisterComponent } from "./user-register/user-register.component";
import { UserLoginComponent } from "./user-login/user-login.component";
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { VerifyAccountComponent } from "./verify-account/verify-account.component";
import { AuthRoutingModule } from "./auth-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { HomeComponent } from "./home/home.component";
import { ForgotPasswordCheckComponent } from "./forgot-password-check/forgot-password-check.component";
import { ShowPasswordDirective } from "src/app/shared/Directives/showPassword.directive";
@NgModule({
  declarations: [
    UserRegisterComponent,
    UserLoginComponent,
    ShowPasswordDirective,
    ForgetPasswordComponent,
    ForgotPasswordCheckComponent,
    VerifyAccountComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AuthRoutingModule
  ]
})
export class UserAuthModule {}
