import { Component, OnInit } from "@angular/core";
import { LoginService } from "../../Services/login.service";
import { Router } from "@angular/router";
import {app} from "../../shared/Constants/appConstants";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  public username: string;
  public wait: boolean;
  public profilePic: string;
  public notificationCount:number;
  public userId:string;
  public notifications=[];
  constructor(private _loginService: LoginService, private router: Router) {}

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
        console.log("something went wrong ");
      });
    });
    
  }
  goTo(event) {
    if (event.value === "logout") {
      localStorage.clear();
      this.username = null;
      this.router.navigate(["/login"]);
    } else {
      this.router.navigate([event.value]);
    }
  }
  logout(){
    localStorage.clear();
    this.username = null;
    this.router.navigate(["/login"]);
  }
}
