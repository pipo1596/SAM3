import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable , of } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

  canDeactivate(component: CanComponentDeactivate, currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot) {
    if (nextState.url !== '/app/login') {
    return component.canDeactivate ? component.canDeactivate() : true;
    }
    else{
      return true;
    }
  }

}