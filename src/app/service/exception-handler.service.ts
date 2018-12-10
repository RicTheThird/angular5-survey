import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { NETWORK_ERR, DEFAULT_ERR } from '../const/custom-msg.const';
import { LoggerUtil } from '../utils/logger-util';
@Injectable()
export class ExceptionHandlerService {
    constructor(private logger: LoggerUtil) { }
    public throwError(error: Response | any): Observable<any> {
        let errMsg: string;
        this.logger.debug('http error',JSON.stringify(error));
        if (error instanceof Response) {
            if (error.status === 0) {
                errMsg = NETWORK_ERR;
            } else {
                try {
                    const body = error.json() || DEFAULT_ERR;
                    errMsg = body.error || JSON.stringify(body);
                } catch (e) {
                    errMsg = DEFAULT_ERR;
                }
            }
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg.replace(/{|}|"|:/g,''));
    }
}