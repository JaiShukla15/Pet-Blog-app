import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TimelineComponent } from "../UserProfile/timeline/timeline.component";
import { ProfileComponent } from "./proflie/profile.component";

const routes: Routes = [
  {
    path: "",
    component: ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
export const ProfileRoutingComponents = [TimelineComponent, ProfileComponent];
