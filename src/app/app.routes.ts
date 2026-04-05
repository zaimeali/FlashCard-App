import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { Home } from './components/home/home';
import { Dashboard } from './components/dashboard/dashboard';
import { Profile } from './components/auth/profile/profile';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
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
    }
];
