import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { SplitComponent } from './components/split/split.component';
import { BillComponent } from './components/bill/bill.component'
import { AdminComponent } from './components/admin/admin.component';
import { HistoryComponent } from './components/history/history.component';
import { MyAccountComponent } from './components/myAccount/myAccount.component';
import { SigninComponent } from './components/auth/signin.component';
import { SignupComponent } from './components/auth/signup.component';

import { CanActivateGuard } from './guards/CanActivateGuard';
import { CanAuthActivateGuard } from './guards/CanAuthActivateGuard';
import { CanAlwaysActivateGuard } from './guards/CanAlwaysActivateGuard';

const APP_ROUTES : Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full', canActivate:[ CanAlwaysActivateGuard ]},
	{ path: 'signin', component: SigninComponent, canActivate:[CanAuthActivateGuard]},
	{ path: 'signup', component: SignupComponent, canActivate:[CanAuthActivateGuard]},
	{ path: 'home', component: HomeComponent, canActivate:[ CanAlwaysActivateGuard ]},
	{ path: 'split', component: SplitComponent, canActivate:[ CanActivateGuard ]},	
	{ path: 'bill', component: BillComponent, canActivate:[ CanActivateGuard ]},	
	{ path: 'admin', component: AdminComponent, canActivate:[ CanAlwaysActivateGuard ]},
	{ path: 'history', component: HistoryComponent, canActivate:[ CanAlwaysActivateGuard ]},
	{ path: 'my-account', component: MyAccountComponent, canActivate:[ CanAlwaysActivateGuard ]},
	{ path: '**', redirectTo: '/home', canActivate:[ CanAlwaysActivateGuard ] }
]

export const routing = RouterModule.forRoot(APP_ROUTES);