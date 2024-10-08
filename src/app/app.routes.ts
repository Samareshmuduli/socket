import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ShowUsersComponent } from './show-users/show-users.component';
import { HeaderComponent } from './header/header.component';
import { ChartShowComponent } from './chart-show/chart-show.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {path:'',redirectTo:"/login",pathMatch:'full'},
    { path: 'showUsers', component: ShowUsersComponent },
    { path: 'header', component: HeaderComponent },
    { path: 'dashboard', component: ChartShowComponent,canActivate:[authGuard] }
];
