import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the token directly from localStorage to avoid circular dependency
  const token = localStorage.getItem('token');

  // Get the current language directly from localStorage to avoid initialization timing issues
  const currentLang = localStorage.getItem('sg_ia_language') || 'es';

  // Build headers object
  const headers: { [key: string]: string } = {
    'Accept-Language': currentLang
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Clone the request and add headers
  req = req.clone({ setHeaders: headers });

  return next(req);
};
