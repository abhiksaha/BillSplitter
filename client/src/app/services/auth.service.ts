import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { User } from "../components/auth/user.model";
import { urlConsts } from '../constants';

@Injectable()
export class AuthService {
	
	userName:string = '';
	
    constructor(private http: Http) {}

    signup(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(urlConsts.signup, body, {headers: headers})
			.map((res : Response) => res.json())			
			.catch(this.handleError);
    }

    signin(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(urlConsts.signin, body, {headers: headers})
			.map((res : Response) => res.json())
			.catch(this.handleError);
    }
	
    isLoggedIn(): boolean {
		if(localStorage.getItem('user-token')) 
			return true 
		else
			return false;
    }
	
	private handleError (error: any): Observable<any> {
		let errBody = error.json();
		let errMsg = (errBody.error.message) ? errBody.error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error',
			errObj = { title: errBody.title, message: errMsg};
        return Observable.throw(errObj);
    }
}