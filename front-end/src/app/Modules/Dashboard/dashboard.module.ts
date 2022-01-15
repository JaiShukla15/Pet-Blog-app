import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponents } from "./dashboard-routing.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { SinglePostComponent } from './single-post/single-post.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { MostPetComponent } from './most-pet/most-pet.component';
import { InviteComponent } from './invite/invite.component';
import { DashboardComponent } from "./dashboard/dashboard.component";

@NgModule({
  declarations: [DashboardComponent,DashboardComponents, SinglePostComponent, NotificationsComponent, MostPetComponent, InviteComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ]
})
export class DashboardModule {}
