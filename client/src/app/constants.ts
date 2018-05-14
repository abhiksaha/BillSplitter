import { environment } from '../environments/environment';


let createUrl = function(apiName: String){
	return environment.apiUrl+'/'+apiName;
}

export const urlConsts = {
	getAllRestaurantsData : createUrl('getAllRestaurantsData'),
	addRestaurantData : createUrl('addRestaurantData'),
	editRestaurantData: createUrl('editRestaurantData'),
	signup: createUrl('users/signup'),
	signin: createUrl('users/signin'),
	saveAccountDetailsData: createUrl('saveAccountDetailsData'),
	getAccountDetailsData: createUrl('getAccountDetailsData'),
	getUserGroups: createUrl('getUserGroups'),
	getRestaurantMenu: createUrl('getRestaurantMenu'),
	exportData: createUrl('exportData'),
	saveSplitedData: createUrl('saveSplitedData'),
	fetchSavedSplitData: createUrl('fetchSavedSplitData'),
	fetchRestaurantNames: createUrl('fetchRestaurantNames')
};
