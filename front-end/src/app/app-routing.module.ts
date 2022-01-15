import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./Modules/page-not-found/page-not-found.component";
import { HeaderComponent } from "./Modules/header/header.component";
import { FooterComponent } from "./Modules/footer/footer.component";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./Modules/UserAuth/user-auth.module").then(m => m.UserAuthModule)
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./Modules/Dashboard/dashboard.module").then(
        m => m.DashboardModule
      )
  },
  {
    path: "**",
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
export const RoutingComponents = [HeaderComponent, PageNotFoundComponent,FooterComponent];
