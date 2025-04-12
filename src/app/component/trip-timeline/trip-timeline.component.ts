import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TripService } from '../trip.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-trip-timeline',
  templateUrl: './trip-timeline.component.html',
  styleUrls: ['./trip-timeline.component.scss']
})
export class TripTimelineComponent implements AfterViewInit ,OnInit{
 
  @ViewChild('tripSvg', { static: true }) svgRef!: ElementRef;
  private tripData:any 
// sample data
//   [
//     {
//         "start": "BLR",
//         "end": "MAA"
//     },
//     {
//         "start": "MAA",
//         "end": "HYD"
//     },
//     {
//         "start": "BLR",
//         "end": "HYD"
//     },
//     {
//         "start": "HYB",
//         "end": "DEL"
//     },
//     {
//         "start": "HYB",
//         "end": "DEL"
//     },
//     {
//         "start": "DEL",
//         "end": "BLR"
//     }
// ]


  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.tripService.trips$.subscribe((trips:any) => {
      this.tripData=[];
      this.tripData = trips
      this.drawTrips();
    });
  }
  ngAfterViewInit() {
    this.drawTrips();
  }

  drawTrips() {
    const svg = d3.select(this.svgRef.nativeElement);
    const width = this.svgRef.nativeElement.clientWidth;
    const height = this.svgRef.nativeElement.clientHeight;
    svg.selectAll("g").remove(); 
    const g = svg.append("g").attr("transform", "translate(50,50)");
    const nodeSpacing = 140;
    const levelHeight = 80;
    const gap = 10;

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Define arrow marker
    svg.append("defs").append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 8)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", 'rgb(255, 127, 14)');

    let positions: any[] = [], links: any[] = [];
    let x = 0;

    this.tripData.forEach((trip:any, i:any) => {
      const prev = this.tripData[i - 1];
      const sameAsPrev = prev && prev.end === trip.start;
      const isRepeat = this.tripData.filter((t:any) => t.start === trip.start && t.end === trip.end).length > 1;
      const level: any = isRepeat ? 1 : 2;

      positions.push({
        id: `${trip.start}-${trip.end}-${i}`,
        label: `${trip.start} - ${trip.end}`,
        x: x,
        y: levelHeight * level,
        color: colorScale(i),
        arrow: !sameAsPrev && level === 2,
        level: level
      });

      if (i > 0) {
        links.push({ source: positions[i - 1], target: positions[i] });
      }

      x += nodeSpacing;
    });

    // Draw links
    g.selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("stroke-width", 2)
      .attr("fill", "#fff")
      .attr("class", "link")
      .attr("stroke", (d:any) => d.source.level === 1 ? 'gray' : d.source.color)
      .attr("marker-end", (d:any) => d.target.arrow ? "url(#arrow)" : null)
      .attr("d", (d:any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const curvature = 0.6;

        const x1 = d.source.x + gap, y1 = d.source.y;
        const x2 = d.target.x - gap, y2 = d.target.y;

        const cx1 = x1 + dx * curvature;
        const cy1 = y1;
        const cx2 = x2 - dx * curvature;
        const cy2 = y2;

        return `M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;
      });

    // Draw nodes
    g.selectAll(".node")
      .data(positions)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d:any) => `translate(${d.x},${d.y})`)
      .each( function(this: SVGGElement,d:any) {
        const node = d3.select<SVGGElement,any>(this);

        node.append('circle')
          .attr('r', 7)
          .attr('stroke-width', 2)
          .attr('stroke', d.level === 1 ? "gray" : "#fff")
          .attr('fill', d.level === 1 ? "#fff" : d.color);

        node.append("text")
          .attr("dy", d.level === 1 ? -20 : 30)
          .attr('fill', d.level === 1 ? "gray" : d.color)
          .attr("text-anchor", "middle")
          .style('font-size', '14px')
          .style('font-weight', '500')
          .text(d.label);

        // Optional arrow visualization at node (commented out in original)
        // if (d.arrow) {
        //   node.append("path")
        //     .attr("class", "arrow")
        //     .attr("d", "M0,-2 L10,0 L0,2 Z")
        //     .attr("fill", d.color)
        //     .attr("transform", "translate(30,0)");
        // }
      });
  }
}
