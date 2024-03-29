import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  

  constructor(
  private authService: AuthenticationService,
  private formBuild: FormBuilder,
  private router: Router 
   
  ){ }

  ngOnInit(): void {
    this.registerForm = this.formBuild.group({
      name: [null,[Validators.required]],
      username: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email, Validators.minLength(6)]],
      password: [null, [Validators.required,Validators.minLength(3)]],
     // CustomValidators.passwordContainsNumber

     passwordConfirm: [null ,[Validators.required]],
    },{
      //Validators: CustomValidator.passwordMatches
    })
  }
    onSubmit(){
      if (this.registerForm.invalid){
        return;
      }
      console.log(this.registerForm.value)
      this.authService.register(this.registerForm.value).pipe(
        map(user => this.router.navigate(['login']))
      ).subscribe();
    }
  }


