import { Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs';
import { UserData, UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  dataSource: UserData = null as any;
  displayedColumns: string[] = ['id','name','username','email','role'];

  constructor(private userservice: UserService){}


  ngOnInit(): void {
    this.initDataSource();
  }
  initDataSource(){

  this.userservice.findAll(1, 10).pipe(
    tap(users => console.log(users)),
    map ((userData: UserData) => this.dataSource = userData)
  ).subscribe();
  }

}
