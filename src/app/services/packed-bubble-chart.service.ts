import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { of } from 'rxjs';
import { Observable } from 'rxjs';


@Injectable()
export class PackedBubbleChartService {
  constructor() { }
  dataset = {
    "children": [
      {
        name: 'ABC',
        children: [
          { "Name": "Olives", "Count": 4319 },
          { "Name": "Tea", "Count": 4159 },
          { "Name": "Mashed Potatoes", "Count": 2583 },
          { "Name": "Boiled Potatoes", "Count": 2074 },
          { "Name": "Milk", "Count": 1894 },
          { "Name": "Chicken Salad", "Count": 1809 },
          { "Name": "Vanilla Ice Cream", "Count": 1713 },
          { "Name": "Cocoa", "Count": 1636 },
          { "Name": "Lettuce Salad", "Count": 1566 }
        ]
      }
    ]
  };

  renderChart() : Observable<boolean> {
    console.log("IN RENDER");
    let diameter = 600;
    let height = 400;
    let width = 600;
    let width2 = 200;
    let color = d3.scaleOrdinal(d3.schemeCategory10);

    let bubble = d3.pack()
      .size([width, height])
      .padding(1.5);

    let svg = d3.select('#chart')
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "bubble");

    let nodes = d3.hierarchy(this.dataset)
      .sum(function (d: any) {
        return d.Count;
      });

    let node = svg.selectAll(".node")
      .data(bubble(nodes).descendants())
      .enter()
      .filter(function (d) {
        return !d.children
      })
      .append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      }).style("fill", function (d, i: any) {
        return color(i);
      });

    node.append("title")
      .text(function (d: any) {
        return d.Name + ": " + d.Count;
      });

    node.append("circle")
      .attr("x", function (d) { return d.x; })
      .attr("y", function (d) { return d.y })
      .attr("r", function (d) {
        return d.r;
      })
      .style("fill", function (d, i: any) {
        return color(i);
      });

    node.append("text")
      .attr("dy", ".2em")
      .style("text-anchor", "middle")
      .text(function (d: any) {
        return d.data.Name.substring(0, d.r / 3);
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", function (d) {
        return d.r / 5;
      })
      .attr("fill", "white");

    node.append('text')
      .attr("dy", "1.3em")
      .style("text-anchor", "middle")
      .text(function (d: any) {
        return d.data.Count;
      })
      .attr("font-family", "Gill Sans")
      .attr("font-size", function (d) {
        return d.r / 5;
      })
      .attr("fill", "white");

      return of(true);
  }


}
