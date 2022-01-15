import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { LoginService } from "src/app/Services/login.service";
import { Router } from "@angular/router";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-forgot-password-check",
  templateUrl: "./forgot-password-check.component.html",
  styleUrls: ["./forgot-password-check.component.css"]
})
export class ForgotPasswordCheckComponent implements OnInit {
  forgotForm:FormGroup;

  get username() {
    return this.forgotForm.get("username");
  }
  get securityAns() {
    return this.forgotForm.get("securityAns");
  }
  get cpassword() {
    return this.forgotForm.get("cpassword");
  }
  public check: boolean = false;
  public loading: boolean = false;
  public userMsg: string;
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private _loginService: LoginService
  ) {}
  ngOnInit() {
    this.forgotForm = this._fb.group({
      username: ["", [Validators.required, Validators.email]],
      securityAns: ["", Validators.required],
      cpassword: ["", Validators.required]
    });
  }
  forgotPasswordCheck(forgotForm) {
    this._loginService
      .forgotPasswordCheck(forgotForm)
      .then((response: any) => {
        this.userMsg = response;
        this.check = true;
        setTimeout(() => {
          this.router.navigate(["/login"]);
        }, 2000);
      })
      .catch(err => {
        this.userMsg = err;
        this.check = true;
      });
  }
  onDone() {
    this.check = false;
  }
}
