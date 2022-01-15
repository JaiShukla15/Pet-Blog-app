import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Subject } from "rxjs";
import { NgForm } from "@angular/forms";
import {environment} from 'src/environments/environment';
import {app} from "../shared/Constants/appConstants";
@Injectable({
  providedIn: "root"
})
export class LoginService {
  public loginDetails = new BehaviorSubject({});
  public user;
  constructor(private _http: HttpClient) {}
  public isLogin = new Subject();
  loginUser(loginForm: NgForm) {
    return new Promise((res, rej) => {
      this._http
        .post(`${environment.baseUrl}user/login`, loginForm)
        .subscribe((response: any) => {
          if (response.data) {
            localStorage.setItem("pplToken", response.token);
            this.loginDetails.next(response.data);
            this.user = response.data;
          }
          res(response);
        });
    });
  }
  isUserLogin() {
    return this.isLogin.asObservable();
  }
  forgotPassword(forgotForm: NgForm) {
    return new Promise((res, rej) => {
      this._http
        .post(`${environment.baseUrl}user/forgotPassword`, forgotForm.value)
        .subscribe((response: any) => {
          if (response.success) {
            this.loginDetails.next(response.message);
            res(response.message);
          } else {
            rej(response.message);
          }
        });
    });
  }
  forgotPasswordCheck(forgotForm: NgForm) {
    return new Promise((res, rej) => {
      this._http
        .put(`${environment.baseUrl}user/forgotPasswordCheck`, forgotForm.value)
        .subscribe((response: any) => {
          if (response.success) {
            this.loginDetails.next(response.message);
            res(response.message);
          } else {
            res(response.message);
          }
        });
    });
  }
  getUser() {
    return this.loginDetails.asObservable();
  }
  getLoginDetails() {
    return new Promise((resolve, reject) => {
      let token = localStorage.getItem("pplToken");
      if (token) {
        this._http
          .post(`${environment.baseUrl}user/verify`, { token })
          .subscribe((response: any) => {
            if (response.success) {
              this.user = response.data;
              this.loginDetails.next(this.user);
              resolve(this.user);
            } else {
              reject(response.message);
            }
          });
      }
    });
  }

  getProfilePicture = (email: string) =>
    `${environment.baseUrl}user/profilePic/${email}`;

    getNotifications=(userId)=>{
  return new Promise((resolve,reject)=>{
     this._http.get(`${environment.baseUrl}notifications/notifications/${userId}`).subscribe((response:any)=>{   
     if(response.success){
       resolve({success:true,data:response.data});
     }else{
       reject({success:false,data:null});
     }
     })
  })
    }
    clearNotifications(userId){
        return new Promise((resolve,reject)=>{
        this._http.put(`${environment.baseUrl}notifications/clear/${userId}`,{}).subscribe((response:any)=>{   
        if(response.success){
          resolve({success:true,message:response.message});
        }else{
          reject({success:false,message:response.message});
        }
        })
     })
    }
  }

