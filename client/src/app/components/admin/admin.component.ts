import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { RestaurantModel } from './restaurantData.model';
import { Item } from './item.model';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
	
	newRestaurantName: string;
	newRestaurantAddress: string;
	newFoodItemName: string;
	newFoodItemPrice: string;
	newFoodItemDiscountAvl: boolean = false;
	newDrinkItemName: string;
	newDrinkItemPrice: string;
	newDrinkItemDiscountAvl: boolean = false;
	foodMenuList: Array<Item> = [];
	drinkMenuList: Array<Item> = [];
	
	allRestaurantList: Array<any> = [];
	isAddNewSectionVisible: boolean = false;
	isAllDataSectionVisible: boolean = true;
	isEditSectionVisible: boolean = false;
	
	editDetailsData: any = {};
	
	constructor(private router: Router, private adminService: AdminService) { }

	ngOnInit() {
		this.populateRestaurantList();
	}
	
	populateRestaurantList(){
		this.adminService.getAllRestaurantList()
			.subscribe(
				data => { 
					if(data)
						this.allRestaurantList = data.data;
				},
				err => { 
					alert(err.title);
				}
			);
	}
	
	onAddNewDataBtnClick(){
		this.isAddNewSectionVisible = true;
		this.isAllDataSectionVisible = false;
		this.newRestaurantName = '';
		this.newRestaurantAddress = '';
		this.foodMenuList = [];
		this.drinkMenuList = [];
	}
	
	onCancelEditBtnClick(){
		this.isAllDataSectionVisible = true;
		this.isAddNewSectionVisible = false;
		this.isEditSectionVisible = false;
	}
	
	onClickEditData(data){
		if(data){
			this.editDetailsData = data;
			
			this.newRestaurantName = this.editDetailsData.restaurantName;
			this.newRestaurantAddress = this.editDetailsData.restaurantAddress;
			this.foodMenuList = this.editDetailsData.foodMenu;
			this.drinkMenuList = this.editDetailsData.drinksMenu;
			
			this.isEditSectionVisible = true;
			this.isAllDataSectionVisible = false;
		}
	}
	
	addItemToManuList(param: string){
		if(param == 'food'){
			let itemObj = { itemName: this.newFoodItemName.toLowerCase(), itemPrice: this.newFoodItemPrice, isDiscountAvailable: this.newFoodItemDiscountAvl};
			this.foodMenuList.push(itemObj);
			this.newFoodItemName = '';
			this.newFoodItemPrice = '';			
			this.newFoodItemDiscountAvl = false;
		}else{
			let itemObj = { itemName: this.newDrinkItemName.toLowerCase(), itemPrice: this.newDrinkItemPrice, isDiscountAvailable: this.newDrinkItemDiscountAvl};
			this.drinkMenuList.push(itemObj);
			this.newDrinkItemName = '';
			this.newDrinkItemPrice = '';
			this.newDrinkItemDiscountAvl = false;
		}
	}
	
	removeItemToManuList(param: string, index: number){
		if(param == 'food'){
			this.foodMenuList.splice(index, 1);
			
		}else{
			this.drinkMenuList.splice(index, 1);
		}
	}	
	
	saveDetails(){
		if(this.newRestaurantName && this.newRestaurantName != ''){
			let detailsObj = new RestaurantModel(
				this.newRestaurantName.toLowerCase(),
				this.newRestaurantAddress,
				this.foodMenuList,
				this.drinkMenuList
			)
			if(this.isEditSectionVisible){
				detailsObj._id = this.editDetailsData._id;
				this.adminService.editRestaurantDetails(detailsObj)
					.subscribe(
						data => { 
							this.newRestaurantName = ''; this.newRestaurantAddress = ''; this.newFoodItemName = ''; this.newFoodItemPrice = ''; this.newFoodItemDiscountAvl = false;
							this.newDrinkItemName = ''; this.newDrinkItemPrice = ''; this.newDrinkItemDiscountAvl = false; this.foodMenuList = []; this.drinkMenuList = [];
							alert(data.title);
							this.populateRestaurantList();
							this.isEditSectionVisible = false;
							this.isAllDataSectionVisible = true;
						},
						err => { 
							alert(err.title);
						}
					);
			}else{
				this.adminService.saveRestaurantDetails(detailsObj)
					.subscribe(
						data => { 
							this.newRestaurantName = ''; this.newRestaurantAddress = ''; this.newFoodItemName = ''; this.newFoodItemPrice = ''; this.newFoodItemDiscountAvl = false;
							this.newDrinkItemName = ''; this.newDrinkItemPrice = ''; this.newDrinkItemDiscountAvl = false; this.foodMenuList = []; this.drinkMenuList = [];
							alert(data.title);
							this.populateRestaurantList();
							this.isAddNewSectionVisible = false;
							this.isAllDataSectionVisible = true;
						},
						err => { 
							alert(err.title);
						}
					);
			}
		}
	}
}
