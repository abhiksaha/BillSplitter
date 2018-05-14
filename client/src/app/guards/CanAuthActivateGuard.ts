import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class CanAuthActivateGuard implements CanActivate {
	constructor(private router: Router, private authService: AuthService) {}
	/**
     * override canActivate
     * @returns {boolean}
     */
    canActivate() {
		return !this.authService.isLoggedIn();
    }
}