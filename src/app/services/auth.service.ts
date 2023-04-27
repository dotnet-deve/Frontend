import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../model/token-Apimodel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:string = "http://localhost:5000/api/User/";
  private payload:any;
  private tokenExpiryTime!: 3600;
  constructor(private http: HttpClient, private router:Router) { 
    this.payload = this.decodeToken();
  }

  signUp(userObj:any){
    return this.http.post<any>(`${this.baseUrl}register`, userObj);
  }

  signOut(){
    localStorage.clear();
    this.router.navigate(['login']);
  }

  login(loginObj:any){
    return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj);
  }

  storeToken(tokenValue:string){
    localStorage.setItem('accessToken', tokenValue);
  }

  storeRefreshToken(tokenValue:string){
    localStorage.setItem('refreshToken', tokenValue);
  }

  getToken(){
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem('accessToken');
  }

  decodeToken(){
    var jwtHelper = new JwtHelperService();
    const token = this .getToken()!;
    return jwtHelper.decodeToken(token);
  }

  getFullNameFromToken(){
    if(this.payload){
      return this.payload.unique_name
    }
  }

  getRoleFromToken(){
    if(this.payload){
      return this.payload.role 
    }
  }

 renewToken(tokenApi:TokenApiModel){
  return this.http.post<any>(`${this.baseUrl}refresh`, tokenApi);
 }

}
