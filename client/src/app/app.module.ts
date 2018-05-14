import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// App
import { AppComponent } from './app.component';
import { routing } from './app.routing';
//guards
import { CanActivateGuard } from './guards/CanActivateGuard';
import { CanAuthActivateGuard } from './guards/CanAuthActivateGuard';
import { CanAlwaysActivateGuard } from './guards/CanAlwaysActivateGuard';
//Components
import { AdminComponent } from './components/admin/admin.component';
import { SideBarComponent } from './components/sidebar/side-bar.component'
import { HomeComponent } from './components/home/home.component';
import { SplitComponent } from './components/split/split.component';
import { BillComponent } from './components/bill/bill.component';
import { HistoryComponent } from './components/history/history.component';
import { MyAccountComponent } from './components/myAccount/myAccount.component';
import { SplitterAutoCompleteComponent } from './components/autocomplete/autocomplete.component';
import { SigninComponent } from './components/auth/signin.component';
import { SignupComponent } from './components/auth/signup.component';

//service
import { AuthService} from './services/auth.service';
import { SplitService } from './services/split.service';
import { MyAccountService } from './services/myAccount.service';
import { AdminService } from './services/admin.service';
import { AutocompleteService} from './services/autocomplete.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SplitComponent,
    SideBarComponent,
    AdminComponent,
	BillComponent,
	HistoryComponent,
	MyAccountComponent,	
	SplitterAutoCompleteComponent,
	SigninComponent,
	SignupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
	ReactiveFormsModule,
    HttpModule,
	routing
  ],
  providers: [
    SplitService,
    CanActivateGuard,
	CanAuthActivateGuard,
	CanAlwaysActivateGuard,
    AdminService,
	AutocompleteService,
	MyAccountService,
	AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
