import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {SplitService} from '../../services/split.service';

@Component({
  selector: 'app-split',
  templateUrl: './split.component.html',
  styleUrls: ['./split.component.css']
})
export class SplitComponent implements OnInit {

	toggleItemSelectionModal:Boolean = false;
	items:Array<any> = [];
	itemName:string = '';
	quantity:number = 0;
	allMembers: Array<any> = [];
	isDrinkBillSplit:boolean = true;
	isFoodBillSplit: boolean = true;
	isSplitEqually:boolean = false;
	drinksItemMappingArray:Array<any> = [];
	foodItemMappingArray:Array<any> = [];
	
	foodMenuList: Array<any> = [];
	drinksMenuList: Array<any> = [];
	
	individualMemberSplittedDetails: Array<any> = [];
	splitType: string = '';
	addedFoodItems:Array<any> = [];
	addedDrinkItems:Array<any> = [];
	checkedValArray:Array<boolean> = [];
	isFoodBillNotSplited:boolean = false;
	isDrinkBillNotSplited:boolean = false;
	
	//discounts and taxes
	foodBillDiscount:number = 0;
	drinkBillDiscount:number = 0;
	drinkTaxName:string = '';
	drinkTaxAmount:number = 0;
	foodTaxName:string = '';
	foodTaxAmount:number = 0;
	totalDrinkTaxes: Array<any> = [];
	totalFoodTaxes: Array<any> = [];
	
	constructor( private splitService: SplitService, private router: Router) { }	

	ngOnInit() {
		this.allMembers = this.splitService.homePageData.AllMembers.slice(0);
		for(let i = 0; i< this.allMembers.length; i++){
			this.checkedValArray.push(false);
		}
		
		if(this.splitService.homePageData.BillType == 'food')
			this.isDrinkBillSplit = false;
		if(this.splitService.homePageData.BillType == 'drinks')
			this.isFoodBillSplit = false;
		
		this.getRestaurantMenuList();
		
		if(this.splitService.isSplitPageSplittedDataAvailable){
			this.individualMemberSplittedDetails = this.splitService.splitPageData.splitData;
			this.addedFoodItems = this.splitService.splitPageData.addedFoodItems;
			this.addedDrinkItems = this.splitService.splitPageData.addedDrinkItems;
			this.foodBillDiscount = this.splitService.splitPageData.taxDiscountData.foodBillDiscount;
			this.drinkBillDiscount = this.splitService.splitPageData.taxDiscountData.drinkBillDiscount;
			this.totalDrinkTaxes = this.splitService.splitPageData.taxDiscountData.totalDrinkTaxes;
			this.totalFoodTaxes = this.splitService.splitPageData.taxDiscountData.totalFoodTaxes;				
		}else{
			this.populateIndividualSplitDetailsArray();
		}
	}
	
	getRestaurantMenuList(){
		if(this.splitService.homePageData.RestaurantName){
			const param = {resName : this.splitService.homePageData.RestaurantName}
			this.splitService.getRestaurantMenuList(param)
				.subscribe(
					data =>{
						if(data){
							this.foodMenuList = data.data.foodMenu;
							this.drinksMenuList = data.data.drinksMenu;
						}
					},
					err => {
						alert(err.title);
					}
				)
		}
	}
	
	populateIndividualSplitDetailsArray(){
		this.individualMemberSplittedDetails = [];
		for(let i = 0; i< this.allMembers.length; i++){
			let splittedDetailsObj = Object.assign({}, this.allMembers[i]);
			if(this.isFoodBillSplit)
				splittedDetailsObj.foodDetails = [];
			if(this.isDrinkBillSplit)
				splittedDetailsObj.drinkDetails = [];
			this.individualMemberSplittedDetails.push(splittedDetailsObj);
		}		
	}
	
	refreshIndividualSplitDetailsArray(){
		for(let i = 0; i< this.individualMemberSplittedDetails.length; i++){
			if(this.splitType == 'food')
				this.individualMemberSplittedDetails[i].foodDetails = [];
			else
				this.individualMemberSplittedDetails[i].drinkDetails = [];
		}	
	}
	
	
	openAddItemModal(type: string){
		this.toggleItemSelectionModal = true;
		this.splitType = type;
		this.items = (type == 'food') ? this.addedFoodItems : this.addedDrinkItems;			
	}
	
