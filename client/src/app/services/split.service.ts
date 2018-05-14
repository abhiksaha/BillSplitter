import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Subject } from 'rxjs/Subject';
import { HomePageData } from '../components/home/home.model';
import { urlConsts } from '../constants';

@Injectable()
export class SplitService{
	
	constructor(private http: Http){
		
	}

    isHomePageBasicSplitDataAvailable: boolean = false;
	isSplitPageSplittedDataAvailable: boolean = false;
	isHistoryDataAvailable: boolean = false;
	
    private updateSideBarSub = new Subject<any>();

    updateSideBar(param){
        this.updateSideBarSub.next({ isSideBarVisible: param})
    }

    getSideBarStatus(): Observable<any> {
        return this.updateSideBarSub.asObservable();
    }
	
    homePageData: HomePageData;

    splitPageData:any = {};
	
	historyPageData: any = {};
	
	getUserGroups(param){
		const body = JSON.stringify(param);
        const headers = new Headers({'Content-Type': 'application/json'});
		return this.http.post(urlConsts.getUserGroups, body, {headers: headers})
			.map((res : Response) => res.json())
			.catch(this.handleError);
	}
	
	getRestaurantMenuList(param){
		const body = JSON.stringify(param);
        const headers = new Headers({'Content-Type': 'application/json'});
		return this.http.post(urlConsts.getRestaurantMenu, body, {headers: headers})
			.map((res : Response) => res.json())
			.catch(this.handleError);
	}

	exportToExcel(param){
		const body = JSON.stringify(param);
        const headers = new Headers({'Content-Type': 'application/json'});
		const url = urlConsts.exportData+'?exportData='+ body;
		window.open(url)
	}
	
	saveSplitDetails(splitData){
		const body = JSON.stringify(splitData);
        const headers = new Headers({'Content-Type': 'application/json'});
		return this.http.post(urlConsts.saveSplitedData, body, {headers: headers})
			.map((res : Response) => res.json())
			.catch(this.handleError);
	}

	fetchAllSavedSplitData(param){
		const body = JSON.stringify(param);
        const headers = new Headers({'Content-Type': 'application/json'});
		return this.http.post(urlConsts.fetchSavedSplitData, body, {headers: headers})
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