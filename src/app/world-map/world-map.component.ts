import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as t from 'topojson';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.css']
})
export class WorldMapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    let width = 1100;
    let height = 700;

    let svg = d3.select('#world-map').append('svg')
      .attr('width', width)
      .attr('height', height);
    let g = svg.append('g');
    g.attr('class', 'map');

    let scale = d3.scaleSqrt().domain([1,56]).range([.1, 1]);
    let color = d3.scaleSequential(d =>
      d3.interpolateBlues(scale(d))
    );
    let path, projection;
    d3.json("assets/maps/countries.json")
      .then(function (topology : any) {
        projection = d3.geoAzimuthalEquidistant().fitSize([width,height],t.feature(topology, topology.objects.units));
        path = d3.geoPath().projection(projection);
        // <---- Renamed it from data to topology
        console.log("------>", topology.feature);
        g.selectAll('path')
          .data(t.feature(topology, topology.objects.units).features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr("fill", function (d ) {
            return "lightgrey"
          });
        console.log("ending json calling1");

        d3.csv("assets/maps/cities.csv").then(function(data: any) {
          g.selectAll("circle")
            .data(data)
            .enter()
            .append("a")
            .attr("xlink:href", function(d: any) {
              return "https://www.google.com/search?q="+d.city;}
            )
            .append("circle")
            .attr("cx", function(d: any) {
              return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function(d: any) {
              return projection([d.lon, d.lat])[1];
            })
            .attr("r", 5)
            .style("fill", "red");

          // let origin = [-122.4196396,37.7771187];
          let origin = [-74.007124,40.71455];
          let destination = [105.3188,61.5240];

          g.append("path")
            .datum({type: "LineString", coordinates: [ destination, origin]})
            .attr("class", "route")
            .attr("d", path)
            .attr('stroke', 'red')
            .attr("fill", "none")
            .attr("stroke-width", "3")
        });
      });
  }

}
