import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router } from "@angular/router";
import { MyAccountService } from '../../services/myAccount.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './myAccount.component.html',
  styleUrls: ['./myAccount.component.css']
})
export class MyAccountComponent implements OnInit {
	
	AllGroups: Array<any> = [];
	isAddGroupBtnClicked:boolean = false;
	errorMessages:Array<any> = [];
	addedMembers: Array<any> = [];
	memberName:String = '';
	newGroupName:String = '';
	isDuplicateGroupName: boolean = false;
	editGroup:boolean = false;
	editGroupIndex: number = -1;
	
	userName:String = '';
	userEmailID: String = '';
	userPassword: String = '';
	
	constructor(private router: Router, private myAccountService: MyAccountService, private authService: AuthService) { }

	ngOnInit() {
		this.getUserAccountDetails();
	}
	
	getUserAccountDetails(){
		let param  = {userName: this.authService.userName};
		this.myAccountService.getUserAccountDetails(param)
			.subscribe(
				data =>{ this.poupulateUserAccDetailsData(data)},
				err => { alert(err.title)}
			)
	}
	
	poupulateUserAccDetailsData(data){
		if(data && data.data){
			this.userName = data.data.userName;
			this.userEmailID = data.data.userEmail;
			this.userPassword = data.data.userPassword;
			this.AllGroups = data.data.userGroups;
		}		
	}
	
	onClickAddGroupBtn(){
		this.isAddGroupBtnClicked = true;
		this.errorMessages = [];
	}
	
	onClickCancelGroupAddBtn(){
		this.isAddGroupBtnClicked = false;
		this.editGroup = false;
	}
	
	onBlurGroupName(){
		this.isDuplicateGroupName = false;
		if(this.AllGroups.length){
			for(let i = 0; i< this.AllGroups.length; i++){
				if(this.AllGroups[i].groupName == this.newGroupName && i != this.editGroupIndex){
					this.isDuplicateGroupName = true;
					break;
				}
			}
		}
	}
	
	addGroupToGroupList(){		
		if(this.isDuplicateGroupName)
			return false;
		
		this.errorMessages = [];
		if(this.newGroupName == ''){
			let errors = [
				{message: 'group name can not be blank.'}
			]
			this.errorMessages = errors;
		}else if(!this.addedMembers.length){
			let errors = [
				{message: 'Group can not be empty. Please add members.'}
			]
			this.errorMessages = errors;
		}else {
			let addedMembers = [];
			for(let i = 0; i<this.addedMembers.length; i++){
				addedMembers.push(this.addedMembers[i].name);
			}
			let groupDetails = {
				groupName: this.newGroupName,
				groupMembers: addedMembers,
				createdOn: new Date(),
				createdBy: this.authService.userName
			}
			if(this.editGroup && this.editGroupIndex != -1){
				groupDetails.createdOn = this.AllGroups[this.editGroupIndex].createdOn;
				this.AllGroups[this.editGroupIndex] = groupDetails;
				this.editGroup = false;
				this.editGroupIndex == -1;
			}else{
				this.AllGroups.unshift(groupDetails);							
			}
			this.newGroupName = '';
			this.addedMembers = [];
			this.isAddGroupBtnClicked = false;
		}
	}
	addMember(){
		if(this.memberName != ''){
			this.addedMembers.push({isHover: false, name: this.memberName});
			this.memberName = '';
		}
	}
	
	pupulateGroupMembers(groupMembers){
		return groupMembers.join();
	}
	
	onMouseOverAddedMemberBlock(m){
		m.isHover = true; 
	}
	onMouseLeaveAddedMemberBlock(m){
		m.isHover = false; 
	}
	
	removeAddedMember(i){
		this.addedMembers.splice(i, 1)
	}

	onEditGroup(index, group){
		this.editGroup = true;
		this.editGroupIndex = index;
		this.isAddGroupBtnClicked = true;
		this.isDuplicateGroupName = false;
		this.newGroupName = group.groupName;
		this.memberName = '';
		this.addedMembers = [];
		for(let i = 0; i< group.groupMembers.length; i++){
			this.addedMembers.push({isHover: false, name: group.groupMembers[i]});
		}
	}
	
	onClickRemoveGroup(index){
		this.AllGroups.splice(index, 1);
		this.onBlurGroupName();
	}
	
	saveAccountDetails(){
		let param = {
			userName: this.userName,
			userEmail: this.userEmailID,
			userPassword: this.userPassword,
			userGroups: this.AllGroups
		}
		this.myAccountService.saveAccountDetails(param)
			.subscribe(
				data=>{
					alert(data.title);
				},
				err=>{
					alert(err.title);
				}
			)
	}
}
