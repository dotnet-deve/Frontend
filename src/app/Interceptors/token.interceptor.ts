import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { TokenApiModel } from '../model/token-Apimodel';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public auth:AuthService, public toast:NgToastService, public route: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.auth.getToken();
    if(myToken){
      request = request.clone({
        setHeaders: {Authorization:`Bearer ${myToken}`}
      })
      
    }

    return next.handle(request)
    .pipe(catchError((err:any)=>{
      if(err instanceof HttpErrorResponse){
        if(err.status == 401){
          // this.toast.warning({detail:"ERROR", summary:"token is expired ! Login again!"});
          // this.route.navigate(['login']);
         return  this.handleUnAuthorizedError(request, next)
        }
      }
      return throwError(()=>new Error("some other errors!"));
    })

    );
   }
   handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler){
    let tokenApiModel = new TokenApiModel();
    tokenApiModel.accessToken = this. auth.getToken()!;
    tokenApiModel.refreshToken = this.auth.getRefreshToken()!;
    return this.auth.renewToken(tokenApiModel)
    .pipe(switchMap((data:TokenApiModel)=>{
      this.auth.storeRefreshToken(data.refreshToken);
      this.auth.storeToken(data.accessToken);
      req = req.clone({
        setHeaders: {Authorization:`Bearer ${data.refreshToken}`}
      })
      return next.handle(req);
    }),
    catchError((err)=>{
      return throwError(()=>{
          this.toast.warning({detail:"ERROR", summary:"token is expired ! Login again!"});
          this.route.navigate(['login']);
      })
    })
    )
   }
}
