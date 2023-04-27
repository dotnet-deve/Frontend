import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  private fullname$ = new BehaviorSubject<string>("");
  private roles$ = new BehaviorSubject<string>("");
  private ExpiryTime$ = new BehaviorSubject<string>("");
  constructor() { }

  public getRoleFromStore(){
    return this.roles$.asObservable();
  }

  public getFullNameFromStore(){
    return this.fullname$.asObservable();
  }

  public getExpieryTimeFromStore(){
    return this.ExpiryTime$.asObservable();
  }


  public setRoleFromStore(role:string){
    return this.roles$.next(role);
  }

  public setFullNameFromStore(fullName:string){
    return this.fullname$.next(fullName);
  }

  public setExpiryTimeFromStore(expiryTime:string){
    return this.ExpiryTime$.next(expiryTime);
  }
}

