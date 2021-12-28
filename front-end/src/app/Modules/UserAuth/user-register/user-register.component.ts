import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  Validators,
  NgForm,
  AbstractControl,
  FormGroup
} from "@angular/forms";
import { RegisterService } from "src/app/Services/register.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-user-register",
  templateUrl: "./user-register.component.html",
  styleUrls: ["./user-register.component.css"]
})
export class UserRegisterComponent implements OnInit {
  public showUserPic;
  constructor(
    private _fb: FormBuilder,
    private _regService: RegisterService,
    private _router: Router
  ) {}
  public wait: boolean = false;
  public msg;
  public check = false;
  get firstName() {
    return this.registerForm.get("firstName");
  }

  get lastName() {
    return this.registerForm.get("lastName");
  }

  get userName() {
    return this.registerForm.get("userName");
  }

  get password() {
    return this.registerForm.get("password");
  }

  get cpassword() {
    return this.registerForm.get("cpassword");
  }

  get email() {
    return this.registerForm.get("email");
  }

  get security() {
    return this.registerForm.get("security");
  }
  get termsCondition() {
    return this.registerForm.get("termsCondition");
  }
  public registerForm = this._fb.group(
    {
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.minLength(3)]],
      email: ["", [Validators.email, Validators.required]],
      userName: ["", [Validators.required, Validators.email]],
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
      ],
      security: ["", [Validators.required, Validators.minLength(3)]],
      profilePic: ["", Validators.required],
      termsCondition: ["", Validators.required]
    },
    { validators: this.passwordMatch.bind(this) }
  );
  ngOnInit() {}
  passwordMatch(control: AbstractControl) {
    let upassword = control.get("password");
    let cpassword = control.get("cpassword");
    if (upassword.value !== cpassword.value) {
      return control.get("cpassword").setErrors({ isNotMatching: true });
    } else {
      return null;
    }
  }
  onSave(regForm: NgForm) {
    this.wait = true;

    this._regService
      .saveUserService(regForm.value)
      .then(response => {
        this.msg = response;
        this.wait = false;
        this.check = true;
        this.registerForm.reset();
        this.showUserPic = null;
      })
      .catch(err => {
        this.msg = err;
        this.check = true;
        this.wait = false;
      });
  }
  displayPic(event) {
    let pic = event.target.files[0];
    this.registerForm.patchValue({ profilePic: pic });
    this.registerForm.get("profilePic").updateValueAndValidity();
    let reader = new FileReader();
    reader.onload = () => {
      this.showUserPic = reader.result;
    };
    reader.readAsDataURL(pic);
  }
  onDone() {
    this.check = false;
    this._router.navigateByUrl("/verifyAccount");
  }
}
