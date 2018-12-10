import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, animate, style, stagger } from '@angular/animations';
import { SurveyService } from '../../service/survey.service';
import { GeoLocationService } from '../../service/geolocation.service';
import { AuthenticationService } from '../../service/authentication.service';
import { LoggerUtil } from '../../utils/logger-util';
import { MatSnackBar } from '@angular/material';
import { SnackBarConfig } from '../../const/snackBarConfig.const';
import { StorageService } from '../../service/storage.service';
import { environment } from '../../../environments/environment';
import { MessageArchivedComponent } from '../../utils/custom-snackbar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('200ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ transform: 'translateY(-100%)' }))
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.8s 1s', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  errorMsg: string;
  currentLocation: Coordinates = null;
  surveyId;
  isReady = false;
  isSurveyActive = false;
  entryForm: FormGroup;
  nricNo: FormControl;
  introTemplate = `<p>Loading...</p>`;

  constructor(private fb: FormBuilder, private http: Http,
    private authService: AuthenticationService,
    private logger: LoggerUtil,
    private snackBar: MatSnackBar,
    private storageSvc: StorageService,
    private router: Router, private surveyService: SurveyService) {
  }

  ngOnInit() {
    console.log('Active env : ' + environment.envName);
    this.storageSvc.clearItemsToSession(['sessionId', 'is_completed', 'SURVEY_ID', 'CLIENT_DETAILS']);
    this.surveyService.cacheClient = null;
    this.surveyService.countryCode = null;
    try {
      this.createFormControls();
      this.createForm();
      this.http.get('assets/data/intro.txt').subscribe(data => {
        this.introTemplate = data.text(); //.replace('surveyExpiry', res.surveyEndDate);
      });
    } catch (e) {
      this.snackBar.open('Error : ' + e, "Close", SnackBarConfig);
    }
  }

  createFormControls() {
    this.nricNo = new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)]);
  }

  createForm() {
    this.entryForm = new FormGroup({
      nricNo: this.nricNo,
    });
    this.entryForm.markAsTouched();
  }

  keyDownHandler(event) {
    if (event.which === 32)
      event.preventDefault();
  }

  proceed() {

    
    this.isReady = true;
    const auth = {
      username: this.nricNo.value,
      password: "Password1"
    }
    // this.authService.authenticate(auth.username).subscribe(res => {
    //   if (res) {
    //     let clientSurveyId = res.clientSurveyId;
    //     this.authService.validateLink(res.clientSurveyId).subscribe(res => {
    //       if (res) {
    //         if (res.isLinkValid) {
    //           this.introTemplate = this.introTemplate.replace('surveyExpiry', res.surveyEndDate);
    //           this.introTemplate = this.introTemplate.replace('surveyExpiryCh', res.surveyEndDate);
    //           this.storageSvc.saveItemToSession('SURVEY_ID', clientSurveyId)
    //           this.isReady = true;
    //         } else {
    //           this.snackBar.open('The survey has ended. Thank you for supporting Maybank.', 'Close', SnackBarConfig);
    //         }
    //       }
    //     }, err => {

    //       this.snackBar.openFromComponent(MessageArchivedComponent, {
    //         data: err.toString(),
    //         horizontalPosition: 'center',
    //         verticalPosition: 'top',
    //         duration: 5000
    //       });
    //     });
    //   }
    // }, err => {
    //   this.snackBar.openFromComponent(MessageArchivedComponent, {
    //     data: err.toString(),
    //     horizontalPosition: 'center',
    //     verticalPosition: 'top',
    //     duration: 5000
    //   });
    // });
  }

  gotoPP() {
    this.router.navigate(['/page/particulars']);
  }

}
