import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import KeenSlider from "keen-slider"
import { Dish } from 'src/app/Constants/Interface/dish';


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  @ViewChild('sliderRef')
  sliderRef!: ElementRef<HTMLElement>;

  slider: any = null

  @Input()
  public heading: string = ""

  @Input()
  public dishes!: Dish[]

  constructor(private router: Router) {
  }

  ngAfterViewInit() {
    this.slider = new KeenSlider(this.sliderRef.nativeElement, {
      loop: false,
      mode: "free",
      rtl: false,
      slides: { perView: "auto", spacing: 10 },
    })
  }

  ngOnInit(): void {
  }

  openDishInfo(dish : Dish){
    this.router.navigate([], {queryParams: { menu : this.heading, dishInfo : true, dishId : dish.id } });
  }

  ngOnDestroy() {
    if (this.slider) this.slider.destroy()

  }


}
