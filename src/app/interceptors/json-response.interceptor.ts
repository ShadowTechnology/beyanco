import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, map } from 'rxjs';

export function jsonResponseInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {
  return next(req).pipe(
    map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        let newBody = event.body;

        // ✅ Case 1: AWS returns a JSON string (e.g., "{\"status\":\"UP\"}")
        if (typeof newBody === 'string') {
          try {
            const parsed = JSON.parse(newBody);
            newBody = parsed;
          } catch {
            // Leave it as string if not valid JSON
          }
        }

        // ✅ Case 2: Handle weird content types (text/plain, empty, etc.)
        const contentType = event.headers.get('Content-Type') || '';
        if (contentType.includes('text/plain') && typeof newBody === 'string') {
          try {
            newBody = JSON.parse(newBody);
          } catch {
            // ignore if not valid JSON
          }
        }

        // ✅ Return cloned response if we modified it
        if (newBody !== event.body) {
          return event.clone({ body: newBody });
        }
      }

      return event;
    })
  );
}
