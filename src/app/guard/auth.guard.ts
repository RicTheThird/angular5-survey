import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { StorageService } from '../service/storage.service';
import { SESSIONID } from '../const/enum.conts';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private storageService: StorageService) { }

    canActivate() {
        if (this.storageService.getItemFromSession(SESSIONID) !== null){
            return true;
        }
        this.router.navigate(['survey/auth']);
        return false;
    }
}