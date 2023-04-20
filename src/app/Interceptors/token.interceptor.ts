import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

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
          this.toast.warning({detail:"ERROR", summary:"token is expired ! Login again!"});
          this.route.navigate(['login']);
        }
      }
      return throwError(()=>new Error("some other errors!"));
    })

    );
   }
}
