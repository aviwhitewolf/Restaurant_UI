import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Dish } from 'src/app/Constants/Interface/dish';

@Component({
  selector: 'app-grid-list',
  templateUrl: './grid-list.component.html',
  styleUrls: ['./grid-list.component.css']
})
export class GridListComponent implements OnInit {

  @Input()
  public dishes!: Dish[]

  @Input()
  public heading: string = ""

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  openDishInfo(dish: Dish) {
    this.router.navigate([], { queryParams: { menu: this.heading, dishInfo: true, dishId: dish.id } });
  }

}
