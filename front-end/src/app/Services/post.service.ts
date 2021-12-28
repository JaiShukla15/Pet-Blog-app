import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import {app} from "../shared/Constants/appConstants";

@Injectable({
  providedIn: "root"
})
export class PostService {
  public category = new Subject();
  constructor(private _http: HttpClient) {}
  savePostService(postForm) {
    return new Promise((resolve, reject) => {
      const postData = new FormData();
      postData.append("title", postForm.title);
      postData.append("category", postForm.category);
      postData.append("creator", postForm.creator);
      postData.append("post", postForm.post);
      postData.append("userId", postForm.userId);
      postData.append("profilePic", postForm.profilePic);
      this._http
        .post(`${app.domainName}post/post`, postData)
        .subscribe((response: any) => {
          if (response.success) {
            resolve(response.message);
          } else {
            reject(response.message);
          }
        });
    });
  }
  likePost(postId, userId) {
    this._http
      .post(`${app.domainName}post/like`, { postId, userId })
      .subscribe((response: any) => {});
  }

  unlikePost(postId, userId) {
    this._http
      .post(`${app.domainName}post/unlike`, { postId, userId })
      .subscribe((response: any) => {});
  }
  getPost(page,pagination) {
    return new Promise((resolve, reject) => {
      this._http
        .get(`${app.domainName}post/posts/${page}/${pagination}`)
        .subscribe((response: any) => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(response.message);
          }
        });
    });
  }
  getSinglePost(postId) {
    return new Promise((resolve, reject) => {
      this._http
        .get(`${app.domainName}post/${postId}`)
        .subscribe((response: any) => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(response.message);
          }
        });
    });
  }
  addComment(commentForm) {
    return new Promise((resolve, reject) => {
      this._http
        .post(`${app.domainName}post/comment`, commentForm)
        .subscribe((response: any) => {
          if (response.success) {
            resolve(response);
          } else {
            reject(response.message);
          }
        });
    });
  }
  addReply(commentForm,commentId) {
    return new Promise((resolve, reject) => {
      this._http
        .post(`${app.domainName}post/comment/${commentId}/reply`, commentForm)
        .subscribe((response: any) => {
          if (response.success) {
            resolve(response);
          } else {
            reject(response.message);
          }
        });
    });
  }
  getLatestPosts() {
    return new Promise((resolve, reject) => {
      this._http
        .get(`${app.domainName}post/getLatestPosts`)
        .subscribe((response: any) => {
          if (response.success) {
            resolve(response);
          } else {
            reject(response);
          }
        });
    });
  }
  getOldestPosts() {
    return new Promise((resolve, reject) => {
      this._http
        .get(`${app.domainName}post/getOldestPosts`)
        .subscribe((response: any) => {
          if (response.success) {
            resolve(response);
          } else {
            reject(response);
          }
        });
    });
  }
  getCategoryPosts(category) {
    return new Promise((resolve, reject) => {
      this._http
        .get(`${app.domainName}post/category/${category}`)
        .subscribe((response: any) => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(response);
          }
        });
    });
  }
  mostClickedPosts(){ 
    return new Promise((resolve, reject) => {
      this._http
        .get(`${app.domainName}post/posts/mostClicked`)
        .subscribe((response: any) => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(response.message);
          }
        });
    });
  }
  mostCommentedPosts(){ 
    return new Promise((resolve, reject) => {
      this._http
        .get(`${app.domainName}post/posts/mostCommented`)
        .subscribe((response: any) => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(response.message);
          }
        });
    });
  }
  getCategoriesData(){
       return new Promise((resolve, reject) => {
      this._http
        .get(`${app.domainName}categories/categories`)
        .subscribe((response: any) => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(response.message);
          }
        });
    });
  }
  getUserPosts(id,page,pagination){
    return new Promise((resolve, reject) => {
      this._http
        .get(`${app.domainName}post/posts/userPosts/${id}/${page}/${pagination}`)
        .subscribe((response: any) => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(response.message);
          }
        });
    });
  }
}
