import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { AutocompleteService} from '../../services/autocomplete.service';
@Component({
  selector: 'splitter-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})

export class SplitterAutoCompleteComponent{
	
	@Input() 
	name: string;
	
	@Input() 
	id: string;
	
	@Input() 
	model: string;
	
	@Input() 
	serviceName: string;
	
	@Output()
	onChangeModelName:EventEmitter<string> = new EventEmitter();
	
	autoCompleteText: string = '';
	autocompleteList:Array<any> = [];
	hasDataFetchingComplete: boolean = false;
	isAutocompleteListVisible: boolean = false;
	
	constructor(private autocompleteService: AutocompleteService){
		
	}
	
	ngOnInit(){
		this.autoCompleteText = this.model;
	}
	
	getAutocompleteList(){
		if(this.autoCompleteText.length >= 2){
			const param = { searchText: this.autoCompleteText.toLowerCase() };
			this.autocompleteService.getAutocompleteList(param, this.serviceName)
				.subscribe(
					data => { 
						this.hasDataFetchingComplete = true;
						if(data)
							this.autocompleteList = data.data;
					},
					err => { 
						alert(err.title);
					}
				)
		}else{
			this.autocompleteList = [];
			this.hasDataFetchingComplete = false;
		}
	}
	
	onFocusAutocompleteTextbox(){
		this.isAutocompleteListVisible = true;
		this.getAutocompleteList();
	}
	onBlurAutocompleteTextbox(ev){
		this.isAutocompleteListVisible = false;
		if(ev.relatedTarget && ev.relatedTarget.parentElement.parentElement.getAttribute('id') == 'autocompleteList')
			this.isAutocompleteListVisible = true;		
	}
	
	onSelectAutocompleteItem(itemName){
		if(itemName){
			this.autoCompleteText = itemName;
			this.onChangeModelName.emit(this.autoCompleteText);
			this.isAutocompleteListVisible = false;
		}
	}
}