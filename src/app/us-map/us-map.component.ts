import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as t from 'topojson';

@Component({
  selector: 'app-us-map',
  templateUrl: './us-map.component.html',
  styleUrls: ['./us-map.component.css']
})
export class UsMapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    let width = 1100;
    let height = 700;

    let svg = d3.select('body').append('svg')
      .attr('width', width)
      .attr('height', height);
    let g = svg.append('g');
    g.attr('class', 'map');

    let scale = d3.scaleSqrt().domain([1,56]).range([.1, 1]);
    let color = d3.scaleSequential(d =>
      d3.interpolateReds(scale(d))
    );

    d3.json("assets/maps/USA.json")
      .then(function (topology : any) {
        let projection = d3.geoAlbersUsa().fitSize([width,height],t.feature(topology, topology.objects.units));
        let path = d3.geoPath().projection(projection);
        // <---- Renamed it from data to topology
        console.log("------>", topology.feature);
        g.selectAll('path')
          .data(t.feature(topology, topology.objects.units).features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr("fill", function (d ) {
            return "red"
          });
        console.log("ending json calling1");

      });
    var threatMap = new Map();
    d3.csv("assets/maps/usa_threats.csv")
      .then(function (d : any) {
        console.log("D",d);
        d.forEach(state => {
          threatMap.set(state.fips, +state.threats);
        });
        g.selectAll('path')
          .attr('fill', function(code :any) {
            console.log("CODE FIPS", code)
            return color(threatMap.get(code.properties.fips));
          });
        console.log("Threat map", threatMap);
      });
  }

}
