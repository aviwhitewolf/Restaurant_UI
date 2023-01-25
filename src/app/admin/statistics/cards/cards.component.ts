import { Component, Input, OnInit } from '@angular/core';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';



@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  @Input()
  data: any

  public currencySymbol = ""

  constructor(private mainService: MainService) {

    this.currencySymbol = this.mainService.getToLocalStorage(Constants.LOCAL_USER).currencySymbol || "₹"

  }

  ngOnInit(): void {
    
  }


  getPercentage(data: any, index: number) {

    const total = data.reduce((acc: any, curr: any) => acc + parseInt(curr.count), 0);

    const percentage = Math.round((data[index].count / total) * 100)

    return { 'width' : percentage + '%'}

  }


}


