import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class CanAlwaysActivateGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {}
	/**
     * override canActivate
     * @returns {boolean}
     */
    canActivate() {
        //TODO return  value for routes
		if(!this.authService.isLoggedIn()){
			this.router.navigate(['/signin']);
			return true;
		}else{
			this.authService.userName = localStorage.getItem('user-name');
			return true;
		}
    }
}