import { Routes } from '@angular/router';
import { TermsPage } from './components/terms-page/terms-page';
import { PrivacyPolicyPage } from './components/privacy-policy-page/privacy-policy-page';
import { authGuard, loginGuard } from './utils/auth-guard/auth-guard';
import { Routes as RoutesEnum } from './utils/auth-guard/constants/routes';

export const routes: Routes = [
    {
        path: RoutesEnum.LOGIN,
        loadComponent: () => import('./components/auth/login/login').then(m => m.Login),
        canActivate: [loginGuard]
    },
    {
        path: RoutesEnum.TERMS,
        component: TermsPage
    },
    {
        path: RoutesEnum.PRIVACY_POLICY,
        component: PrivacyPolicyPage
    },
    {
        path: RoutesEnum.HOME,
        loadComponent: () => import('./components/home/home').then(m => m.Home),
        canActivate: [authGuard]
    },
    {
        path: RoutesEnum.DASHBOARD,
        loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard),
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        loadComponent: () => import('./components/auth/profile/profile').then(m => m.Profile),
        canActivate: [authGuard]
    },
    {
        path: 'flashcards/create/group',
        loadComponent: () => import('./components/flashcards/group-detail/group-detail').then(m => m.GroupDetail),
        canActivate: [authGuard]
    },
    {
        path: 'flashcards/edit/:id',
        loadComponent: () => import('./components/flashcards/group-detail/group-detail').then(m => m.GroupDetail),
        canActivate: [authGuard]
    },
    {
        path: 'flashcards/:id',
        loadComponent: () => import('./components/flashcards/flashcards').then(m => m.Flashcards),
        canActivate: [authGuard]
    },
    // {
    //     path: '**',
    //     loadComponent: () => import('./components/home/home').then(m => m.Home),
    //     canActivate: [ authGuard ]
    // }, // wildcard for default
    // also add a logic where if the user is logged in and tries to access login page, redirect to home page
];
