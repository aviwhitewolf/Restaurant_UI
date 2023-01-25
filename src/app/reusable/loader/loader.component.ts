import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {

  constructor() { 
    
  }

  ngOnInit(): void {
    document.body.classList.add("cdk-global-scrollblock");
  }


  ngOnDestroy(): void {
    document.body.classList.remove("cdk-global-scrollblock");
  }



  

}
