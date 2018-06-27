import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

import { ActivatedRoute, Params, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _httpService:HttpService , private _route:Router) { }
  loginUser;
  createUser;
  ngOnInit() {
    console.log("loading login")
    this.loginUser={email:"",password:""}
    this.createUser={email:"",password:"",first_name:"",last_name:""}
  }


  login(form){
    if(form){

      //console.log("trying to log user: ",this.loginUser)
      let obs = this._httpService.login(this.loginUser)
      obs.subscribe(data =>{

        if(data['_body']=='{"msg":"e"}'){
          console.log("User doesn't exist")
          this._route.navigate(['/login'])

        }
        else{

          //console.log("printing the data",data)
          this.loginUser={email:"",password:""}
          this._route.navigate(['dashBoard'])
        }
      })



    }
  }
    
  signUp(form){
    if(form){

     // console.log("creating user",this.createUser)
      let obs = this._httpService.signUp(this.createUser)
      obs.subscribe(data=>{
       // console.log("after signing up",data['_body'])
        
        if(data['_body']=='{"msg":"e"}'){
         // console.log("Emial Taken Already")
          this._route.navigate(['home'])
        }
          
        else{
         // console.log("User created");
          this._route.navigate(['home'])
        }
      })
      this.createUser={email:"",password:"",first_name:"",last_name:""}
    }
    else{"Error signUp Form"}
  }

  

}
