import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router } from "@angular/router";
import { SplitService } from '../../services/split.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
	
	AllSplitSavedData:Array<any> = [];
	constructor(private router: Router, private splitService: SplitService, private authService: AuthService) { }

	ngOnInit() {
		this.fetchAllSavedSplitData()
	}
	
	fetchAllSavedSplitData(){
		let param = {userName: this.authService.userName}; 
		this.splitService.fetchAllSavedSplitData(param)
			.subscribe(
				data=>{
					this.AllSplitSavedData = data.data;
				},
				err=>{
					alert(err.title)
				}
			)
	}
	
	onClickViewDetailsBtn(index: number){
		let detailsData = Object.assign({}, this.AllSplitSavedData[index]);
		this.splitService.historyPageData = detailsData;
		this.splitService.isHistoryDataAvailable = true;
		this.router.navigate(['/','bill']);
	}
	
}
