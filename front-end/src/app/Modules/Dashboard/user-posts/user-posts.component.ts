import { Component, OnInit } from "@angular/core";
import { PostService } from "src/app/Services/post.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "src/app/Services/login.service";
import { User } from "src/app/shared/Modal/User";
import { Router, ActivatedRoute } from "@angular/router";
import { List } from 'linqts';
import {app} from '../../../shared/Constants/appConstants';
import {environment} from 'src/environments/environment';

@Component({
  selector: "app-user-posts",
  templateUrl: "./user-posts.component.html",
  styleUrls: ["./user-posts.component.css"]
})
export class UserPostsComponent implements OnInit {
  constructor(
    private postService: PostService,
    private router: Router,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}
  public commentPost:string;
  public liked: boolean = false;
  public wait:boolean=false;
  public next:any=1;
  public pagination:number=1;
  public msg: string;
  public check: boolean;
  public comment: boolean = false;
  public user: User;
  public commentForm: FormGroup;
  public replyForm: FormGroup;
  public category:string;
  public posts = [];
  public myLikes=[];
  public profilePic: string;
  public postsWithLike = [];
  get userComment() {
    return this.commentForm.get("userComment");
  }
  ngOnInit() {
    this.loginService
      .getLoginDetails()
      .then((response: any) => {
        this.user = response;
        this.profilePic = this.loginService.getProfilePicture(this.user.email);
        if (!this.user.isVerified) {
          this.router.navigate(["/verifyAccount"]);
        }
      })
      .catch(err => {
        this.msg = err;
        this.check = true;
      });
    this.commentForm = this.fb.group({
      userComment: ["", [Validators.required, Validators.minLength(3)]],
      commentUser: ["", [Validators.required]],
      userId: ["", Validators.required],
      pid: ["", Validators.required],
      profilePic: [""]
    });
    this.replyForm = this.fb.group({
      userComment: ["", [Validators.required, Validators.minLength(3)]],
      commentUser: ["", [Validators.required]],
      userId: ["", Validators.required],
      pid: ["", Validators.required],
      profilePic: [""]
    });
    var userCategory = this.route.snapshot.paramMap.get("category");
    this.category=userCategory;
    if (userCategory) {
      this.postService
        .getCategoryPosts(userCategory)
        .then((response: any) => {
          this.posts = response;
          this.posts.map(
            post =>
              (post.post = `${environment.baseUrl}post/display/${post.post}`)
          );
          this.posts.map(
            post =>
              (post.profilePic = `${environment.baseUrl}user/profilePic/${post.profilePic}`)
          );

          this.postsWithLike = this.posts.map(postonly=>{
            let x = new List<any>(postonly.likes)
                            .Where(x=>x.userId==this.user._id)
                            .Select(t=>t.postId).ToArray();
             postonly.isLike = x.length>0?true:false;
             return postonly;
          })
        })
        .catch(err => {
         this.ngOnInit();
        });
    } else {
      this.next=parseInt(this.next);
      this.next=this.next==0?1:this.next;
        this.postService
        .getPost(this.next,this.pagination)
        .then((response: any) => {
          this.posts = response;
          this.posts.map(
            post =>
              (post.post = `${environment.baseUrl}post/display/${post.post}`)
          );
          this.posts.map(
            post =>
              (post.profilePic = `${environment.baseUrl}user/profilePic/${post.profilePic}`)
          );        
          this.postsWithLike = this.posts.map(postonly=>{
            let x = new List<any>(postonly.likes)
                            .Where(x=>x.userId==this.user._id)
                            .Select(t=>t.postId).ToArray();
             postonly.isLike = x.length>0?true:false;
             return postonly;
          })
      })
        .catch(err => {
         this.ngOnInit();
        });
    }
  }
  like(postId, userId) {
    this.postService.likePost(postId, userId);
    this.liked = true;
    this.ngOnInit();
  }

