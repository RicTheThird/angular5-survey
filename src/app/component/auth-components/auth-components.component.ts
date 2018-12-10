import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { LoggerUtil } from '../../utils/logger-util';
@Component({
  selector: 'app-auth-components',
  templateUrl: './auth-components.component.html'
})
export class AuthComponentsComponent implements OnInit, OnDestroy {
  idleState = '';
  timedOut = false;
  lastActive;
  lastPing?: Date = null;
  msg = 'hey';
  idleableTime = 20; // in seconds
  constructor(
    private router: Router,
    private idle: Idle,
    private loggerUtil: LoggerUtil) {
    idle.setIdle(this.idleableTime);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.watch();
    this.loggerUtil.debug('Idle watch started');
    idle.onIdleStart.subscribe(() => {
      this.msg = 'idle started';
      // this.loggerUtil.debug('User has been idle. Log off session');
      // this.stopIdleWatch();
      // this.router.navigate(['survey/']);
    });
    idle.onIdleEnd.subscribe(() => this.msg = 'No longer idle.');

    
    idle.onInterrupt.subscribe(() => {
      this.msg = 'interrupted';
    });

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.loggerUtil.debug('Idle watch destroyed')
    this.stopIdleWatch();
  }

  stopIdleWatch() {
    this.timedOut = true;
    this.idle.onTimeout.observers.length = 0;
    this.idle.onIdleStart.observers.length = 0;
    this.idle.onIdleEnd.observers.length = 0;
    this.idle.stop();
    this.idle.ngOnDestroy();
  }


}
