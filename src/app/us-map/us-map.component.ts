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


    d3.json("assets/maps/USA.json")
      .then(function (topology:any) {
        g.selectAll('path')
          .data(t.feature(topology, topology.objects.units).features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr("fill", function (d ) {
            return "lightgrey"
          });
        console.log("ending json calling1");
        let aa = [-122.490402, 37.786453];
        let bb = [-122.389809, 37.72728];
        let sampleData = {"location" : "test", "coords" : aa};
        let dataArr : any[] = [];
        dataArr.push(sampleData);
        svg.selectAll("circle")
          .data(dataArr).enter()
          .append("circle")
          .attr("cx", function (d:any) {
            console.log(d);
            return projection(d.coords)[0];
          })
          .attr("cy", function (d: any) {
            return projection(d.coords)[1];
          })
          .attr("r", "8px")
          .attr("fill", "red");
        console.log("LOADED 1 point - YAY");
      });


  }
  updateThreatFilters(event) {

  }

}
