import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { Location } from '@angular/common';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { trigger, transition, animate, style } from '@angular/animations'
import { SnackBarConfig } from '../../../const/snackBarConfig.const';
import { SurveyService } from '../../../service/survey.service';
import { DialogComponent } from '../../dialog/dialog.component';
import { Answers, Questions, UIQuestAnswerObj, QuestionAnswers } from '../../../model/questions.model';
import { StorageService } from '../../../service/storage.service';
import { IS_COMPLETED, SESSIONID } from '../../../const/enum.conts';
import { DATATABLE_DIR } from '../../../const/endpoints.const';
import { KEY_TABLE } from '../../../const/key-table.const';
declare var jQuery: any;
type Orientation = ('next' | 'prev');

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition('void => next', [
        style({ transform: 'translateX(100%)' }),
        animate('200ms ease-in', style({ transform: 'translateX(0%)' }))
      ]),
      transition('void => prev', [
        style({ transform: 'translateX(0%)' }),
        animate('200ms ease-in', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class QuestionnaireComponent implements OnInit {
  countries: Array<any>;
  orientation: Orientation;
  template;
  questionnaireForm: FormGroup[] = [];
  questionnaires: UIQuestAnswerObj[] = [];
  questionnaireCardsIsVisible = [];
  questToAnswers: QuestionAnswers[] = [];
  answers: Answers[] = [];
  isCompleted = false;
  dataTable = [];
  constructor(
    public dialog: MatDialog,
    public http: Http,
    public location: Location,
    public router: Router,
    public renderer: Renderer2,
    public snackBar: MatSnackBar,
    public elementRef: ElementRef,
    public storageService: StorageService,
    public surveyService: SurveyService) { }

  ngOnInit() {
    if (this.storageService.getItemFromSession(SESSIONID)) {
      this.isCompleted = this.storageService.getItemFromSession(IS_COMPLETED) === null ? false : this.storageService.getItemFromSession(IS_COMPLETED);
      this.surveyService.getQuestionTemplate().subscribe(res => {
        this.questionsToUi(res);
      }, err => {
        this.snackBar.open('Error :' + err.toString(), 'Close', SnackBarConfig);
      });
      //this.http.get(DATATABLE_DIR).subscribe(data => {
      //  this.dataTable = data.json();
      //});
      this.dataTable = KEY_TABLE;
    } else {
      this.router.navigate(['404']);
    }
  }

  showDialog(msg?) {
    this.dialog.open(DialogComponent, {
      data: {
        template: msg
      }
    });
  }

  questionsToUi(res: Questions[]) {
    try {
      if (res !== null && res.length > 0) {
        for (let i = 1; i < res.length; i++) {
          let temp = res.filter(function (e) { return e.accessSourceSub === i.toString(); });
          let questObj: UIQuestAnswerObj = {
            parentQuestion: temp[0],
            subQuestions: temp.length > 1 ? temp.splice(1, temp.length - 1) : null
          };
          if (questObj.parentQuestion !== undefined) {
            this.questionnaires.push(questObj);
          }
          // console.log('UIQuestionnaires : ' + JSON.stringify(this.questionnaires));
        }
      }
      let formGrp: FormGroup;
      for (let ques of this.questionnaires) {
        //ques.parentQuestion.questionText = ques.parentQuestion.questionText.replace('\\', '');
        let formControlsArr: Questions[] = [];
        this.questionnaireCardsIsVisible.push(false);
        if (ques.parentQuestion.questionType === 'radio' && ques.parentQuestion.answers.length > 0) {
          formControlsArr.push(ques.parentQuestion);
          ques.parentQuestion.answers.forEach(ans => {
            this.answers.push(ans);
          });
          this.questToAnswers.push(this.createAnswerObj(ques.parentQuestion));
        }
        if (ques.subQuestions !== null && ques.subQuestions.length > 0) {
          for (let subQ of ques.subQuestions) {
            subQ.questionText = subQ.questionText.replace('\\', '');
            if ((subQ.questionType === 'radio' && subQ.answers.length > 0) || subQ.questionType === 'textarea' || subQ.questionType === 'text') {
              formControlsArr.push(subQ);
              this.questToAnswers.push(this.createAnswerObj(subQ));
              subQ.answers.forEach(ans => {
                this.answers.push(ans);
              });
            }
          }
        }
        formGrp = this.toFormGroup(formControlsArr);
        this.questionnaireForm.push(formGrp);
      }
      this.questionnaireCardsIsVisible[0] = true;
    } catch (e) {
      this.snackBar.open('Error: ' + e, 'Close', SnackBarConfig);
    }
  }

  toFormGroup(questions: Questions[]) {
    let group: any = {};

    questions.forEach(question => {
      group[question.questionCode] = question.isMandatory ? new FormControl(null, Validators.required) : new FormControl(null);
    });
    return new FormGroup(group);
  }

  resetCards() {
    for (let i = 0; i < this.questionnaireCardsIsVisible.length; i++) {
      this.questionnaireCardsIsVisible[i] = false;
    }
  }

  createAnswerObj(quest: Questions): QuestionAnswers {
    return {
      questionAnswerId: null,
      questionId: quest.questionId,
      questionCode: quest.questionCode,
      questionType: quest.questionType,
      answerId: null,
      answerCode: null,
      referenceId: null,
      answerComment: null,
    }
  }

  getAnswerIdByAnswerCode(answerCode) {
    if (this.answers !== null && this.answers.length > 0) {
      let res = this.answers.filter(function (e) { return e.answerCode === answerCode });
      if (res.length > 0) {
        return res[0].answerId;
      } else {
        return 0;
      }
    }
    return 0;
  }


  radioChange(index, questionCode, answerCode, subQuest) {
    if ((subQuest !== null && subQuest[0] !== null) && (subQuest[0].parentQuestionCode === questionCode)) {
      if (answerCode === 'rad_no') {
        this.questionnaireForm[index].controls[subQuest[0].questionCode].setValidators(Validators.required);
        this.questionnaireForm[index].controls[subQuest[0].questionCode].updateValueAndValidity();
      } else {
        this.questionnaireForm[index].controls[subQuest[0].questionCode].setValidators(null);
        this.questionnaireForm[index].controls[subQuest[0].questionCode].setValue(null);
        this.questionnaireForm[index].controls[subQuest[0].questionCode].updateValueAndValidity();
      }
    }
  }

  navigate(index, orientation) {
    try {
      if (index >= 0 && index < this.questionnaires.length) {
        this.resetCards();
        this.questionnaireCardsIsVisible[index] = true;
      } else if (index < 0) {
        this.location.back();
        return;
      }
      //submit
      if (index === this.questionnaires.length) {
        if (orientation === 'next') {
          this.questionnaireForm.forEach(qForm => {
            let qFormValue = qForm.value;
            this.questToAnswers.forEach(q => {
              Object.keys(qFormValue).forEach(key => {
                if (key === q.questionCode) {
                  q.referenceId = Number(this.storageService.getItemFromSession('SURVEY_ID'));
                  if (q.questionType === 'textarea' || q.questionType === 'text') {
                    q.answerComment = qFormValue[key];
                  } else {
                    q.answerCode = qFormValue[key];
                  }
                  q.answerId = this.getAnswerIdByAnswerCode(q.answerCode)
                }
              });
            });
          });
          this.storageService.saveItemToSession(IS_COMPLETED, 'true');
          this.surveyService.updateClientDetails(this.storageService.getObjFromSession('CLIENT_DETAILS')).subscribe(res => {
            if (res) {
              this.surveyService.cacheClient = null;
              this.surveyService.submitAnswers(this.questToAnswers).subscribe(res => {

                this.isCompleted = true;
              }, err => {
                this.snackBar.open('Error: ' + err.toString(), 'Close', SnackBarConfig);
              });
            } else {
              this.snackBar.open('Unable to save. Please try again later', 'Close', SnackBarConfig);
            }
          }, err => {
            this.snackBar.open(err, 'Close', SnackBarConfig);
          });
        }
      }
    } catch (e) {
      this.snackBar.open('Error: ' + e, 'Close', SnackBarConfig);
    }
  }

  close() {
    window.top.close();
  }

}
