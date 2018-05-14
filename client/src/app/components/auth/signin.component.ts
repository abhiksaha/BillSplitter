import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "./user.model";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html'
})
export class SigninComponent implements OnInit {

    signInForm: FormGroup;

	formInvalid:Boolean= false;

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
		if(this.signInForm.valid){
			const user = new User(this.signInForm.value.userName, this.signInForm.value.password);
			this.authService.signin(user)
				.subscribe(
					//TODO handle response data  and error here 
					data => { 
						localStorage.setItem('user-token', data.token);
						localStorage.setItem('user-name', data.userName);
						this.authService.userName = data.userName;
						this.router.navigate(['/','home']);
					},
					err => { 
						alert(err.message);
					}
				);
			this.signInForm.reset();
			this.formInvalid = false;
		}else {
            this.formInvalid = true;
        }
    }

    ngOnInit() {
        this.signInForm = new FormGroup({
			userName: new FormControl('', [Validators.required]),
			password:new FormControl('', [Validators.required, Validators.minLength(6)])
        });
    }
}