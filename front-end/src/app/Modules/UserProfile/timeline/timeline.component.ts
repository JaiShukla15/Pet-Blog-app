import { Component, OnInit } from "@angular/core";
import { LoginService } from "src/app/Services/login.service";
import { User } from "src/app/shared/Modal/User";
import { PostService } from "src/app/Services/post.service";
import { Router } from "@angular/router";
import { List } from 'linqts';
import {app} from "../.././../shared/Constants/appConstants";

@Component({
  selector: "app-timeline",
  templateUrl: "./timeline.component.html",
  styleUrls: ["./timeline.component.css"]
})
export class TimelineComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private postService: PostService,
    private router: Router
  ) {}
  public user: User;
  public msg: string;
  public show = false;
  public liked: boolean;
  public comment: boolean;
  public wait = false;
  public posts = [];
  public postsLiked = [];
  public profilePic: string;
  ngOnInit() {
    this.wait = true;
    this.loginService
      .getLoginDetails()
      .then((response: any) => {
        this.wait = false;
        this.user = response;
        this.profilePic = `${app.domainName}user/profilePic/${this.user.email}`;
        if (!this.user.isVerified) {
          this.router.navigate(["/verifyAccount"]);
        }
      })
      .catch(err => {
        this.show = true;
        this.wait = false;
        this.msg = err;
      })
      .then(() => {
        this.postService.getPost(1,1)
          .then((data: any) => {
            this.posts = data;
            this.posts.map(
              post => (post.post = `${app.domainName}post/display/${post.post}`)
            );
            this.posts.map(
              post =>
                (post.profilePic = `${app.domainName}user/profilePic/${post.profilePic}`)
            );
            this.posts.map(post => {
              return (post.profilePic = `${app.domainName}user/profilePic/${post.profilePic}`);
            });
            this.posts = this.posts.map(postonly=>{
              let x = new List<any>(postonly.likes)
                              .Where(x=>x.userId==this.user._id)
                              .Select(t=>t.postId).ToArray();
               postonly.isLike = x.length>0?true:false;
               return postonly;
            })
            this.wait = false;
          })
          .catch(err => {
            this.msg = err;
            this.wait = false;
            this.show = true;
          });
      });
  }
  like(postId, userId) {
    this.postService.likePost(postId, userId);
    this.liked = true;
  }

  unlike(postId, userId) {
    this.postService.unlikePost(postId, userId);
    this.liked = false;
  }
  showComments() {
    this.comment = !this.comment;
  }
  onDone() {
    this.show = false;
  }
  myPosts(){
  this.postService.getUserPosts(this.user._id,1,1).then((response:any)=>{
    this.posts = response;
    this.posts.map(
      post =>
        (post.post = `${app.domainName}post/display/${post.post}`)
    );
    this.posts.map(
      post =>
        (post.profilePic = `${app.domainName}user/profilePic/${post.profilePic}`)
    );
   this.posts.forEach(post => {
      let data = post.likes.filter(like => {
       return like.userId===this.user._id?true:false;
      });
      data.forEach(post => {
        this.postsLiked.push(post.postId);
      });
    });
  }).catch(err=>{
    this.show = true;
    this.wait = false;
    this.msg = err;
  });
  }
}
