import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as t from 'topojson';
import {PackedBubbleChartService} from '../services/packed-bubble-chart.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-us-map',
  templateUrl: './us-map.component.html',
  styleUrls: ['./us-map.component.css']
})
export class UsMapComponent implements OnInit {
  selectedValues: any[] = [];
  threatTypes: any[] = [];
  showBubble: boolean = false;
  showVector: boolean = false;
  path: any = {};
  g: any = {};

  private hotels: any[] = [];
  private airports: any[] = [];
  private centered;

  constructor( private packedBubbleChartService: PackedBubbleChartService) { }

  ngOnInit(): void {
    let width = 1000;
    let height = 600;

    let projection = d3.geoMercator();
    let svg = d3.select('div.us-map').append('svg')
      .attr('width', width)
      .attr('height', height);
    this.path = d3.geoPath()
      .projection(projection);
    this.g = svg.append('g');
    this.loadIconsForMap(this.g);
    this.g.attr('class', 'map');

    let tooltipDiv = d3.select("div.tooltip")
      .attr("class", "tooltip")
      .style("opacity", 0);


    let red = d3.rgb("red");
    let darker = red.darker(0.5);

    let lighter = red.brighter(0.5);
    let scale = d3.scaleLinear().domain([1, 25])
      .range([.1, 1]);
    let color = d3.scaleSequential(d =>
      d3.interpolateReds(scale(d)));

    let that = this;
    let borderList = [];

    let map = new Map();
    d3.csv("assets/maps/country-borders.csv")
      .then(function (borders:any) {
        d3.json("assets/maps/convert-to-iso.json").then(function (mappedCodes:any) {
          borders.forEach(border => {
            if (map.get(mappedCodes[border.country_code]) == null) {
              map.set(mappedCodes[border.country_code],[]);
            }
            map.get(mappedCodes[border.country_code]).push(mappedCodes[border.country_border_code]);
          });
        });
      });


    let borderMap = new Map();
    d3.json("assets/maps/borders.json").then(function (borders:any) {
      borders.forEach(border => {
        borderMap.set(border.key, border.value);
      });
    });

    d3.json("assets/maps/countries.json")
      .then(function (topology:any) {
        let list = [];
        topology.objects.units.geometries.forEach(data => {
          // if (data.properties.iso3 == "FRA" ||
          //   borderMap.get("FRA").indexOf(data.properties.iso3) >= 0) {
            list.push(data);
          // }
        });
        topology.objects.units.geometries = list;
        that.g.selectAll('path')
          .data(t.feature(topology, topology.objects.units).features)
          .enter()
          .append('path')
          .attr('d', that.path)
          .attr("class", function (d : any) {
            if (d.properties.iso3 == "FRA") {
              return "selectedCountry"
            } else {
              return "";
            }
          })
          .attr("fill", function (d : any) {
            if (d.properties.iso3 == "FRA") {
              that.zoomTo(d, that.path, that.g, width, height);
            }
            if (d.properties.iso3 == "FRA") {
              return "rgb(254,218,203)";
            } else {
              return "lightgrey";
            }

          })
          .attr("opacity", function (d : any) {
            if (d.properties.iso3 == "FRA") {
              return "1";
            } else {
              return ".3";
            }

          })
          .on("click", function (d, e) {

        })


      });


    let features = [];
    d3.json("assets/data/roads/france-roads-all.geojson") .then(function (streets :any) {
      features = features.concat(streets.features);
    });

    const delay = ms => new Promise(res => setTimeout(res, ms));
    const render = async () => {
      await delay(800);
      this.g.selectAll('path')
          .data(features)
          .enter()
          .append('path')
          .attr('d', that.path)
          .attr('stroke', function(d: any) {
            // if (d.properties.rtn == "A26" || d.properties.ref == "A26") {
            //   return "red";
            // } else {
            //   return "blue";
            // }
            return '#999999';
          })
          .attr('stroke-width', '.1')
        .on("click", function (e:any, d:any) {
          let roadLable = (d.properties.rtn) ? d.properties.rtn : d.properties.ref;
          console.log(roadLable,projection.invert(d3.pointer(e)));
          console.log(d);
        });

      d3.csv("assets/data/roads/roadLables.csv").then(roads => {
        this.g.selectAll(".labels")
          .data(roads)
          .enter().append("text")
          .attr("class", "labels")
          .text(function(d) { return d.label; })
          .attr("x", function(d) {
            return (projection([d.lon, d.lat])[0])  ;
          })
          .attr("y", function(d) {
            return (projection([d.lon, d.lat])[1]);
          })
          .attr("stroke", "darkgrey")
          .attr("stroke-width",".002")
      });

    };
    render();
  }

  zoomTo(d, path, g, width, height) {
    // d is the feature to zoomTo
    var x, y, k;
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 8;
    g.selectAll("path")
      .classed("active", this.centered && function(d) { return d === this.centered; });
    g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
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

    let projection = d3.geoMercator();
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
    });
  }
  loadAirports() {
    let that = this;
    if (this.airports.length == 0) {
      d3.csv("assets/maps/airports.csv")
        .then(function(data: any) {
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
  showBubbbleChart () {
    // const delay = ms => new Promise(res => setTimeout(res, ms));
    // const render = async () => {
    //   this.showBubble = true;
    //   await delay(50);
    //   this.packedBubbleChartService.renderChart();
    // };
    //
    // render();

  }
  showVectorGraphic () {
    this.showVector = true;
  }
}
