import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  Validators,
  AbstractControl
} from "@angular/forms";
import { PostService } from "src/app/Services/post.service";
import { LoginService } from "src/app/Services/login.service";
import { User } from 'src/app/shared/Modal/User';
import { Router } from '@angular/router';
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-add-post",
  templateUrl: "./add-post.component.html",
  styleUrls: ["./add-post.component.css"]
})
export class AddPostComponent implements OnInit {
  public user:User;
  public showImage;
  public wait: boolean;
  public postMsg: string;
  public check: boolean;
  public postForm:FormGroup;
  ngOnInit() {
    this.postForm = this._fb.group({
      title: ["", Validators.required],
      post: [""],
      category: ["", [Validators.required, Validators.minLength(3)]],
      creator: [""],
      userId: [""],
      profilePic: [""]
    });
  
    this._loginService.getLoginDetails().then((userData: any) => {
      this.user = userData;
    });
  }
  get title() {
    return this.postForm.get("title");
  }

  get post() {
    return this.postForm.get("post");
  }

  get category() {
    return this.postForm.get("category");
  }
  constructor(
    private router:Router,
    private _fb: FormBuilder,
    private _postService: PostService,
    private _loginService: LoginService 
  ) {}
  savePost(postForm) {
    this.wait = true;
    this.postForm.patchValue({ creator: this.user.firstName });
    this.postForm.get("creator").updateValueAndValidity();
    this.postForm.patchValue({ userId: this.user._id });
    this.postForm.get("userId").updateValueAndValidity();
    this.postForm.patchValue({ profilePic: this.user.email });
    this.postForm.get("profilePic").updateValueAndValidity();
    this._postService
      .savePostService(postForm.value)
      .then((response: any) => {
        this.postMsg = response;
        this.wait = false;
        this.postForm.reset();
        this.showImage = null;
        this.check = true;
      })
      .catch((err: any) => {
        this.postMsg = err;
        this.wait = false;
        this.postForm.reset();
        this.showImage = null;
        this.check = true;
      });
  }
  addPost(event) {
    let postFile = event.target.files[0];
    this.postForm.patchValue({ post: postFile });
    this.postForm.get("post").updateValueAndValidity();
    let reader = new FileReader();
    reader.onload = () => {
      this.showImage = reader.result;
    };
    reader.readAsDataURL(postFile);
  }

  onDone() {
    this.check = false;
    this.router.navigate(['dashboard']);
  
  }
}
