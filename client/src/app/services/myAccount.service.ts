import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Subject } from 'rxjs/Subject';
import { GroupModel } from '../components/myAccount/myAccount.model';
import { urlConsts } from '../constants';

@Injectable()
export class MyAccountService{
	
	constructor(private http: Http){
		
	}
	saveAccountDetails(data){
		const body = JSON.stringify(data);
        const headers = new Headers({'Content-Type': 'application/json'});
		return this.http.post(urlConsts.saveAccountDetailsData, body, {headers: headers})
			.map((res : Response) => res.json())
			.catch(this.handleError);
	}

	getUserAccountDetails(data){
		const body = JSON.stringify(data);
        const headers = new Headers({'Content-Type': 'application/json'});
		return this.http.post(urlConsts.getAccountDetailsData, body, {headers: headers})
			.map((res : Response) => res.json())
			.catch(this.handleError);
	}
	
	private handleError (error: any): Observable<any> {
        //TODO handle and show error
		let errBody = error.json();
		let errMsg = (errBody.error.message) ? errBody.error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error',
			errObj = { title: errBody.title, message: errMsg};
        return Observable.throw(errObj);
    }
	
}