import { Component, OnInit } from '@angular/core';
import {PostService} from '../../../Services/post.service';
import * as Chart from 'chart.js';
@Component({
  selector: 'app-most-pet',
  templateUrl: './most-pet.component.html',
  styleUrls: ['./most-pet.component.css']
})
export class MostPetComponent implements OnInit {
  canvas: any;
  ctx: any;
  public categories=[];
  public msg:string;
  public check:boolean=false;
  public percentags=[];
  public wait:boolean=false;
  constructor(private postService:PostService) { }

  ngOnInit() {
   this.wait=true;
    this.postService.getCategoriesData().then((data:any)=>{
      data.forEach(item=>{
       this.categories.push(item.category);
       this.percentags.push(item.percentages);
      });
      this.wait=false;
      this.canvas = document.getElementById('myChart');
      this.ctx = this.canvas.getContext('2d');
      let myChart = new Chart(this.ctx, {
        type: 'pie',
        data: {
          labels: this.categories,
          datasets: [{
            label: '',
            data: this.percentags,
            backgroundColor: [
              'rgba(55, 199, 12, 1)',
              'rgba(154, 232, 25, 23)',
              'rgba(215, 106, 06, 1)',
              'rbga(26,212,14,18)',
              'rbga(126,132,31,132)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: false
        }
      });
     }).catch(error=>{ 
       this.check=true;
       this.msg=error;
     })
  }
  onDone(){
    
  }
}
