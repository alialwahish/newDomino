import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

import { ActivatedRoute, Params, Router } from '@angular/router';


@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {

  constructor(private _httpService:HttpService , private _route:Router) { }

  currentUser;

  ngOnInit() {

    let obs = this._httpService.isLogged();
    obs.subscribe(data=>{
      this.currentUser=JSON.parse(data['_body']).user['first_name']
      
    })
  }

  logOut(){
    let obs = this._httpService.logOut();
    obs.subscribe(data=>{
      // console.log(data)
      
      // console.log("clicked on log out")
      this._route.navigate(['home'])
    })
  }

}
