import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { RegisterService } from "src/app/Services/register.service";
import { LoginService } from "src/app/Services/login.service";
import { DashboardComponent } from "../dashboard/dashboard.component";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"]
})
export class ResetPasswordComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private dashboard: DashboardComponent,
    private regService: RegisterService
  ) {}
  public resetForm: FormGroup;
  public email: string;
  public wait: boolean;
  public show: boolean;
  public msg: string;
  ngOnInit() {
    this.router.navigate(["resetPassword"], {
      relativeTo: this.dashboard._route
    });
    this.loginService
      .getLoginDetails()
      .then((userData: any) => {
        this.email = userData.email;
      })
      .catch(err => {
        this.msg = err;
        this.show = true;
      });
    this.resetForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(new RegExp("(?=.*[A-Z])(?=.*[a-z])(?=.*[$#%^+=])"))
        ]
      ],
      cpassword: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(new RegExp("(?=.*[A-Z])(?=.*[a-z])(?=.*[$#%^+=])"))
        ]
      ]
    });
  }
  changePassword(resetForm) {
    this.wait = true;
    this.resetForm.patchValue({ email: this.email });
    this.resetForm.get("email").updateValueAndValidity();
    this.regService
      .changePassword(resetForm.value)
      .then((response: any) => {
        this.wait = false;
        this.msg = response;
        this.show = true;
      })
      .catch(err => {
        this.wait = false;
        this.msg = err;
        this.show = true;
      });
  }
  onDone(){
  this.show=false;  
  }
}