  unlike(postId, userId) {
    this.postService.unlikePost(postId, userId);
    this.liked = false;
    this.ngOnInit();
  }
  showComments(commentPostId) {
    this.comment = !this.comment;
    this.commentPost=commentPostId;
  }
  saveComment(commentForm, pid) {
    this.commentForm.patchValue({ userId: this.user._id });
    this.commentForm.updateValueAndValidity();
    this.commentForm.patchValue({
      commentUser: `${this.user.firstName} ${this.user.lastName}`
    });
    this.commentForm.updateValueAndValidity();
    this.commentForm.patchValue({ pid: pid });
    this.commentForm.updateValueAndValidity();
    this.commentForm.patchValue({
      profilePic: this.loginService.getProfilePicture(this.user.email)
    });
    this.commentForm.updateValueAndValidity();

    this.postService
      .addComment(commentForm.value)
      .then((response: any) => {
        this.commentForm.reset();
        this.msg = response.message;
        this.check = true;
        this.ngOnInit();
      })
      .catch(err => {
        this.msg = err;
        this.commentForm.reset();
        this.check = true;
      });
  }
  reply(replyForm, pid,commentId) {
    this.replyForm.patchValue({ userId: this.user._id });
    this.replyForm.updateValueAndValidity();
    this.replyForm.patchValue({
      commentUser: `${this.user.firstName} ${this.user.lastName}`
    });
    this.replyForm.updateValueAndValidity();
    this.replyForm.patchValue({ pid: pid });
    this.replyForm.updateValueAndValidity();
    this.replyForm.patchValue({
      profilePic: this.loginService.getProfilePicture(this.user.email)
    });
    this.replyForm.updateValueAndValidity();

    this.postService.addReply(replyForm.value,commentId)
      .then((response: any) => {
        this.commentForm.reset();
        this.msg = response.message;
        this.check = true;
        this.ngOnInit();
      })
      .catch(err => {
        this.msg = err;
        this.commentForm.reset();
        this.check = true;
      });
  }
  onDone() {
    this.check = false;
    this.ngOnInit();
  
  }
  previousPage(){
    this.next=parseInt(this.next);
    this.next--;
    this.next=this.next==0?1:this.next;
    this.postService
    .getPost(this.next,this.pagination)
    .then((response: any) => {
      this.posts = response;
      this.posts.map(
        post =>
          (post.post = `${environment.baseUrl}post/display/${post.post}`)
      );
      this.posts.map(
        post =>
          (post.profilePic = `${environment.baseUrl}user/profilePic/${post.profilePic}`)
      );

      this.postsWithLike = this.posts.map(postonly=>{
        let x = new List<any>(postonly.likes)
                        .Where(x=>x.userId==this.user._id)
                        .Select(t=>t.postId).ToArray();
         postonly.isLike = x.length>0?true:false;
         return postonly;
      })
    })
    .catch(err => {
     this.ngOnInit();
    });
  }
  mostCommentedPosts(){
    this.postService.mostCommentedPosts().then((response: any) => {
      this.posts = response;
      this.posts.map(
        post => (post.post = `${environment.baseUrl}post/display/${post.post}`)
      );
      this.posts.map(post => {
        return (post.profilePic = `${environment.baseUrl}user/profilePic/${post.profilePic}`);
      });
      this.postsWithLike = this.posts.map(postonly=>{
        let x = new List<any>(postonly.likes)
                        .Where(x=>x.userId==this.user._id)
                        .Select(t=>t.postId).ToArray();
         postonly.isLike = x.length>0?true:false;
         return postonly;
      })
    });
  }
  nextPage(){
    this.next=parseInt(this.next);
    this.next++;
    this.postService
    .getPost(this.next,this.pagination)
    .then((response: any) => {
      this.posts = response;
      this.posts.map(
        post =>
          (post.post = `${environment.baseUrl}post/display/${post.post}`)
      );
      this.posts.map(
        post =>
          (post.profilePic = `${environment.baseUrl}user/profilePic/${post.profilePic}`)
      );
      this.postsWithLike = this.posts.map(postonly=>{
        let x = new List<any>(postonly.likes)
                        .Where(x=>x.userId==this.user._id)
                        .Select(t=>t.postId).ToArray();
         postonly.isLike = x.length>0?true:false;
         return postonly;
      })
    })
    .catch(err => {
      this.msg = err;
      this.check = true;
    });
  }
  mostClickedPosts(){
    this.postService.mostClickedPosts().then((response: any) => {
      this.posts = response;
      this.posts.map(
        post => (post.post = `${environment.baseUrl}post/display/${post.post}`)
      );
      this.posts.map(post => {
        return (post.profilePic = `${environment.baseUrl}user/profilePic/${post.profilePic}`);
      });
      this.postsWithLike = this.posts.map(postonly=>{
        let x = new List<any>(postonly.likes)
                        .Where(x=>x.userId==this.user._id)
                        .Select(t=>t.postId).ToArray();
         postonly.isLike = x.length>0?true:false;
         return postonly;
      })
    });
  } 
  latestPosts() {
    this.postService.getLatestPosts().then((response: any) => {
      this.posts = response.data;
      this.posts.map(
        post => (post.post = `${environment.baseUrl}post/display/${post.post}`)
      );
      this.posts.map(post => {
        return (post.profilePic = `${environment.baseUrl}user/profilePic/${post.profilePic}`);
      });
      this.postsWithLike = this.posts.map(postonly=>{
        let x = new List<any>(postonly.likes)
                        .Where(x=>x.userId==this.user._id)
                        .Select(t=>t.postId).ToArray();
         postonly.isLike = x.length>0?true:false;
         return postonly;
      })
    });
  }
  oldestPosts() {
    this.postService.getOldestPosts().then((response: any) => {
      this.posts = response.data;
      this.posts.map(
        post => (post.post = `${environment.baseUrl}post/display/${post.post}`)
      );
      this.posts.map(post => {
        return (post.profilePic = `${environment.baseUrl}user/profilePic/${post.profilePic}`);
      });
      this.postsWithLike = this.posts.map(postonly=>{
        let x = new List<any>(postonly.likes)
                        .Where(x=>x.userId==this.user._id)
                        .Select(t=>t.postId).ToArray();
         postonly.isLike = x.length>0?true:false;
         return postonly;
      })
    });
  }
}
