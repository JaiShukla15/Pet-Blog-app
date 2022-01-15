import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardComponent } from '../../Dashboard/dashboard/dashboard.component';
import { LoginService } from 'src/app/Services/login.service';
import { PostService } from 'src/app/Services/post.service';
import {app} from './../../../shared/Constants/appConstants';
import {environment} from 'src/environments/environment';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public posts=[];
  public msg:string;
  constructor(private _router:Router,private dashboard:DashboardComponent,private postService:PostService) { }

  ngOnInit() {
    this._router.navigate(['profile'],{relativeTo:this.dashboard._route})
    this.postService.getLatestPosts().then((posts:any)=>{
      this.posts=posts.data;
      this.posts.map(post=>{
        (post.post = `${environment.baseUrl}post/display/${post.post}`)
      })
      }).catch(error=>{
  
      })
    }
  goToAddPost() {
    this._router.navigate(["addPosts"], { relativeTo: this.dashboard._route });
  }
  goToInvite(){
    this._router.navigate(["invite"], { relativeTo: this.dashboard._route });

  }
}
