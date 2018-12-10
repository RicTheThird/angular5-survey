import { Component, OnInit } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
// import { AuthenticationService } from '../../_services/authentication.service';
// import { BlockUI, NgBlockUI } from 'ng-block-ui';
@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css'],
  providers: [RouterModule]
})
export class TopnavComponent implements OnInit {
  imageColor;
  messages;
  topNavTitle = '';
  topNavLogoUrl = 'assets/img/maybank-logo.png';
  redirectLogin = '/survey';
  showLink = true;
  userName: string;
  isClassVisible = false;
  // @BlockUI() blockUI: NgBlockUI;
  user = {};
  constructor(private router: Router) { }

  ngOnInit() {
    }
}

