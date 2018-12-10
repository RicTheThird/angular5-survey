import { Component, HostListener } from '@angular/core';
import { IS_COMPLETED, SESSIONID } from './const/enum.conts';
const EXTMSG = 'Do you really want to exit the survey?  The provided response will not be saved.';
const IOSMSG = 'The survey responses are not saved.  Please redo survey.';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    return EXTMSG;
  }
}

window.onpagehide = function (event) {
  alert(IOSMSG);
}

window.onbeforeunload = function (e) {
  if(!sessionStorage.getItem(IS_COMPLETED) && sessionStorage.getItem(SESSIONID)){
    e = e || window.event;
    // For IE and Firefox prior to version 4
    if (e) {
      e.returnValue = EXTMSG;
    }
    // For Safari
    return EXTMSG;
  }
};
