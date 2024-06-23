import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-expense-category-radial-bar',
  templateUrl: './expense-category-radial-bar.component.html',
  styleUrls: ['./expense-category-radial-bar.component.css']
})
export class ExpenseCategoryRadialBarComponent implements OnInit {

  public category: string = ""

  @ViewChild("chart") chart: ChartComponent | any;
  public chartOptions: Partial<ChartOptions> | any;

  @Input()
  data!: any

  constructor() { }

  ngOnInit(): void {
    if (this.data?.length > 0)
      this.renderChart(this.data, 'debit')
  }

  changeCategoryAndRenderChart(category: string) {
    if (this.data?.length > 0){
      this.category = category
      this.renderChart(this.data, category)
    }
  }

  renderChart(data: any, category: string) {
    this.category = category
    this.chartOptions = {
      series: data?.map((e: any) => e[category]),
      labels: data?.map((e: any) => e?.name),
      chart: {
        type: "pie",
        sparkline: {
          enabled: true
        }
      },
      tooltip: {
        fixed: {
          enabled: true
        },
        x: {
          show: true
        },
        y: {
          title: {
            formatter: function(seriesName : any) {
              return "";
            }
          }
        },
        marker: {
          show: true
        }
      }
    };
  }

}
