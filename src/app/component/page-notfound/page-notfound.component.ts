import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-page-notfound',
  templateUrl: './page-notfound.component.html',
  styleUrls: ['./page-notfound.component.scss']
})
export class PageNotfoundComponent {
  constructor(private location: Location) { }
  goBack() {
    this.location.back();
  }
}