	closeItemSelectionModal(){
		this.toggleItemSelectionModal = false;
	}

	onClickAddItems(){
		if(this.itemName != '' && this.quantity > 0){
			let itemDetails, self = this;
			if(this.splitType == 'food'){
				itemDetails = this.foodMenuList.filter((ele) => {
					return ele.itemName == self.itemName;
				})[0];		
			}else{
				itemDetails = this.drinksMenuList.filter((ele) => {
					return ele.itemName == self.itemName;
				})[0];	
			}
			for(let i = 0; i < this.checkedValArray.length; i++){
				this.checkedValArray[i] = (this.isSplitEqually) ? true : false;
			}
			for(let i = 0; i < this.quantity; i++){
				this.items.unshift({
						id: this.itemName + '_' + this.items.length, 
						index: i + 1,
						value: this.itemName, 
						price: (itemDetails) ? parseInt(itemDetails.itemPrice) : 0, 
						isDiscountAvl : itemDetails.isDiscountAvailable,
						isChekced: this.checkedValArray.slice(0)
					});
			}
		}
		this.itemName = '';
		this.quantity = 0;
		this.isSplitEqually = false;
	}	
	
	onClickRemoveItem(index: number){
		this.items.splice(index, 1);
	}
	
	onChangeItemCheckbox(e, item, index){
		if(e.target.checked){
			item.isChekced[index] = true;			
		}else{
			item.isChekced[index] = false;			
		}
	}
	
	populateMappingArrays(){
		let mappingArrayName = (this.splitType == 'food') ? 'foodItemMappingArray' : 'drinksItemMappingArray';
		this[mappingArrayName] = [];
		for(let i = 0; i< this.items.length ; i++){
			let item_id = this.items[i].id,
				item_name = this.items[i].value,
				item_price = this.items[i].price;
				
			for(let j = 0; j< this.allMembers.length; j++){
				let member_name = this.allMembers[j].name;
				if(this.items[i].isChekced[j]){
					if(this[mappingArrayName].filter((ele) => { return ele.item_id == item_id}).length == 0){
						let mappingObj = {item_id: item_id, item_name: item_name, price: item_price, isDiscountAvl: this.items[i].isDiscountAvl, members: [member_name]};
						this[mappingArrayName].push(mappingObj);
					}else{
						for(let i = 0; i< this[mappingArrayName].length; i++ ){
							if(this[mappingArrayName][i].item_id == item_id){
								this[mappingArrayName][i].members.push(member_name);
							}
						}
					}
				}
			}
		}
	}
	
	onClickDoneButton(){
		this.toggleItemSelectionModal = false;
		this.populateMappingArrays();
		this.populateIndividualMemberItems();
		
		if(this.splitType == 'food')
			this.addedFoodItems = this.items;
		else
			this.addedDrinkItems = this.items;
	}
	
