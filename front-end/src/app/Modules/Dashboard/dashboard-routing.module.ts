import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AddPostComponent } from "./add-post/add-post.component";
import { SidePostsComponent } from "./side-posts/side-posts.component";
import { AuthGuard } from "../../guards/auth.guard";
import { UserPostsComponent } from "./user-posts/user-posts.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { SinglePostComponent } from "./single-post/single-post.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { MostPetComponent } from './most-pet/most-pet.component';
import { InviteComponent } from './invite/invite.component';
const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "addPosts",
        component: AddPostComponent
      },
      {
        path: "invite",
        component: InviteComponent
      },
      {
        path: "notifications",
        component: NotificationsComponent
      },
      {
        path: "mostPet",
        component: MostPetComponent
      },
      {
        path: "",
        component: SidePostsComponent
      },
      {
        path: "category/:category",
        component: UserPostsComponent
      },
      {
        path: "resetPassword",
        component: ResetPasswordComponent
      },
      {
        path: "post/:id",
        component: SinglePostComponent
      },
      {
        path: "profile",
        loadChildren: () =>
          import("../UserProfile/profile.module").then(m => m.ProfileModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
export const DashboardComponents = [
  NotificationsComponent,
  UserPostsComponent,
  SidePostsComponent,
  SinglePostComponent,
  MostPetComponent,
  ResetPasswordComponent,
  DashboardComponent,
  AddPostComponent,
];
