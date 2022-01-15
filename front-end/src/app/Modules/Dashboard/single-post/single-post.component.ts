import { Component, OnInit } from "@angular/core";
import { PostService } from "src/app/Services/post.service";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoginService } from "src/app/Services/login.service";
import { User } from "src/app/shared/Modal/User";
import {app} from "../../../shared/Constants/appConstants";
import {environment} from 'src/environments/environment';

@Component({
  selector: "app-single-post",
  templateUrl: "./single-post.component.html",
  styleUrls: ["./single-post.component.css"]
})
export class SinglePostComponent implements OnInit {
  get userComment() {
    return this.commentForm.get("userComment");
  }
  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private fb: FormBuilder
  ) {}
  public post;
  public user: User;
  public msg: string;
  public show: boolean;
  public liked: boolean;
  public postId: string;
  public check: boolean;
  public comment: boolean;
  public commentForm: FormGroup;
  ngOnInit() {
    this.loginService.getLoginDetails().then((user: any) => {
      this.user = user;
      this.user;
    });
    this.commentForm = this.fb.group({
      userComment: ["", [Validators.required, Validators.minLength(3)]],
      commentUser: ["", [Validators.required]],
      userId: ["", Validators.required],
      pid: ["", Validators.required],
      profilePic: [""]
    });
    this.postId = this.activatedRoute.snapshot.paramMap.get("id");
    this.postService
      .getSinglePost(this.postId)
      .then((response: any) => {
        this.post = response;
        this.post.post = `${environment.baseUrl}post/display/${response.post}`;
        this.post.profilePic = this.loginService.getProfilePicture(
          this.user.email
        );
      })
      .catch(err => {
        this.msg = err;
        this.show = true;
      });
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
    this.commentForm.patchValue({ profilePic: this.user.profilePic });
    this.commentForm.updateValueAndValidity();

    this.postService
      .addComment(commentForm.value)
      .then((response: any) => {
        this.commentForm.reset();
        this.msg = response.message;
        this.check = true;
      })
      .catch(err => {
        this.msg = err;
        this.commentForm.reset();
        this.check = true;
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
}
