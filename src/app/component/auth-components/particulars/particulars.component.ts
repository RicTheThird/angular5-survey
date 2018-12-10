import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SurveyService } from '../../../service/survey.service';
import { LoggerUtil } from '../../../utils/logger-util';
import { COUNTRY_DIR } from '../../../const/endpoints.const';
import { Questions, UIQuestAnswerObj } from '../../../model/questions.model';
import { MatSnackBar } from '@angular/material';
import { SnackBarConfig } from '../../../const/snackBarConfig.const';
import { StorageService } from '../../../service/storage.service';
import { GeoLocationService } from '../../../service/geolocation.service';
import { ClientDetailsModel } from '../../../model/clientdetails.model';
import { IS_COMPLETED, SESSIONID } from '../../../const/enum.conts';
@Component({
  selector: 'app-particulars',
  templateUrl: './particulars.component.html',
  styleUrls: ['./particulars.component.scss']
})
export class ParticularsComponent implements OnInit {
  countries: Array<any>;
  template;
  currentLocation = null;
  clientDetModel: ClientDetailsModel;
  constructor(
    private fb: FormBuilder,
    private matSnackBar: MatSnackBar,
    private http: Http,
    private logger: LoggerUtil,
    private snackBar: MatSnackBar,
    private storageSvc: StorageService,
    private surveyService: SurveyService,
    private geoLocation: GeoLocationService,
    private router: Router) {
    http.get(COUNTRY_DIR).subscribe(data => {
      this.countries = data.json();
    });
  }

  questionnaireForm: FormGroup;
  jointApplicant: FormControl;
  mainApplicant: FormControl;
  appointedRep: FormControl;
  countryCode: FormControl;
  contactNum: FormControl;
  purchaseDate: FormControl;
  productType: FormControl;
  loaded = false;

  ngOnInit() {
    this.loaded = true;
    // if (this.storageSvc.getItemFromSession(IS_COMPLETED)) {
    //   this.router.navigate(['page/questionnaire'])
    // } else {
    //   if (this.storageSvc.getItemFromSession(SESSIONID)) {
    //     this.getLocation();
    //     this.surveyService.getClientDetails(this.storageSvc.getItemFromSession('SURVEY_ID')).subscribe(res => {
    //       if (res !== null) {
    //         this.createFormControls(res);
    //       }
    //     }, err => {
    //       this.snackBar.open('Error : ' + err, "Close", SnackBarConfig);
    //     });
    //   } else {
    //     this.router.navigate(['404']);
    //   }
    // }
  }

  createFormControls(res) {
    // console.log(JSON.stringify(res));
    this.jointApplicant = new FormControl({ value: this.joinJointsName(res), disabled: true });
    this.mainApplicant = new FormControl({ value: res.mainName, disabled: true });
    this.appointedRep = new FormControl({ value: res.farepName, disabled: true });
    this.productType = new FormControl({ value: res.productTypes, disabled: true });
    this.purchaseDate = new FormControl({ value: res.purchasedDate, disabled: true });
    this.countryCode = new FormControl(this.surveyService.countryCode !== null? this.surveyService.countryCode : '+65');
    this.contactNum = new FormControl(res.mobileNo, [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]);
    this.createForm();
  }

  joinJointsName(res): String {
    return [res.j1Name, res.j2Name, res.j3Name].filter(function (val) { return val !== null; }).join(', ');
  }

  createForm() {
    this.questionnaireForm = new FormGroup({
      jointApplicant: this.jointApplicant,
      mainApplicant: this.mainApplicant,
      appointedRep: this.appointedRep,
      countryCode: this.countryCode,
      contactNum: this.contactNum,
      purchaseDate: this.purchaseDate,
      productType: this.productType
    });
    this.loaded = true;
  }

  getLocation() {
    const options = { enableHighAccuracy: true };
    this.geoLocation.getLocation(options).subscribe(function (position) {
      this.currentLocation = position;
      ///this.logger.debug('Current Location', this.currentLocation.coords.latitude + ',' + this.currentLocation.coords.longitude);
    }, function (error) {
      this.errorMsg = error;
    });
  }

  proceed() {
    this.clientDetModel = new ClientDetailsModel();
    this.clientDetModel.clientSurveyId = this.storageSvc.getItemFromSession('SURVEY_ID');
    this.clientDetModel.mobileNumber = this.countryCode.value +''+ this.contactNum.value;
    this.clientDetModel.sourceLocation = this.currentLocation !== null ?
      (this.currentLocation.coords.latitude + ',' + this.currentLocation.coords.longitude) : null;
    this.storageSvc.saveItemToSession('CLIENT_DETAILS', JSON.stringify(this.clientDetModel));
    this.surveyService.cacheClient.mobileNo = this.contactNum.value;
    this.surveyService.countryCode = this.countryCode.value;
    this.router.navigate(['page/questionnaire']);
  }

}


