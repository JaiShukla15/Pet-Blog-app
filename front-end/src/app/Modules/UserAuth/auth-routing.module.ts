import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserRegisterComponent } from "./user-register/user-register.component";
import { VerifyAccountComponent } from "./verify-account/verify-account.component";
import { UserLoginComponent } from "./user-login/user-login.component";
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { AuthGuard } from "src/app/guards/auth.guard";
import { ForgotPasswordCheckComponent } from "./forgot-password-check/forgot-password-check.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/register",
    pathMatch: "full"
  },
  {
    path: "register",
    component: UserRegisterComponent
  },
  {
    path: "login",
    component: UserLoginComponent
  },
  {
    path: "forgotPassword",
    component: ForgetPasswordComponent
  },
  {
    path: "forgotPasswordCheck",
    component: ForgotPasswordCheckComponent
  },
  {
    path: "verifyAccount",
    component: VerifyAccountComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
export const RoutingComponents = [
  UserRegisterComponent,
  VerifyAccountComponent,
  ForgotPasswordCheckComponent,
  UserLoginComponent,
  ForgetPasswordComponent
];
