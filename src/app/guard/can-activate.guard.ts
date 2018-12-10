import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { StorageService } from '../service/storage.service';
import { SESSIONID } from '../const/enum.conts';

@Injectable()
export class CanActivateAuth implements CanActivate {

    constructor(
        private router: Router,
        private storageService: StorageService) { }

    canActivate() {
        return this.storageService.getItemFromSession(SESSIONID) === null;
    }
}