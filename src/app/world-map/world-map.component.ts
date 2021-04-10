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

        projection = d3.geoMercator();

        path = d3.geoPath().projection(projection);
        // <---- Renamed it from data to topology
        console.log("------>", topology.feature);
        g.selectAll('path')
          .data(t.feature(topology, topology.objects.units).features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr("stroke", "#6cb0e0")
          .attr("fill", function (d ) {
            return "#c2dabe";
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
            .style("fill", "blue");
          

          let origin = [1.7191036,46.71109];
          let destination = [-7.992047,31.628674];

          var link = {type: "LineString", coordinates: [origin, destination]} // Change these data to see ho the great circle reacts

          g.append("path")
            // .datum({type: "LineString", coordinates: [ destination, origin]})
            .attr("class", "route")
            .attr("d",  path(link))
            .attr('stroke', 'blue')
            .attr("fill", "none")
            .attr("stroke-width", "2")
            .style("cursor", "pointer")
        });
      });
    d3.csv("assets/data/GlobalAirportDatabase.csv").then(function(data: any) {
      let franceAirports = [];
      let franceStr = "";
      data.forEach(item => {
        if (item["country"] == "FRANCE" && item["lat"] != "0.000") {
          franceAirports.push(item);
          franceStr = franceStr + item["code"]+","+item["name"]+","+item["location"]+","+item["lat"]+","+item["lon"]+"\n";
        }
      })
      console.log(franceAirports);
    });
  }

}
