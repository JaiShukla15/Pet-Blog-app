import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/Services/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public username;
  constructor() { }
  ngOnInit() {
  }

}
