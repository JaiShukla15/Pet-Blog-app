import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgChartjsModule } from 'ng-chartjs';
import { AppRoutingModule, RoutingComponents } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { HomeComponent } from "./Modules/home/home.component";

@NgModule({
  declarations: [AppComponent, RoutingComponents,HomeComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgChartjsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
