import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { urlConsts } from '../constants';

@Injectable()
export class AutocompleteService{
	
	constructor(private http: Http) {
    }
	
	getAutocompleteList(param, serviceName){
		const body = JSON.stringify(param);
        const headers = new Headers({'Content-Type': 'application/json'});
		return this.http.post(urlConsts[serviceName], body, {headers: headers})
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