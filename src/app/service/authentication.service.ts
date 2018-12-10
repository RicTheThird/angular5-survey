import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../environments/environment';
import { ExceptionHandlerService } from '../service/exception-handler.service';
import { LoggerUtil } from '../utils/logger-util';
import { StorageService } from '../service/storage.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AUTH_CLIENT, VALIDATE_LINK } from '../const/endpoints.const';
import { SESSIONID } from '../const/enum.conts';

@Injectable()
export class AuthenticationService {
    authHeaders = new Headers({ 'Content-Type': 'application/json' });
    constructor(private http: Http,
        private storageService: StorageService,
        private exceptionHandler: ExceptionHandlerService,
        private logger: LoggerUtil) { }

    authenticate(clientId): Observable<any> {
        return this.http.post(environment.apiEndPoint + AUTH_CLIENT + clientId, { headers: this.authHeaders })
            .map((res: Response) => {
                const token = res.json().accessToken;
                if (token) {
                    this.storageService.saveItemToSession(SESSIONID, JSON.stringify(
                        { clientId: clientId, session_id: res.json().accessToken }
                    ));
                    this.logger.debug('auth response', JSON.stringify(res.json()));
                    return res.json();
                } else {
                    return false;
                }
            }).catch((err) => this.exceptionHandler.throwError(err));
    }

    validateLink(surveyId): Observable<any> {
        return this.http.post(environment.apiEndPoint + VALIDATE_LINK + surveyId, { headers: this.authHeaders })
            .map((res: Response) => {
                return res.json();
            }).catch((err) => this.exceptionHandler.throwError(err));
    }
}