import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { LoginService } from "src/app/Services/login.service";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-user-login",
  templateUrl: "./user-login.component.html",
  styleUrls: ["./user-login.component.css"]
})
export class UserLoginComponent implements OnInit {
  public userMes: string;
  public check: boolean;
  public loginForm:FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _loginService: LoginService,
    private _router: Router
  ) {}
  get username() {
    return this.loginForm.get("username");
  }
  get password() {
    return this.loginForm.get("password");
  }

  onLoginForm(loginForm) {
    this._loginService.loginUser(loginForm.value).then((data: any) => {
      if (data.success === false) {
        this.userMes = data.info.message;
        this.check = true;
      } else if (data.success && !data.verified) {
        this._router.navigate(["/verifyAccount"]);
      } else {
        this._router.navigate(["/dashboard"]);
      }
    });
  }
  onDone() {
    this.check = false;
  }
  ngOnInit(){
    this.loginForm = this._fb.group({
      username: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [
          Validators.required,
          Validators.pattern(new RegExp("(?=.*[A-Z])(?=.*[a-z])(?=.*[$#%^+=])"))
        ]
      ]
    });
  }
  ngOnDestroy(){

  }
}
