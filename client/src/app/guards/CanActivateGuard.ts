import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SplitService } from '../services/split.service';
import { AuthService } from '../services/auth.service';


@Injectable()
export class CanActivateGuard implements CanActivate {
	constructor(private splitService: SplitService, private router: Router,  private authService: AuthService) {}
	/**
     * override canActivate
     * @returns {boolean}
     */
    canActivate() {	
		this.authService.userName = localStorage.getItem('user-name');
		if(!this.splitService.isHomePageBasicSplitDataAvailable && !this.splitService.isHistoryDataAvailable ){
			this.router.navigate(['/home']);
			return true;
		}else{
			return true;
		}
    }
}