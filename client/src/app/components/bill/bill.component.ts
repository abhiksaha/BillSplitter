import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router } from "@angular/router";
import {SplitService} from '../../services/split.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {
	
	splittedBillData:Array<any> = []
	splittedBillDataForView: Array<any> = [];
	RestaurantName: string = '';
	BillDated: string = '';
	SplitName = '';
	saveSplitName: string = '';
	isSaveSplitBtnClicked:boolean = false;
	
	constructor(private router: Router, private splitService: SplitService, private authService: AuthService) { }

	ngOnInit() {
		if(this.splitService.isHistoryDataAvailable){
			this.RestaurantName = this.splitService.historyPageData.restautantName;
			this.BillDated = this.splitService.historyPageData.billDated;
			this.SplitName = this.splitService.historyPageData.splitName;
			this.splittedBillDataForView = this.splitService.historyPageData.splitedData;
			this.splitService.historyPageData = {};
			this.splitService.isHistoryDataAvailable = false;
		}else{
			this.SplitName = '';
			this.RestaurantName = this.splitService.homePageData.RestaurantName;
			this.BillDated = this.splitService.homePageData.BillDated;
			this.populateCompleteBill()
		}
	}
	
	populateCompleteBill(){
		let splittedBillData = this.splitService.splitPageData.splitData,
			taxDiscountData = this.splitService.splitPageData.taxDiscountData;
		for(let i = 0; i< splittedBillData.length; i++){
			let dataObj = { name: splittedBillData[i].name, dinksDataArr: [], foodDataArr: [], totalDataArr: []},
				drinkTotal = 0, drinkTotalAfterDiscount = 0, totalTaxOnDirnks = 0, drinkGrandTotal = 0, 
				foodTotal = 0, foodTotalAfterDiscount = 0, totalTaxOnFoods = 0, foodGrandTotal = 0,
				allTotal = 0; 
			
			
			// for drink Items
			if(splittedBillData[i].drinkDetails){
				for(let j = 0; j< splittedBillData[i].drinkDetails.length; j++){
					let drinkDataObj = { itemCount: null, itemName: '', itemValue: 0, type: ''};
					drinkDataObj.itemCount = splittedBillData[i].drinkDetails[j].itemCount;
					drinkDataObj.itemName = splittedBillData[i].drinkDetails[j].itemName;
					drinkDataObj.itemValue = splittedBillData[i].drinkDetails[j].price;
					dataObj.dinksDataArr.push(drinkDataObj);
					drinkTotal += splittedBillData[i].drinkDetails[j].price;
				}
				drinkTotal = parseFloat(drinkTotal.toFixed(2));
				dataObj.dinksDataArr.push({ itemName: 'total', itemValue: drinkTotal, type:'total'});
				drinkTotalAfterDiscount = drinkTotal;
				if(taxDiscountData.drinkBillDiscount > 0){
					let drinksDiscount = 0;
					for(let j = 0; j< splittedBillData[i].drinkDetails.length; j++){
						if(splittedBillData[i].drinkDetails[j].isDiscountAvl)
							drinksDiscount += parseFloat(((splittedBillData[i].drinkDetails[j].price * taxDiscountData.drinkBillDiscount)/100).toFixed(2));
					}					
					dataObj.dinksDataArr.push({ itemName: 'discount - '+ taxDiscountData.drinkBillDiscount +' %', itemValue: drinksDiscount, type: ''});
					drinkTotalAfterDiscount = parseFloat((drinkTotal - drinksDiscount).toFixed(2));
					dataObj.dinksDataArr.push({ itemName: 'total after discount', itemValue: drinkTotalAfterDiscount, type:'total'});
				}
				
				if(taxDiscountData.totalDrinkTaxes.length){
					for(let j = 0; j< taxDiscountData.totalDrinkTaxes.length; j++){
						let taxAmount = parseFloat(((drinkTotalAfterDiscount * taxDiscountData.totalDrinkTaxes[j].taxAmount)/100).toFixed(2));
						dataObj.dinksDataArr.push({ 
							itemName: taxDiscountData.totalDrinkTaxes[j].taxName+' - '+taxDiscountData.totalDrinkTaxes[j].taxAmount+' %', 
							itemValue: taxAmount
						});
						totalTaxOnDirnks += taxAmount;
					}
				}
				totalTaxOnDirnks = parseFloat(totalTaxOnDirnks.toFixed(2));
				dataObj.dinksDataArr.push({ itemName: 'total taxes', itemValue: totalTaxOnDirnks, type:'total'});
				drinkGrandTotal = parseFloat((drinkTotalAfterDiscount + totalTaxOnDirnks).toFixed(2));
				dataObj.dinksDataArr.push({ itemName: 'total drinks bill', itemValue: drinkGrandTotal, type:'total'});
			}
			
			// for food Items
			if(splittedBillData[i].foodDetails){
				for(let j = 0; j< splittedBillData[i].foodDetails.length; j++){
					let foodDataObj = { itemCount: null, itemName: '', itemValue: 0, type: ''};
					foodDataObj.itemCount = splittedBillData[i].foodDetails[j].itemCount;
					foodDataObj.itemName = splittedBillData[i].foodDetails[j].itemName;
					foodDataObj.itemValue = splittedBillData[i].foodDetails[j].price;
					dataObj.foodDataArr.push(foodDataObj);
					foodTotal += splittedBillData[i].foodDetails[j].price;
				}
				foodTotal = parseFloat(foodTotal.toFixed(2));
				dataObj.foodDataArr.push({ itemName: 'total', itemValue: foodTotal, type:'total'});			
				foodTotalAfterDiscount = foodTotal;
				if(taxDiscountData.foodBillDiscount > 0){
					let foodDiscount = 0;
					for(let j = 0; j< splittedBillData[i].foodDetails.length; j++){
						if(splittedBillData[i].foodDetails[j].isDiscountAvl)
							foodDiscount += parseFloat(((splittedBillData[i].foodDetails[j].price * taxDiscountData.foodBillDiscount)/100).toFixed(2));
					}					
					dataObj.foodDataArr.push({ itemName: 'discount - '+taxDiscountData.foodBillDiscount+' %', itemValue : foodDiscount});
					foodTotalAfterDiscount = parseFloat((foodTotal - foodDiscount).toFixed(2));
					dataObj.foodDataArr.push({ itemName: 'total after discount', itemValue: foodTotalAfterDiscount, type:'total'});
				}
				
				if(taxDiscountData.totalFoodTaxes.length){
					for(let j = 0; j< taxDiscountData.totalFoodTaxes.length; j++){
						let taxAmount = parseFloat(((foodTotalAfterDiscount * taxDiscountData.totalFoodTaxes[j].taxAmount)/100).toFixed(2));
						dataObj.foodDataArr.push({ 
							itemName: taxDiscountData.totalFoodTaxes[j].taxName+' - '+taxDiscountData.totalFoodTaxes[j].taxAmount+' %', 
							itemValue: taxAmount
						});
						totalTaxOnFoods += taxAmount;
					}
				}
				totalTaxOnFoods = parseFloat(totalTaxOnFoods.toFixed(2));
				dataObj.foodDataArr.push({ itemName: 'total taxes', itemValue: totalTaxOnFoods, type:'total'});
				foodGrandTotal = parseFloat((foodTotalAfterDiscount + totalTaxOnFoods).toFixed(2));
				dataObj.foodDataArr.push({ itemName: 'total food bill', itemValue: foodGrandTotal, type:'total'});
			}
			// all total
			allTotal = parseFloat((drinkGrandTotal + foodGrandTotal).toFixed(2));
			dataObj.totalDataArr.push({ itemName: 'total bill', itemValue: allTotal, type:'total'})
			
			this.splittedBillDataForView.push(dataObj);
			
		}
	}
	
	onClickExportBtn(){		
		let exportArr = [];
		for(let i = 0; i< this.splittedBillDataForView.length; i++){
			let exportObj = [ ];
				
			exportObj.push(this.splittedBillDataForView[i].name);
			if(this.splittedBillDataForView[i].foodDataArr.length){
				exportObj.push(this.splittedBillDataForView[i].foodDataArr[this.splittedBillDataForView[i].foodDataArr.length - 1].itemValue);
			}else{
				exportObj.push('');
			}
			if(this.splittedBillDataForView[i].dinksDataArr.length){
				exportObj.push(this.splittedBillDataForView[i].dinksDataArr[this.splittedBillDataForView[i].dinksDataArr.length - 1].itemValue);
			}else{
				exportObj.push('');
			}
			if(this.splittedBillDataForView[i].totalDataArr.length){
				exportObj.push(this.splittedBillDataForView[i].totalDataArr[this.splittedBillDataForView[i].totalDataArr.length - 1].itemValue);
			}else{
				exportObj.push('');
			}
			exportArr.push(exportObj);
		}
		if(exportArr.length){
			this.splitService.exportToExcel(exportArr);
		}
	}
	
	onClickSaveSplitBtn(){
		this.isSaveSplitBtnClicked = true;
	}
	
	saveSplit(){
		if(this.splittedBillDataForView.length && this.saveSplitName != ''){
			let saveSplitObj = {
				splitName:this.saveSplitName,
				restautantName: this.splitService.homePageData.RestaurantName,
				billDated: this.splitService.homePageData.BillDated,
				splitedData:this.splittedBillDataForView,
				createdBy: this.authService.userName
			}
			
			this.splitService.saveSplitDetails(saveSplitObj)
				.subscribe(
					data => {
						this.isSaveSplitBtnClicked = false;
						alert(data.title);
					},
					err => {
						alert(err.title);
					}
				)
		}
	}
	
	cancelSaveSplit(){
		this.isSaveSplitBtnClicked = false;
	}
}
