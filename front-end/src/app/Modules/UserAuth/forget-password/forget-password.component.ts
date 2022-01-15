import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { LoginService } from "src/app/Services/login.service";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-forget-password",
  templateUrl: "./forget-password.component.html",
  styleUrls: ["./forget-password.component.css"]
})
export class ForgetPasswordComponent implements OnInit {
  public userMsg;
  public forgotForm:FormGroup;
  constructor(
    private _fb: FormBuilder,
    private _loginService: LoginService,
    private _router: Router
  ) {}
  public check: boolean = false;
  get username() {
    return this.forgotForm.get("username");
  }

  ngOnInit() {
    this.forgotForm = this._fb.group({
      username: ["", [Validators.required, Validators.email]]
    });
  }
  onDone() {
    this.check = false;
    this.forgotForm.reset();
  }

  forgotPassword(forgotForm) {
    this.check = true;
    this._loginService
      .forgotPassword(forgotForm)
      .then((response: any) => {
        this.userMsg = response;
      })
      .catch(err => {
        this.userMsg = err;
      });
  }
}
