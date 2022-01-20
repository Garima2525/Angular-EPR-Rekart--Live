import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { CustomerService } from 'src/app/service/customer.service';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
})
export class CustomerListComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
  constructor(
    private router: Router,
    private customerService: CustomerService,
    private users:AuthService,
    private   userservice :UserService
  ) {}

  public gridData: any;
  public gridView: any;
  user:any
  userPermission:any
  public mySelection: string[] = [];

  public ngOnInit(): void {

    this.users.userLoggedIn().subscribe((user:any)=>{
      console.log(user)
      this.user=user.result
      this.userservice.getrolebyid(user.result.role).subscribe((data:any)=>{
        console.log(data.result[0],'sdwdswewee')
        this.userPermission=data.result[0]
      })
    })

    this.getcustomer();
  }
  getcustomer() {
    this.customerService.getcustomer().subscribe((data: any) => {
      this.gridData = data.result;
      this.gridView = data.result;
      console.log(data);
    });
  }

  handleEdit(id: any) {
    console.log('edit clicked ' + id);
    this.router.navigateByUrl('/edit-contact', { state: { id } });
  }

  // handleDelete(id:any){

  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.contact.deleteContact(id).subscribe((data:any)=>{
  //         if(data.status===200)
  //           Swal.fire(data.message, '', 'success')
  //         else if(data.status===500)
  //           Swal.fire(data.message, '', 'error')
  //           this.getAccounts()
  //       })

  //     }
  //   })
  // }

  // Swal.fire({
  //   title: 'Are You Sure?',
  //   // showDenyButton: true,
  //   showCancelButton: true,
  //   confirmButtonText: 'Delete',
  //   // denyButtonText: `Don't save`,
  // }).then((result) => {
  //   /* Read more about isConfirmed, isDenied below */
  //   if (result.isConfirmed) {

  //   } else if (result.isDenied) {
  //     Swal.fire('Changes are not saved', '', 'info')
  //   }
  // })

  public onFilter(e: any): void {
    let inputValue = e.target.value;
    this.gridView = process(this.gridData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'customer_id',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'industry_type',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'organization_name',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'first_name',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'mobile',
            operator: 'contains',
            value: inputValue,
          },

          {
            field: 'email',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'cpcb_registration',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'cpcb_validity',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'spcb_registration',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'spcb_validity',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }


  calculateDiff(dateSent:any){
    let currentDate = new Date();
    dateSent = new Date(dateSent);
 
     let days= Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24));
     return Number(-days)
   }
}
