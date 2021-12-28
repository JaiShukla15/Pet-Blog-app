import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/Services/login.service';
import {app} from "../../../shared/Constants/appConstants";
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
public username:string;
public userId:string;
public profilePic:string;
public notifications=[];
public msg:string;
public check:boolean=false;
public notificationCount:number;
  constructor(private _loginService:LoginService) { }

  ngOnInit() {
    this._loginService.getLoginDetails().then((response: any) => {
      if (response.firstName) {
        this.username = response.firstName;
        this.userId=response._id;
        this.profilePic = `${app.domainName}user/profilePic/${response.email}`;
      }
    }).then(()=>{
      this._loginService.getNotifications(this.userId).then((response:any)=>{
        this.notifications=response.data;
        this.notificationCount=this.notifications.length;
      }).catch(err=>{
        this.msg=err;
        this.check=true;
      });
    });
  }
  onDone() {
    this.check = false;
    this.ngOnInit();
  
  }
  clearNotifications(){
  this._loginService.clearNotifications(this.userId).then((response:any)=>{
    this.msg=response.message;
    this.check=true;
  }).catch((response:any)=>{
    this.msg=response.message;
    this.check=true;
  })
  }

}
