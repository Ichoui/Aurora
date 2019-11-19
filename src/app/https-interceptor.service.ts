import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ONE_SIGNAL_REST_KEY } from '../environments/keep';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HttpsInterceptorService implements HttpInterceptor {

    constructor() {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

       if (req.url === `${environment.push_notifs}`) {
            console.log(req.url);
            req = req.clone({
                setHeaders: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Basic YmMxMTg1YzgtZTMwNy00NTQ1LTkyOGQtYmUwNmFhZTlhNzIw`,
                }
            });
            return next.handle(req).pipe(tap(console.log));
        }
      req = req.clone({
        setHeaders: {
          'Access-Control-Allow-Origin':'*',
          "Access-Control-Request-Headers": "content-type",
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
        return next.handle(req);
    }
}
