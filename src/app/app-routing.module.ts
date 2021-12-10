import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomerComponent } from './customer/customer.component';
import { CollectionComponent } from './collection/collection.component';
import { DisposalComponent } from './disposal/disposal.component';
import { GoalComponent } from './goal/goal.component';
import { ULBComponent } from './ulb/ulb.component';
import { TransporterComponent } from './transporter/transporter.component';
import { OrderComponent } from './order/order.component';
import { DisposalExecutionComponent } from './disposal-execution/disposal-execution.component';
import { UserlistComponent } from './userlist/userlist.component';
import {RoleComponent} from './role/role.component'
import {AddroleComponent} from './addrole/addrole.component'
import {CustomerListComponent} from './listview/customer-list/customer-list.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { EditUlbComponent } from './edit-ulb/edit-ulb.component';
import { UlbListComponent } from './listview/ulb-list/ulb-list.component';
import { CollectioncenterComponent } from './listview/collectioncenter/collectioncenter.component';
import { TransporterListComponent } from './listview/transporter-list/transporter-list.component';
import { DisposalListComponent } from './listview/disposal-list/disposal-list.component';
import { EditCollectioncenterComponent } from './edit-collectioncenter/edit-collectioncenter.component';
import { EditTransporterComponent } from './edit-transporter/edit-transporter.component';
import { EditDisposalComponent } from './edit-disposal/edit-disposal.component';
import { OrderListComponent } from './listview/order-list/order-list.component';
import { DisposalExecutionListComponent } from './listview/disposal-execution-list/disposal-execution-list.component';
import { EditDisposalExecutionComponent } from './edit-disposal-execution/edit-disposal-execution.component';
import { AllotmentComponent } from './allotment/allotment.component';
import{TargetListComponent} from './listview/target-list/target-list.component'
import { GoalListComponent } from './listview/goal-list/goal-list.component'; 
import { EditRoleComponent } from './edit-role/edit-role.component';
import {TargetviewComponent} from './listview/targetview/targetview.component';
import { GenerateCertificateComponent} from './generate-certificate/generate-certificate.component'
 
import {DiversionCertificateComponent} from './certificates/diversion-certificate/diversion-certificate.component'
import {CollectionDisposalCertificateComponent} from './certificates/collection-disposal-certificate/collection-disposal-certificate.component'
import {DisposalCertificateComponent} from './certificates/disposal-certificate/disposal-certificate.component'
import {AddCertificateComponent} from './add-certificate/add-certificate.component'
import {EditOrderPoComponent} from './edit-order-po/edit-order-po.component';
import {EditTargetComponent} from './edit-target/edit-target.component'

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: DashboardComponent },

  { path: 'customer', component: CustomerComponent },
  { path: 'view-customer', component: CustomerListComponent },
  { path: 'edit-customer/:id', component: EditCustomerComponent },
  { path: 'collection', component: CollectionComponent },
  { path: 'collectioncenter-list', component: CollectioncenterComponent },
  {
    path: 'edit-collectioncenter/:id',
    component: EditCollectioncenterComponent,
  },
  { path: 'disposal', component: DisposalComponent },
  { path: 'edit-disposal/:id', component: EditDisposalComponent },
  { path: 'goal', component: GoalComponent },
  { path: 'ulb', component: ULBComponent },
  { path: 'ulb-list', component: UlbListComponent },
  { path: 'edit-ulb/:id', component: EditUlbComponent },
  { path: 'tranporter', component: TransporterComponent },
  { path: 'edit-tranporter/:id', component: EditTransporterComponent },
  { path: 'order', component: OrderComponent },
  { path: 'disposal-execution', component: DisposalExecutionComponent },
  { path: 'userlist', component: UserlistComponent },
  { path: 'role', component: RoleComponent },
  { path: 'add-role', component: AddroleComponent },

  { path: 'transporter-list', component: TransporterListComponent },
  { path: 'disposal-list', component: DisposalListComponent },
  { path: 'order-list', component: OrderListComponent },
  {
    path: 'disposal-execution-list',
    component: DisposalExecutionListComponent,
  },
  {
    path: 'edit-disposal-execution/:id',
    component: EditDisposalExecutionComponent,
  },
  {
    path: 'order-allotment/:id',
    component:AllotmentComponent
  },
  {path:'target-list',component:TargetListComponent},
  {path:'goal-list',component:GoalListComponent},
  {path:'edit-role/:id',component:EditRoleComponent},
  {path:'targetview/:id',component:TargetviewComponent},
  {path:"generate-certificate",component:GenerateCertificateComponent},
 
  {path:'certificate-collection-disposal',component:CollectionDisposalCertificateComponent},
  {path:"certificate-disposal",component:DisposalCertificateComponent},
  {path:'certificate-diversion',component:DiversionCertificateComponent},
  {path:'add-certificate',component:AddCertificateComponent},
  {path:'edit-order-po/:id',component:EditOrderPoComponent},
  {path:'edit-target/:id',component:EditTargetComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
