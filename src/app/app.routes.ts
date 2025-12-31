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
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard.component';
import { ProjectsDashboardComponent } from './components/projects-dashboard/projects-dashboard.component';
import { ContactusFormComponent } from './components/contactus-form/contactus-form.component';
import { TestimonialsFormComponent } from './components/testimonials-form/testimonials-form.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { TermsComponent } from './components/terms/terms.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { PriceListComponent } from './components/price-list/price-list.component';
import { AnnouncementsFormComponent } from './components/announcements-form/announcements-form.component';
import { AnnouncementsListComponent } from './components/announcements-list/announcements-list.component';
import { ContactusListComponent } from './components/contactus-list/contactus-list.component';
import { TestimonialsListComponent } from './components/testimonials-list/testimonials-list.component';
import { RolesListComponent } from './components/roles-list/roles-list.component';
import { RolesFormComponent } from './components/roles-form/roles-form.component';
import { AdminDashboardContentComponent } from './components/admin-dashboard/admin-dashboardcontent.component';
import { PriceFormComponent } from './components/price-form/price-form.component';
import { StagingShowcaseComponent } from './components/staging-showcase/staging-showcase.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { BlogsComponent } from './components/blogs/blogs.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'property-upload', component: PropertyUploadComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'contactus-form', component: ContactusFormComponent },
  { path: 'our-blogs', component: BlogsComponent },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'admin-dashboardContent', pathMatch: 'full' },
      { path: 'admin-dashboardContent', component: AdminDashboardContentComponent },
      { path: 'aboutus', component: AboutusComponent },
      { path: 'contactus-list', component: ContactusListComponent },
      { path: 'contactus-form', component: ContactusFormComponent },
      { path: 'gallery', component: GalleryComponent },
      { path: 'blogs', component: TestimonialsListComponent },
      { path: 'users', component: ProfileComponent },
      { path: 'roles-list', component: RolesListComponent },
      { path: 'roles-form', component: RolesFormComponent },
      { path: 'announcement-list', component: AnnouncementsListComponent },
      { path: 'announcement-form', component: AnnouncementsFormComponent },
      { path: 'testimonials-list', component: TestimonialsListComponent },
      { path: 'testimonials-form', component: TestimonialsFormComponent },
      { path: 'price-list', component: PriceListComponent },
      { path: 'price-form', component: PriceFormComponent },
      { path: 'plans', component: PriceListComponent },
      { path: 'plans/create', component: PriceFormComponent },
      { path: 'plans/view/:id', component: PriceFormComponent }, // optional
      { path: 'plans/edit/:id', component: PriceFormComponent },  // optional
      { path: 'user-list', component: UserListComponent },
      { path: 'user-form', component: UserFormComponent },
      { path: 'user-form/:id', component: UserFormComponent },
    ]
  },

  { path: 'project-dashboard', component: ProjectsDashboardComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'staging', component: StagingShowcaseComponent }
];

