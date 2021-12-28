import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RegisterService } from "../../../Services/register.service";
import { Router } from "@angular/router";
import { LoginService } from "src/app/Services/login.service";
@Component({
  selector: "app-verify-account",
  templateUrl: "./verify-account.component.html",
  styleUrls: ["./verify-account.component.css"]
})
export class VerifyAccountComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private regService: RegisterService,
    private router: Router,
    private loginService: LoginService
  ) {}
  public email: string;
  public msg: string;
  public show: boolean = false;
  public verifyForm: FormGroup;

  get otp() {
    return this.verifyForm.get("otp");
  }
  ngOnInit() {
    this.loginService.getLoginDetails().then((response: any) => {
      if (response.isVerified) {
        this.router.navigate(["/dashboard"]);
      }
      this.email = response.email;
    });
    this.verifyForm = this.fb.group({
      otp: ["", [Validators.required, Validators.minLength(6)]],
      email: ["", [Validators.required, Validators.email]]
    });
  }
  verifyAccount(verifyForm) {
    this.verifyForm.patchValue({ email: this.email });
    this.verifyForm.get("email").updateValueAndValidity();
    this.regService
      .verifyUserService(verifyForm.value)
      .then((response: any) => {
        this.router.navigate(["/dashboard"]);
        this.show = true;
        this.msg = response;
      })
      .catch(err => {
        this.msg = err;
        this.show = true;
      });
  }
  onDone() {
    this.show = false;
  }
}
