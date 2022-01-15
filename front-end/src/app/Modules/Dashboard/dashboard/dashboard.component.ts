import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  public username;
  public wait;
  public profilePic;

  constructor(public _route: ActivatedRoute,private _router:Router) {
  }
  ngOnInit() {
  }
  logout(){
    localStorage.clear();
  }
  onDone(){
  }
  goTo(url:string){
    this._router.navigateByUrl(url);
  }
}
