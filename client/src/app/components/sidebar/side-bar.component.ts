import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NavItem } from './side-bar.model';
import { SplitService } from '../../services/split.service';

@Component({
    selector:'side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls:['./side-bar.component.css']
})

export class SideBarComponent implements OnInit {

    navItems: NavItem [];
    splitNavVisible: boolean = false;
    constructor(private splitService: SplitService){
        this.splitService.getSideBarStatus().subscribe(data=>{
            this.splitNavVisible = false;
            if(data.isSideBarVisible)
                this.splitNavVisible = true;
        })
    }

    ngOnInit() {
        this.navItems = [
            {title:'home', icon:'home'},
            {title:'split', icon:'columns'},
            {title:'history', icon:'history'},
            {title:'my-account', icon:'user'},
            {title:'admin', icon:'universal-access'},
        ]
	}

    

}