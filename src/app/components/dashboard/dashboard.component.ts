import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public fullName :string = "";
  public role :string = "";
  public expiryTime : string = "";
  constructor(private api:ApiService, private auth: AuthService, private uerstore:UserStoreService){}
  public users:any = [];
  ngOnInit(){
    this.api.getAllUsers().subscribe(res=>{
      this.users= res;
    });

    this.uerstore.getFullNameFromStore().subscribe(val=>{
      let fullNamefromToken = this.auth.getFullNameFromToken();
      this.fullName = val || fullNamefromToken;
    });

    this.uerstore.getFullNameFromStore().subscribe(val=>{
     let rolefromToken = this.auth.getRoleFromToken();
     this.role = val || rolefromToken;
    });
  }

  logout(){
    this.auth.signOut();
  }
}
