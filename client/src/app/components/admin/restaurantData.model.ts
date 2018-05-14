import { Item } from './item.model';

export class RestaurantModel{
	constructor(public restaurantName: string, public restaurantAddress: string, public foodMenu: Array<Item>, public drinksMenu: Array<Item>, public _id? : string){
		
	}
}