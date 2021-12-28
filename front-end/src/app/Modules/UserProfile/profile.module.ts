import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ProfileRoutingComponents,
  ProfileRoutingModule
} from "../UserProfile/profile-routing.module";

@NgModule({
  declarations: [ProfileRoutingComponents],
  imports: [CommonModule, ProfileRoutingModule]
})
export class ProfileModule {}
