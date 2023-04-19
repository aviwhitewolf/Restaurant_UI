import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { MainService } from 'src/app/main.service';
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
  selector: 'app-expense-chart',
  templateUrl: './expense-chart.component.html',
  styleUrls: ['./expense-chart.component.css']
})
export class ExpenseChartComponent implements OnInit {


  @Input()
  data: any

  @Input()
  start!: string

  @Input()
  end!: string

  @ViewChild("chart") chart: ChartComponent | any;
  public expenseChartOptions: Partial<ChartOptions> | any;
  public category: string = ""

  constructor(private mainService: MainService) { }

  ngOnInit(): void {
    if (this.data.length > 0)
      this.renderChart(this.data, this.start, this.end)
  }

  changeCategoryAndRenderChart(category: string) {
    if (this.data.length > 0)
      this.renderChart(this.data, this.start, this.end, category)
  }

  renderChart(data: any, start: string, end: string, category: string = "") {

    const chartData = this.formatExpense(data, start, end, category)
    if (chartData.credit.length > 0 || chartData.debit.length > 0)
      this.expenseChartOptions = {
        series: [
          {
            name: "Credit",
            data: chartData.credit
          },
          {
            name: "Debit",
            data: chartData.debit
          }
        ],
        chart: {
          type: 'area',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.70,
            opacityTo: 0.05,
            stops: [50, 100, 100, 100]
          }
        },
        yaxis: {
          title: {
            text: 'Amount (INR)'
          }
        },
        grid: {
          row: {
            colors: ['#fff', '#f2f2f2']
          }
        },
        colors: ["#00e396", "#FF0000"],
        xaxis: {
          categories: chartData.categories
        }
      };

  }

  formatExpense(data: any, pStart: string, pEnd: string, type: string = "") {

    const credit = {}
    const debit = {}
    const start = moment(pStart)
    const end = moment(pEnd)
    const diffhours = end.diff(start, 'hours')
    const diffdays = end.diff(start, 'days')
    const diffMonth = end.diff(start, 'months')
    const diffYears = end.diff(start, 'years')

    /**
     * Here i'm checking if my type [hours, days, months, years] is null
     * then check the differece of hours, days, months, years in sequence
     * and which ever is greater than 0 execute that part
     * 
     * If Type is not null then check two condition that is the difference and type
     * 
     */
    if (type == "" ? (diffYears > 0) : (diffYears > 0 && type == 'yeasrs')) {

      data.reduce((acc: any, curr: any) => {

        if (acc.credit[moment(curr.date).year()]) {
          acc.credit[moment(curr.date).year()] = parseFloat(acc.credit[moment(curr.date).year()]) + parseFloat(curr.credit ? curr.credit : 0)
        } else {
          acc.credit[moment(curr.date).year()] = parseFloat(curr.credit ? curr.credit : 0)
        }

        if (acc.debit[moment(curr.date).year()]) {
          acc.debit[moment(curr.date).year()] = parseFloat(acc.debit[moment(curr.date).year()]) + parseFloat(curr.debit ? curr.debit : 0)
        } else {
          acc.debit[moment(curr.date).year()] = parseFloat(curr.debit ? curr.debit : 0)
        }

        return acc;

      }, { credit, debit })

      this.category = "years"

    } else if (type == "" ? (diffMonth > 4) : (diffMonth > 4 && type == 'months')) {

      data.reduce((acc: any, curr: any) => {

        if (acc.credit[moment(curr.date).format('MMM')]) {
          acc.credit[moment(curr.date).format('MMM')] = parseFloat(acc.credit[moment(curr.date).format('MMM')]) + parseFloat(curr.credit ? curr.credit : 0)
        } else {
          acc.credit[moment(curr.date).format('MMM')] = parseFloat(curr.credit ? curr.credit : 0)
        }

        if (acc.debit[moment(curr.date).format('MMM')]) {
          acc.debit[moment(curr.date).format('MMM')] = parseFloat(acc.debit[moment(curr.date).format('MMM')]) + parseFloat(curr.debit ? curr.debit : 0)
        } else {
          acc.debit[moment(curr.date).format('MMM')] = parseFloat(curr.debit ? curr.debit : 0)
        }


        return acc;

      }, { credit, debit })

      this.category = "months"


    } else if (type == "" ? (diffdays > 0) : (diffdays > 0 && type == 'days')) {

      data.reduce((acc: any, curr: any) => {

        if (acc.credit[moment(curr.date).format('DD MMM')]) {
          acc.credit[moment(curr.date).format('DD MMM')] = parseFloat(acc.credit[moment(curr.date).format('DD MMM')]) + parseFloat(curr.credit ? curr.credit : 0)
        } else {
          acc.credit[moment(curr.date).format('DD MMM')] = parseFloat(curr.credit ? curr.credit : 0)
        }

        if (acc.debit[moment(curr.date).format('DD MMM')]) {
          acc.debit[moment(curr.date).format('DD MMM')] = parseFloat(acc.debit[moment(curr.date).format('DD MMM')]) + parseFloat(curr.debit ? curr.debit : 0)
        } else {
          acc.debit[moment(curr.date).format('DD MMM')] = parseFloat(curr.debit ? curr.debit : 0)
        }

        return acc;

      }, { credit, debit })

      this.category = "days"


    } else if (type == "" ? (diffhours > 0) : (diffhours > 0 && type == 'hours')) {

      data.reduce((acc: any, curr: any) => {


        if (acc.credit[moment(curr.date).format('DD MMM hh:mm A')]) {
          acc.credit[moment(curr.date).format('DD MMM hh:mm A')] = parseFloat(acc.credit[moment(curr.date).format('DD MMM hh:mm A')]) + parseFloat(curr.credit ? curr.credit : 0)
        } else {
          acc.credit[moment(curr.date).format('DD MMM hh:mm A')] = parseFloat(curr.credit ? curr.credit : 0)
        }

        if (acc.debit[moment(curr.date).format('DD MMM hh:mm A')]) {
          acc.debit[moment(curr.date).format('DD MMM hh:mm A')] = parseFloat(acc.debit[moment(curr.date).format('DD MMM hh:mm A')]) + parseFloat(curr.debit ? curr.debit : 0)
        } else {
          acc.debit[moment(curr.date).format('DD MMM hh:mm A')] = parseFloat(curr.debit ? curr.debit : 0)
        }

        return acc;
      }, { credit, debit })

      this.category = "hours"

    } else {
      this.mainService.openDialog("Error", "Not possible to plot a graph for a given selection.", "E")
    }



    return {
      credit: Object.values(credit),
      debit: Object.values(debit),
      categories: Object.keys(credit)
    }

  }

}
