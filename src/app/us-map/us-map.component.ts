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
    let tooltipDiv = d3.select("div.tooltip")
      .attr("class", "tooltip")
      .style("opacity", 0);

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

    let sampleData = {"location" : "CA Somewhere", "coords" : aa, "type" : "hotel"};
    let sampleData2 = {"location" : "Herndon", "coords" : bb, "type" : "airport"};
    let sampleData3 = {"location" : "New York", "coords" : cc, "type" : "hotel"};
    let dataArr : any[] = [];
    dataArr.push(sampleData);
    dataArr.push(sampleData2);
    dataArr.push(sampleData3);

    let height = 20, width=20;
    this.loadIconsForMap(g, width,height);
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
      .attr("fill", function(d) {
        console.log("Data",d);
        return "url(#"+d.type+")";
      })
      .attr("stroke", "none")
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
      }).on("click", function(event,data) {
        console.log("CLICKED WITH D", data);
    });
  }

  loadIconsForMap(g: any, width, height) {
    var defs= g.append('defs')
    let sampleIconData: any[] = [
      {"id" : "hotel", "imageurl" : "assets/images/android-128.png" },
      {"id" : "airport", "imageurl" : "assets/images/smile.png" }
    ];

    sampleIconData.forEach(icon => {
      defs.append('pattern')
        .attr('id', icon.id)
        // .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', width)
        .attr('height', height)
        .append('svg:image')
        .attr('xlink:href', icon.imageurl)
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);
    });
  }

}
