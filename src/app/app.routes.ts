// import { Routes } from '@angular/router';

// export const routes: Routes = [
//   { path: '', redirectTo: '/home', pathMatch: 'full' },
//   { path: 'home', loadComponent: () => import('./components/mainpage/home/home.component').then(c => c.HomeComponent) },
//   { path: 'login', loadComponent: () => import('./components/mainpage/login/login.component').then(c => c.LoginComponent) },
//   { path: 'register', loadComponent: () => import('./components/mainpage/register/register.component').then(c => c.RegisterComponent) },
// //   { path: 'features', loadComponent: () => import('./pages/features/features.component').then(c => c.FeaturesComponent) },
// //   { path: 'pricing', loadComponent: () => import('./pages/pricing/pricing.component').then(c => c.PricingComponent) },
// //   { path: 'testimonials', loadComponent: () => import('./pages/testimonials/testimonials.component').then(c => c.TestimonialsComponent) },
// //   { path: 'team', loadComponent: () => import('./pages/team/team.component').then(c => c.TeamComponent) },
// //   { path: 'faq', loadComponent: () => import('./pages/faq/faq.component').then(c => c.FaqComponent) },
// //   { path: 'signin', loadComponent: () => import('./pages/signin/signin.component').then(c => c.SigninComponent) },
// //   { path: 'documentation', loadComponent: () => import('./pages/documentation/documentation.component').then(c => c.DocumentationComponent) },
// //   { path: 'blog', loadComponent: () => import('./pages/blog/blog.component').then(c => c.BlogComponent) },
// //   { path: 'press', loadComponent: () => import('./pages/press/press.component').then(c => c.PressComponent) },
// //   { path: 'affiliation', loadComponent: () => import('./pages/affiliation/affiliation.component').then(c => c.AffiliationComponent) },
// //   { path: 'terms', loadComponent: () => import('./pages/terms/terms.component').then(c => c.TermsComponent) },
// //   { path: '**', redirectTo: '/home' } // Redirect to home for any unknown routes
// ];
import { Routes } from '@angular/router';
import { HomeComponent } from './components/mainpage/home/home.component';
import { LoginComponent } from './components/mainpage/login/login.component';
import { RegisterComponent } from './components/mainpage/register/register.component';
import { DashboardComponent } from './components/mainpage/dashboard/dashboard.component';
import { PropertyUploadComponent } from './components/property-upload/property-upload.component';
import { ChatComponent } from './components/mainpage/chat/chat.component';
import { ProfileComponent } from './components/mainpage/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'property-upload', component: PropertyUploadComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'profile', component:ProfileComponent}
];
