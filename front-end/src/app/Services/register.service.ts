import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import {app} from "../shared/Constants/appConstants";
@Injectable({
  providedIn: "root"
})
export class RegisterService {
  public userMessages = new Subject();
  constructor(private _http: HttpClient) {}
  saveUserService(userForm) {
    return new Promise((resolve, reject) => {
      let userData = new FormData();
      userData.append("firstName", userForm.firstName);
      userData.append("lastName", userForm.lastName);
      userData.append("email", userForm.email);
      userData.append("userName", userForm.userName);
      userData.append("password", userForm.cpassword);
      userData.append("security", userForm.security);
      userData.append("profilePic", userForm.profilePic);
      this._http
        .post<any>(`${app.domainName}user/register`, userData)
        .subscribe(data => {
          if (data.success === false) {
            reject(data.message);
          } else {
            resolve(data.message);
          }
        });
    });
  }
  verifyUserService(verifyForm) {
    return new Promise((resolve, reject) => {
      this._http
        .post(`${app.domainName}user/verifyAccount`, verifyForm)
        .subscribe((response: any) => {
          if (response.success) {
            resolve(response.message);
          } else {
            reject(response.message);
          }
        });
    });
  }
  changePassword(resetPasswordForm) {
    return new Promise((resolve, reject) => {
      this._http
        .post(`${app.domainName}user/resetPassword`, resetPasswordForm)
        .subscribe((response: any) => {
          if (response.success === true) {
            resolve(response.message);
          } else {
            reject(response.message);
          }
        });
    });
  }
  invite(inviteForm){
    return new Promise((resolve, reject) => {
      this._http
        .post(`${app.domainName}user/invite`, inviteForm)
        .subscribe((response: any) => {
          if (response.success === true) {
            resolve(response.message);
          } else {
            reject(response.message);
          }
        });
    });
  }
}
