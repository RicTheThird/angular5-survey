import { Headers, RequestOptions } from '@angular/http';
import { SESSIONID } from '../const/enum.conts';


function getHttpHeaders(): RequestOptions {
    const currentUser = JSON.parse(sessionStorage.getItem(SESSIONID));
    let token = currentUser !== null ? currentUser.session_id : null;
    const headers = new Headers({
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    });
    return new RequestOptions({ headers: headers });
}

export { getHttpHeaders };
