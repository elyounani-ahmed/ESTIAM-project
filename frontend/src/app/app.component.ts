import { Component } from '@angular/core';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  entries= [
    {
      name:'login',
      link:'login'
    },
    {
      name:'Register',
      link:'register'
    }
  ];

  constructor (private router: Router){}
  navigateTo(value:any) {
    this.router.navigate(['../', value]);
  }
}
