import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { UserService } from '../service/user.service';
import { AuthService } from '../service/auth.service';
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;

  constructor(private router:Router,private userS:UserService,private users:AuthService,
   ) { }
  public gridData: any;
  public gridView: any;
  user:any
  userPermission:any
  public mySelection: string[] = [];

  ngOnInit(): void {
    this.users.userLoggedIn().subscribe((user:any)=>{
      console.log(user)
      this.user=user.result
      this.userS.getrolebyid(user.result.role).subscribe((data:any)=>{
        console.log(data.result[0],'Roledata')
        this.userPermission=data.result[0]
      })
    })
    this.getallrole()
  }

  getallrole(){
    this.userS.getallrole().subscribe((data:any)=>{
      this.gridData=data.result
      this.gridView = data.result;
      console.log(data)
    })
  }
  public onFilter(e: any): void {
    let inputValue = e.target.value;
    this.gridView = process(this.gridData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'role_name',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'email',
            operator: 'description',
            value: inputValue,
          },
         
         
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }
}
