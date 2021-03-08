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
  threatTypes: any[] = [];
  private hotels: any[] = [];
  private airports: any[] = [];

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
    this.loadIconsForMap(g);
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
  loadThreatTypes() {
    this.threatTypes.push("hotel");
    this.threatTypes.push("airport");
  }
  updateThreatFilters(event, type) {
    let svg = d3.select('div.us-map');
    let g = d3.select('g.map');

    if (!event.checked) {
      g.selectAll("rect." + type).remove();
    } else {
      switch (type) {
        case 'hotel':
          this.loadHotels();
          break;
        case 'airport':
          this.loadAirports();
          break;
      }
    }
  }

  loadHotels() {
    let that = this;
    if (this.hotels.length == 0) {
      d3.csv("assets/maps/hotels.csv")
        .then(function(data: any) {
          data.forEach(hotel => {
            let coords = [hotel.lon, hotel.lat];
            let hotelData = {"location": hotel.hotel, "coords": coords, "type": "hotel"};
            that.hotels.push(hotelData);
          })
          that.showData(that.hotels);
        });
    } else {
      this.showData(this.hotels);
    }
  }

  showData(dataArr: any) {
    let svg = d3.select('div.us-map');
    let g = d3.select('g.map');
    console.log("HOTELS",this.hotels);

    let projection = d3.geoAlbersUsa();
    let path = d3.geoPath()
      .projection(projection);

    let tooltipDiv = d3.select("div.tooltip")
      .attr("class", "tooltip")
      .style("opacity", 0);

    let height = 20, width=20;
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
      .attr("fill", function(d: any) {
        return "url(#"+d.type+")";
      }).attr("class", function(d: any) {
      return d.type;
    })
      .attr("stroke", "none")
      .on("mouseover", function(event, data: any) {
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
  loadAirports() {
    let that = this;
    if (this.airports.length == 0) {
      d3.csv("assets/maps/airports.csv")
        .then(function(data: any) {
          console.log("AIRPORTS", data);
          data.forEach(airport => {
            let coords = [airport.lon, airport.lat];
            let airportData = {"location": airport.airport, "coords": coords, "type": "airport"};
            that.airports.push(airportData);
          })
          that.showData(that.airports);
        });
    } else {
      this.showData(this.airports);
    }
  }
  loadIconsForMap(g:any) {
    let width = 20, height = 20;
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
