import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private http:HttpClient,private router:Router){}
  canActivate(){
    return localStorage.getItem('pplToken')?true: this.router.navigate(['/login']);
  }
  
}
