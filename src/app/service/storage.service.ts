
import { Injectable, Inject } from '@angular/core';
@Injectable()
export class StorageService {
    constructor() { }
    
    saveObjToSession(key, objData) {
        sessionStorage.setItem(key, objData);
    }

    saveItemToSession(key, item) {
        sessionStorage.setItem(key, item);
    }

    getObjFromSession(key): any {
        if (sessionStorage.getItem(key) !== undefined && sessionStorage.getItem(key) !== null) {
            return JSON.parse(sessionStorage.getItem(key))
        }
        return null;
    }

    getItemFromSession(key): any {
        if (sessionStorage.getItem(key) !== undefined && sessionStorage.getItem(key) !== null) {
            return sessionStorage.getItem(key);
        }
        return null;
    }

    clearItemsToSession(itemKeys) {
        if (itemKeys !== null && itemKeys.length > 0) {
            for (const key of itemKeys) {
                sessionStorage.removeItem(key);
            }
        }
    }

}
