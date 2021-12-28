import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { PostService } from "src/app/Services/post.service";
import {app} from "../../../shared/Constants/appConstants";
@Component({
  selector: "app-side-posts",
  templateUrl: "./side-posts.component.html",
  styleUrls: ["./side-posts.component.css"]
})
export class SidePostsComponent implements OnInit {
  public posts=[];
  public msg:string;
  constructor(
    private _router: Router,
    private dashboard: DashboardComponent,
    private postService: PostService
  ) {}
  goToAddPost() {
    this._router.navigate(["addPosts"], { relativeTo: this.dashboard._route });
  }
  goToInvite(){
    this._router.navigate(["invite"], { relativeTo: this.dashboard._route });

  }
  ngOnInit() {
    this.postService.getLatestPosts().then((posts:any)=>{
    this.posts=posts.data;
    this.posts.map(post=>{
      (post.post = `${app.domainName}post/display/${post.post}`)
    })
    }).catch(error=>{

    })
  }
}
