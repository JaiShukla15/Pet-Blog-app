import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoginService } from 'src/app/Services/login.service';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/Services/register.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {

  public inviteForm: FormGroup;
  public email: string;
  public wait: boolean;
  public show: boolean;
  public msg: string;
  constructor(private fb:FormBuilder,private regService:RegisterService, private loginService:LoginService,private router:Router) { }

  ngOnInit() {
    this.loginService
    .getLoginDetails()
    .then((userData: any) => {
      this.email = userData.email;
    })
    .catch(err => {
      this.msg = err;
      this.show = true;
    });
    this.inviteForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      fromEmail:[""]
    });
  }
  invite(inviteForm) {
    this.wait = true;
    this.inviteForm.patchValue({ fromEmail: this.email });
    this.inviteForm.get("fromEmail").updateValueAndValidity();
    this.regService.invite(inviteForm.value)
      .then((response: any) => {
        this.wait = false;
        this.msg = response;
        this.show = true;
        this.inviteForm.reset();
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
