import { Injectable, Inject } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable()
export class LoggerUtil {
    
    debug(logHeader?, logBody?) {
        if (environment.showDebugLog) {
            console.log('DEBUG: ' + logHeader + '\n' + logBody);
        }
    }
}