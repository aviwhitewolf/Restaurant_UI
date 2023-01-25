import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {

  public loading : boolean = false
  public policy : any
  constructor(private mainService : MainService) { }

  ngOnInit(): void {
    this.getPolicy()
  }

  getPolicy(){
    this.loading = true
    this.mainService.getPolicy()
    .then((res) => {
      this.policy = res.data.data
      console.log(this.policy)
      this.loading = false
    })
    .catch((err) => {
      this.loading = false
      console.log(err)
      this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
    })

  }

}
