import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { Home } from './components/home/home';
import { Dashboard } from './components/dashboard/dashboard';
import { Profile } from './components/auth/profile/profile';
import { Flashcards } from './components/flashcards/flashcards';
import { GroupDetail } from './components/flashcards/group-detail/group-detail';
import { TermsPage } from './components/terms-page/terms-page';
import { PrivacyPolicyPage } from './components/privacy-policy-page/privacy-policy-page';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'terms',
        component: TermsPage
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyPage
    },
    {
        path: '',
        component: Home
    },
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: 'profile',
        component: Profile
    },
    {
        path: 'flashcards/create/group',
        component: GroupDetail
    },
    {
        path: 'flashcards/edit/:id',
        component: GroupDetail
    },
    {
        path: 'flashcards/:id',
        component: Flashcards
    }
];
