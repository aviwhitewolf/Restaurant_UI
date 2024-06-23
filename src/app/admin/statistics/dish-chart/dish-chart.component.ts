import { Component, Input, OnInit, ViewChild } from '@angular/core';


export enum DISH_CHART_CONSTANT {
  SUMMARY = 'Summary',
  DETAILS = 'Details'
}

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill,
  ApexGrid
} from "ng-apexcharts";


export type ChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  yaxis?: ApexYAxis;
  xaxis?: ApexXAxis;
  fill?: ApexFill;
  title?: ApexTitleSubtitle;
  grid: ApexGrid;
  colors: string[];
};


@Component({
  selector: 'app-dish-chart',
  templateUrl: './dish-chart.component.html',
  styleUrls: ['./dish-chart.component.css']
})
export class DishChartComponent implements OnInit {


  @Input()
  data: any

  @Input()
  start!: string

  @Input()
  end!: string

  @ViewChild("chart") chart: ChartComponent | any;
  public dishChartOptions: Partial<ChartOptions> | any;
  public DISH_CHART_CONSTANT_TYPE = DISH_CHART_CONSTANT
  public activeCategory = this.DISH_CHART_CONSTANT_TYPE.SUMMARY

  public topCount: number = 20;

  constructor() { }

  ngOnInit(): void {
    if (this.data?.length > 0)
      this.renderChart(this.data, this.start, this.end, this.activeCategory)
  }


  changeCategoryAndRenderChart(category: DISH_CHART_CONSTANT) {
    if (this.data?.length > 0) {
      this.activeCategory = category
      this.renderChart(this.data, this.start, this.end, category)
    }

  }

  renderChart(data: any, start: string, end: string, type: DISH_CHART_CONSTANT = DISH_CHART_CONSTANT.SUMMARY) {

    const dishData = this.formatDishSale(data, type)
    this.dishChartOptions = {
      series: [{
        name: 'Sold',
        data: dishData?.data?.splice(0, this.topCount) || []
      }],
      chart: {
        type: 'bar',

      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },

      grid: {
        row: {
          colors: ['#fff', '#f2f2f2']
        }
      },
      xaxis: {
        categories: dishData.categories?.splice(0, this.topCount) || [],
        axisTicks: {
          show: false
        },
        labels: {
          show: false
        },
      },
      yaxis: {
        title: {
          text: 'Sold'
        }
      },
      fill: {
        opacity: 1
      },
      colors: ["#6366f1"],
      tooltip: {
        y: {
          formatter: function (val: any) {
            return "$ " + val + " thousands"
          }
        }
      }
    };

  }

  formatDishSale(dishesSale: any = [], type: DISH_CHART_CONSTANT): any {
    const dishesWithCount = {}
    if (type == DISH_CHART_CONSTANT.SUMMARY) {
      dishesSale.reduce((acc: any, curr: any) => {
        if (acc[curr.name]) {
          acc[curr.name] = parseInt(acc[curr.name]) + parseInt(curr.count)
        } else {
          acc[curr.name] = parseInt(curr.count)
        }
        return acc

      }, dishesWithCount)
      return { data: Object.values(dishesWithCount), categories: Object.keys(dishesWithCount) }
    } else if (type == DISH_CHART_CONSTANT.DETAILS) {

      dishesSale.reduce((acc: any, curr: any) => {
        //capitalize first letter like Small Burger
        const name = `${curr.variation.charAt(0).toUpperCase() + curr.variation.slice(1)} ${curr.name}`
        if (acc[name]) {
          acc[name] = parseInt(acc[curr.name]) + parseInt(curr.count)
        } else {
          acc[name] = parseInt(curr.count)
        }
        return acc

      }, dishesWithCount)
      return { data: Object.values(dishesWithCount), categories: Object.keys(dishesWithCount) }

    }
  }

}
