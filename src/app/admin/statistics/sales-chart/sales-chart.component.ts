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
  selector: 'app-sales-chart',
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.css']
})
export class SalesChartComponent implements OnInit {

  @Input()
  data: any

  @Input()
  start!: string

  @Input()
  end!: string

  @ViewChild("chart") chart: ChartComponent | any;
  public salesChartOptions: Partial<ChartOptions> | any;
  public category: string = ""

  constructor(private mainService: MainService) { }

  ngOnInit(): void {
    if (this.data?.sale?.length > 0)
       this.renderChart(this.data, this.start, this.end)
  }

  changeCategoryAndRenderChart(category: string) {
    if (this.data?.sale?.length > 0)
       this.renderChart(this.data, this.start, this.end, category)
  }

  renderChart(data: any, start: string, end: string, category: string = '') {
    const sales = this.formatSales(data?.sale, start, end, category);
    const chartData = this.formatExpense(data.expense, start, end, category);

    // Set chart options
    this.salesChartOptions = {
      series: [
        {
          name: "Sale",
          data: sales.data
        },
        {
          name: "Expense",
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
          text: 'Amount'
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false
        },
      },
      grid: {
        row: {
          colors: ['#fff', '#f2f2f2']
        }
      },
      colors: ["#6366f1", "#FF0000"],
      xaxis: {
        categories: sales.categories, // Use sales categories assuming they are correctly formatted
        axisTicks: {
          show: false
        },
        labels: {
          show: false
        },
      }
    };
  }

  formatSales(sales: any, pStart: string, pEnd: string, type: string = '') {
    const mSales = {};

    // Parse start and end dates
    const start = moment(pStart);
    const end = moment(pEnd);

    // Determine date difference
    const diffhours = end.diff(start, 'hours');
    const diffdays = end.diff(start, 'days');
    const diffMonth = end.diff(start, 'months');
    const diffYears = end.diff(start, 'years');

    // Based on type, aggregate sales data
    if (type === '' ? (diffYears > 0) : (diffYears > 0 && type === 'years')) {
      sales.reduce((acc: any, curr: any) => {
        const year = moment(curr.date).year();
        acc[year] = (acc[year] || 0) + parseFloat(curr.total);
        return acc;
      }, mSales);
      this.category = 'years';
    } else if (type === '' ? (diffMonth > 4) : (diffMonth > 4 && type === 'months')) {
      sales.reduce((acc: any, curr: any) => {
        const month = moment(curr.date).format('MMM');
        acc[month] = (acc[month] || 0) + parseFloat(curr.total);
        return acc;
      }, mSales);
      this.category = 'months';
    } else if (type === '' ? (diffdays > 0) : (diffdays > 0 && type === 'days')) {
      sales.reduce((acc: any, curr: any) => {
        const day = moment(curr.date).format('DD MMM');
        acc[day] = (acc[day] || 0) + parseFloat(curr.total);
        return acc;
      }, mSales);
      this.category = 'days';
    } else if (type === '' ? (diffhours > 0) : (diffhours > 0 && type === 'hours')) {
      sales.reduce((acc: any, curr: any) => {
        const hour = moment(curr.date).format('DD MMM hh:mm A');
        acc[hour] = (acc[hour] || 0) + parseFloat(curr.total);
        return acc;
      }, mSales);
      this.category = 'hours';
    } else {
      console.error("Error: Not possible to plot a graph for the given selection.");
    }

    // Return formatted sales data
    return { data: Object.values(mSales), categories: Object.keys(mSales) };
  }

  formatExpense(data: any, pStart: string, pEnd: string, type: string = '') {
    const debit = {};

    // Parse start and end dates
    const start = moment(pStart);
    const end = moment(pEnd);

    // Determine date difference
    const diffhours = end.diff(start, 'hours');
    const diffdays = end.diff(start, 'days');
    const diffMonth = end.diff(start, 'months');
    const diffYears = end.diff(start, 'years');

    // Based on type, aggregate expense data
    if (type === '' ? (diffYears > 0) : (diffYears > 0 && type === 'years')) {
      data?.reduce((acc: any, curr: any) => {
        const year = moment(curr.date).year();
        acc[year] = {
          credit: (acc[year]?.credit || 0) + parseFloat(curr.credit || 0),
          debit: (acc[year]?.debit || 0) + parseFloat(curr.debit || 0)
        };
        return acc;
      }, debit);
      this.category = 'years';
    } else if (type === '' ? (diffMonth > 4) : (diffMonth > 4 && type === 'months')) {
      data?.reduce((acc: any, curr: any) => {
        const month = moment(curr.date).format('MMM');
        acc[month] = {
          credit: (acc[month]?.credit || 0) + parseFloat(curr.credit || 0),
          debit: (acc[month]?.debit || 0) + parseFloat(curr.debit || 0)
        };
        return acc;
      }, debit);
      this.category = 'months';
    } else if (type === '' ? (diffdays > 0) : (diffdays > 0 && type === 'days')) {
      data?.reduce((acc: any, curr: any) => {
        const day = moment(curr.date).format('DD MMM');
        acc[day] = {
          credit: (acc[day]?.credit || 0) + parseFloat(curr.credit || 0),
          debit: (acc[day]?.debit || 0) + parseFloat(curr.debit || 0)
        };
        return acc;
      }, debit);
      this.category = 'days';
    } else if (type === '' ? (diffhours > 0) : (diffhours > 0 && type === 'hours')) {
      data?.reduce((acc: any, curr: any) => {
        const hour = moment(curr.date).format('DD MMM hh:mm A');
        acc[hour] = {
          credit: (acc[hour]?.credit || 0) + parseFloat(curr.credit || 0),
          debit: (acc[hour]?.debit || 0) + parseFloat(curr.debit || 0)
        };
        return acc;
      }, debit);
      this.category = 'hours';
    } else {
      console.error("Error: Not possible to plot a graph for the given selection.");
    }

    // Return formatted expense data
    return {
      credit: Object.values(debit).map((item: any) => item.credit),
      debit: Object.values(debit).map((item: any) => item.debit),
      categories: Object.keys(debit)
    };
  }

}
