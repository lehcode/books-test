import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Inject, Injectable, InjectionToken } from '@angular/core'
import { Observable } from 'rxjs'
import { timeout } from 'rxjs/operators'

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout')

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  /**
   * Constructor
   * @param defaultTimeout The default timeout value in milliseconds, to be used if the 'timeout' header is not present
   * in the request.
   */
  constructor(@Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const timeoutValue = req.headers.get('timeout') || this.defaultTimeout
    const timeoutValueNumeric = Number(timeoutValue)

    return next.handle(req).pipe(timeout(timeoutValueNumeric))
  }
}
