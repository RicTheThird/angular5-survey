import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { getHttpHeaders } from '../utils/http-util';
import { environment } from '../../environments/environment';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { QUEST_TEMPL_ENDPOINT, INTRO_DIR, COUNTRY_DIR, SAVE_QUEST_ENDPOINT, CLIENT_DETAILS, CLIENT_DET_INQ } from '../const/endpoints.const';
import { ExceptionHandlerService } from '../service/exception-handler.service';
import { LoggerUtil } from '../utils/logger-util';
import { ObserveOnSubscriber } from 'rxjs/operators/observeOn';
@Injectable()
export class SurveyService {
    cacheTemplate = null;
    cacheClient = null;
    countryCode = null;
    constructor(private http: Http,
        private logger: LoggerUtil,
        private exceptionHandler: ExceptionHandlerService) { }

    getClientDetails(surveyId): Observable<any> {
        if (this.cacheClient !== null) {
            this.logger.debug('clients from cache');
            return Observable.of(this.cacheClient);
        }
        this.logger.debug('clients from service');
        return this.http.get(environment.apiEndPoint + CLIENT_DET_INQ, getHttpHeaders())
            .map((res: Response) => {
                this.cacheClient = res.json();
                return res.json();
            }).catch((err) => this.exceptionHandler.throwError(err));
    }

    updateClientDetails(data): Observable<any> {
        return this.http.post(environment.apiEndPoint + CLIENT_DETAILS, JSON.stringify(data), getHttpHeaders())
            .map((res: Response) => {
                return res.json();
            }).catch((err) => this.exceptionHandler.throwError(err));
    }

    getIntroTemplate(): Observable<any> {
        try {
            return Observable.of(this.http.get(INTRO_DIR).subscribe(data => {
                return data.text();
            }));
        } catch (e) {
            return this.exceptionHandler.throwError(e);
        }
    };

    getCountryCode(): Observable<any> {
        try {
            return Observable.of(this.http.get(COUNTRY_DIR).subscribe(data => {
                return data.json();
            }));
        } catch (e) {
            return this.exceptionHandler.throwError(e);
        }
    }

    getQuestionTemplate(): Observable<any> {
        if (this.cacheTemplate !== null) {
            this.logger.debug('questions from cache');
            return Observable.of(this.cacheTemplate);
        }
        this.logger.debug('questions from service');
        return this.http.get(environment.apiEndPoint + QUEST_TEMPL_ENDPOINT, getHttpHeaders())
            .map((res: Response) => {
                this.cacheTemplate = res.json();
                return res.json();
            }).catch((err) => this.exceptionHandler.throwError(err));
    }

    submitAnswers(answers): Observable<any> {
        return this.http.post(environment.apiEndPoint + SAVE_QUEST_ENDPOINT, JSON.stringify(answers), getHttpHeaders())
            .map((res: Response) => {
                return res.json();
            }).catch((err) => this.exceptionHandler.throwError(err));
    }

}