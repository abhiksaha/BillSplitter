import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "./user.model";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
    signUpForm: FormGroup;

    formInvalid:Boolean= false;

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
        const user = new User(
            this.signUpForm.value.userName,
			this.signUpForm.value.password,
            this.signUpForm.value.email
        );

        if(this.signUpForm.valid){
            this.authService.signup(user)
                .subscribe(
					(data) => { 
						localStorage.setItem('user-token', data.token);
						localStorage.setItem('user-name', data.obj.userName);
						this.authService.userName = data.obj.userName;
						this.router.navigate(['/','home']);
					},
					(err) => { alert(err.title)}
            );
            this.signUpForm.reset();
			this.formInvalid = false;
        }
        else {
            this.formInvalid = true;
        }
    }
	
    ngOnInit() {
		let emailRegex = '^[a-z0-9]+([a-zA-Z0-9._-]+)*@[a-zA-Z0-9._-]+\\.+[a-z._-]+$';
        this.signUpForm = new FormGroup({
            //TODO add userName, email and password validators here
			userName:new FormControl('', [Validators.required, Validators.maxLength(20)]),
			email:new FormControl('', [Validators.required, Validators.pattern(emailRegex)]),
			password:new FormControl('', [Validators.required, Validators.minLength(6)])
        });
    }
}