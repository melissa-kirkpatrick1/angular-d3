import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as t from 'topojson';

@Component({
  selector: 'app-us-map',
  templateUrl: './us-map.component.html',
  styleUrls: ['./us-map.component.css']
})
export class UsMapComponent implements OnInit {
  selectedValues: any[] = [];
  private countryData: any;

  constructor() { }

  ngOnInit(): void {
    let width = 900;
    let height = 600;

    let projection = d3.geoAlbersUsa();

    let svg = d3.select('div.us-map').append('svg')
      .attr('width', width)
      .attr('height', height);
    let path = d3.geoPath()
      .projection(projection);
    let g = svg.append('g');
    g.attr('class', 'map');

    console.log("outside json calling1");
    let tooltipDiv = d3.select("div.tooltip")
      .attr("class", "tooltip")
      .style("opacity", 0);

    this.countryData =  d3.json("assets/maps/USA.json");
    this.countryData
      .then(function (topology:any) {
        g.selectAll('path')
          .data(t.feature(topology, topology.objects.units).features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr("fill", function (d ) {
            return "lightgrey"
          });
        // console.log("ending json calling1");
        // let aa =  [40.71455,-74.007124];
        // let bb = [-122.389809, 37.72728];
        // let sampleData = {"location" : "test", "coords" : aa};
        // let dataArr : any[] = [];
        // dataArr.push(sampleData);
        // svg.selectAll("circle")
        //   .data(dataArr).enter()
        //   .append("circle")
        //   .attr("cx", function (d:any) {
        //     console.log(d);
        //     console.log("D HERE",d);
        //     console.log("COORDS 0",projection(d.coords)[0])
        //     return projection(d.coords)[0];
        //   })
        //   .attr("cy", function (d: any) {
        //     console.log("D HERE",d);
        //     console.log("COORDS 1",projection(d.coords)[1])
        //     return projection(d.coords)[1];
        //   })
        //   .attr("r", "8px")
        //   .attr("fill", "red")
        //   .on("mouseover", function(event, data) {
        //     console.log("data", data);
        //     tooltipDiv.transition()
        //       .duration(200)
        //       .style("opacity", .9);
        //     tooltipDiv.html(data.location)
        //       .style("left", (event.pageX) + "px")
        //       .style("top", (event.pageY - 28) + "px");
        //   })
        //   .on("mouseout", function(d) {
        //     tooltipDiv.transition()
        //       .duration(500)
        //       .style("opacity", 0);
        //   });
        console.log("LOADED 1 point - YAY");
      });


  }
  updateThreatFilters(event) {
    console.log("Clicked event",this.selectedValues);
    let projection = d3.geoAlbersUsa();
    let path = d3.geoPath()
      .projection(projection);

    let svg = d3.select('div.us-map');
    let g = d3.select('g.map');

    let tooltipDiv = d3.select("div.tooltip")
      .attr("class", "tooltip")
      .style("opacity", 0);

    let aa = [-122.490402, 37.786453];
    let bb = [-75.26660601124958,43.598241844086594];
    let cc = [-74.00712, 40.71455];

    let sampleData = {"location" : "CA Somewhere", "coords" : aa};
    let sampleData2 = {"location" : "Herndon", "coords" : bb};
    let sampleData3 = {"location" : "New York", "coords" : cc};
    let dataArr : any[] = [];
    dataArr.push(sampleData);
    dataArr.push(sampleData2);
    dataArr.push(sampleData3);

    let height = 20, width=20;
    var defs= g.append('defs')
    defs.append('pattern')
      .attr('id', 'hotel')
      // .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', width)
      .attr('height', height)
      .append('svg:image')
      .attr('xlink:href', 'https://cdn0.iconfinder.com/data/icons/flat-round-system/512/android-128.png')
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);


    g.selectAll("rects")
      .data(dataArr).enter()
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", function (d:any) {
        var coords = projection(d.coords);
        if (coords) {
          return coords[0];
        }
      })
      .attr("y", function (d: any) {
        var coords = projection(d.coords);
        if (coords) {
          return coords[1];
        }
      })
      .attr("fill", "url(#hotel)")
      .attr("stroke", "darkgrey")
      .on("mouseover", function(event, data) {
        tooltipDiv.transition()
          .duration(200)
          .style("opacity", .9);
        tooltipDiv.html(data.location)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        tooltipDiv.transition()
          .duration(500)
          .style("opacity", 0);
      });

  }

}