	populateIndividualMemberItems(){
		let self = this,
			mappingArrayName = (this.splitType == 'food') ? 'foodItemMappingArray' : 'drinksItemMappingArray',
			detailArrayName = (this.splitType == 'food') ? 'foodDetails' : 'drinkDetails';
			
		this.refreshIndividualSplitDetailsArray();
		for(let i = 0; i< this[mappingArrayName].length ; i++){
			if(this[mappingArrayName][i].members.length == 1){
				let memberName = this[mappingArrayName][i].members[0];
				let filterObj = this.individualMemberSplittedDetails.filter((ele) => {
					return ele.name == memberName;
				})[0];
				if(filterObj){
					if(filterObj[detailArrayName].length){
						let drinkFilterObj = filterObj[detailArrayName].filter((ele) => {
							return ele.itemName == self[mappingArrayName][i].item_name
						})[0];
						if(drinkFilterObj){
							drinkFilterObj.itemCount++;
							drinkFilterObj.price += this[mappingArrayName][i].price;
						}else{
							filterObj[detailArrayName].push({
								itemCount: 1, 
								itemName: this[mappingArrayName][i].item_name, 
								price: this[mappingArrayName][i].price,
								isDiscountAvl: this[mappingArrayName][i].isDiscountAvl
							});
						}
					}else{
						filterObj[detailArrayName].push({
							itemCount: 1, 
							itemName: this[mappingArrayName][i].item_name, 
							price: this[mappingArrayName][i].price,
							isDiscountAvl: this[mappingArrayName][i].isDiscountAvl
						});
					}
				}
			}else{
				for(let j = 0; j< this[mappingArrayName][i].members.length; j++){
					let memberName = this[mappingArrayName][i].members[j];
					let filterObj = this.individualMemberSplittedDetails.filter((ele) => {
						return ele.name == memberName;
					})[0];
					if(filterObj){
						if(filterObj[detailArrayName].length){
							let drinkFilterObj = filterObj[detailArrayName].filter((ele) => {
								return ele.itemName == self[mappingArrayName][i].item_name
							})[0];
							if(drinkFilterObj){
								drinkFilterObj.itemCount += parseFloat((1 / parseInt(this[mappingArrayName][i].members.length)).toFixed(2));
								drinkFilterObj.price += parseFloat((this[mappingArrayName][i].price/ parseInt(this[mappingArrayName][i].members.length)).toFixed(2));
							}else{
								filterObj[detailArrayName].push({
									itemCount: parseFloat((1 / parseInt(this[mappingArrayName][i].members.length)).toFixed(2)), 
									itemName: this[mappingArrayName][i].item_name, 
									price: parseFloat((this[mappingArrayName][i].price/ parseInt(this[mappingArrayName][i].members.length)).toFixed(2)),
									isDiscountAvl: this[mappingArrayName][i].isDiscountAvl
								});
							}
						}else{
							filterObj[detailArrayName].push({
								itemCount: parseFloat((1 / parseInt(this[mappingArrayName][i].members.length)).toFixed(2)), 
								itemName: this[mappingArrayName][i].item_name, 
								price: parseFloat((this[mappingArrayName][i].price/ parseInt(this[mappingArrayName][i].members.length)).toFixed(2)),
								isDiscountAvl: this[mappingArrayName][i].isDiscountAvl
							});
						}
					}
				}
			}
		}
	}
	
	onClickGenerateCompleteBill(){
		this.isFoodBillNotSplited = false;
		this.isDrinkBillNotSplited = false;
		this.splitService.isSplitPageSplittedDataAvailable = false;
		
		for(let i = 0; i< this.individualMemberSplittedDetails.length; i++){
			if(this.individualMemberSplittedDetails[i].foodDetails ){
				if(this.individualMemberSplittedDetails[i].foodDetails.length){
					this.isFoodBillNotSplited = false;
					break;
				}else
					this.isFoodBillNotSplited = true;
			}
		}
		for(let i = 0; i< this.individualMemberSplittedDetails.length; i++){			
			if(this.individualMemberSplittedDetails[i].drinkDetails ){
				if(this.individualMemberSplittedDetails[i].drinkDetails.length){
					this.isDrinkBillNotSplited = false;
					break;
				}else
					this.isDrinkBillNotSplited = true;
			}
		}
		
		if(!this.isFoodBillNotSplited && !this.isDrinkBillNotSplited){
			this.splitService.isSplitPageSplittedDataAvailable = true;
			this.splitService.splitPageData = {
				splitData : this.individualMemberSplittedDetails,
				addedFoodItems : this.addedFoodItems,
				addedDrinkItems: this.addedDrinkItems,
				taxDiscountData: {
					foodBillDiscount: this.foodBillDiscount,
					drinkBillDiscount: this.drinkBillDiscount,
					totalDrinkTaxes: this.totalDrinkTaxes,
					totalFoodTaxes: this.totalFoodTaxes
				}				
			}
			this.router.navigate(['/','bill']);
			
		}else{
			this.splitService.splitPageData = {};
		}
	}
	
	onClickAddTaxBtn(type: string){
		if(type == 'food'){
			let taxObj = {
				taxName: this.foodTaxName,
				taxAmount: this.foodTaxAmount 
			}
			this.totalFoodTaxes.push(taxObj);
			this.foodTaxName = '';
			this.foodTaxAmount = 0;
		}else{
			let taxObj = {
				taxName: this.drinkTaxName,
				taxAmount: this.drinkTaxAmount
			}
			this.totalDrinkTaxes.push(taxObj);
			this.drinkTaxName = '';
			this.drinkTaxAmount = 0;
		}
	}
	
	onClickRemoveTaxBtn(type: string, index: number){
		if(type == 'food'){
			this.totalFoodTaxes.splice(index, 1);
		}else{
			this.totalDrinkTaxes.splice(index, 1);
		}
	}
}
