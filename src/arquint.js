import * as d3_base from "d3";
import * as d3_dag from "d3-dag";

export default function() {

    const width = 865;
    const height = 865;
    const nodeHeight = (n) => Number(n.id) + 1;
    // const nodeHeight = (n) => 1;
    
    const layering = null;
    const decross = null;
    const columnAssignment = null;
    const column2Coord = null;
    const interLayerSeparation = null;
    const columnWidth = null;
    const columnSeparation = null;

    const d3 = Object.assign({}, d3_base, d3_dag);   

    function arquint(dag) {
        const layerings = {
            "Simplex (slow)": d3.layeringSimplex(),
            "Longest Path (fast)": d3.layeringLongestPath(),
            "Longest Path Not Top Down (fast)": d3.layeringLongestPath().topDown(false),
            "Coffman Graham (medium)": d3.layeringCoffmanGraham(),
            "Topological (fast)": d3.layeringTopological()
          }
          
        const decrossings = {
            "Optimal (slow)": d3.decrossOpt(),
            "Two Layer Opt (medium)": d3.decrossTwoLayer().order(d3.twolayerOpt()),
            "Two Layer (fast)": d3.decrossTwoLayer()
        }

        const columnAssignments = {
            "Simple Left": d3.columnSimpleLeft(),
            "Simple Center": d3.columnSimpleCenter(),
            "Adjacent Left": d3.columnAdjacent(),
            "Adjacent Center": d3.columnAdjacent().center(true),
            "Complex Left": d3.columnComplex(),
            "Complex Center": d3.columnComplex().center(true),
        }
          
        const column2Coords = {
            "Column 2 Coord Rect": d3.column2CoordRect(),
        }

        const interLayerSeparations = {
            "1": () => 1,
            "10": () => 10,
            "100": () => 100,
        }

        const columnWidths = {
            "1": () => 1,
            "10": () => 10,
            "100": () => 100,
        }

        const columnSeparations = {
            "1": () => 1,
            "10": () => 10,
            "100": () => 100,
        }

        // set heightRatio
        dag.each((node) => node.heightRatio = nodeHeight(node));

        let layout = d3.arquint()
            .size([width, height]);

        if (layering != null) {
            layout = layout.layering(layerings[layering]);
        }
        if (decross != null) {
            layout = layout.decross(decrossings[decross])
        }
        if (columnAssignment != null) {
            layout = layout.columnAssignment(columnAssignments[columnAssignment])
        }
        if (column2Coord != null) {
            layout = layout.column2Coord(column2Coords[column2Coord])
        }
        if (interLayerSeparation != null) {
            layout = layout.interLayerSeparation(interLayerSeparations[interLayerSeparation])
        }
        if (columnWidth != null) {
            layout = layout.columnWidth(columnWidths[columnWidth])
        }
        if (columnSeparation != null) {
            layout = layout.columnSeparation(columnSeparations[columnSeparation]);
        }

        layout(dag);
        draw(dag);
    }

    return arquint;

    function draw(dag) {
        // This code only handles rendering
        
        const svgSelection = d3.select("body")
          .append("svg")
          .attr("width", width)
          .attr("height", height);
          // .attr("viewBox", `${-nodeRadius} ${-nodeRadius} ${width + 2 * nodeRadius} ${height + 2 * nodeRadius}`);
        const defs = svgSelection.append('defs'); // For gradients
      
        // Use computed layout
        // layout(dag);
      
        const steps = dag.size();
        const interp = d3.interpolateRainbow;
        const colorMap = {};
        dag.each((node, i) => {
          colorMap[node.id] = interp(i / steps);
        });
      
        // How to draw edges
        const line = d3.line()
          .curve(d3.curveCatmullRom)
          .x(d => d.x)
          .y(d => d.y);
        
        // Plot edges
        svgSelection.append('g')
          .selectAll('path')
          .data(dag.links())
          .enter()
          .append('path')
          .attr('d', ({ data }) => line(data.points))
          .attr('fill', 'none')
          .attr('stroke-width', 3)
          .attr('stroke', ({source, target}) => {
            const gradId = `${source.id}-${target.id}`;
            const grad = defs.append('linearGradient')
              .attr('id', gradId)
              .attr('gradientUnits', 'userSpaceOnUse')
              .attr('x1', source.x0)
              .attr('x2', target.x0)
              .attr('y1', source.y0)
              .attr('y2', target.y0);
            grad.append('stop').attr('offset', '0%').attr('stop-color', colorMap[source.id]);
            grad.append('stop').attr('offset', '100%').attr('stop-color', colorMap[target.id]);
            return `url(#${gradId})`;
          });
      
        // Select nodes
        const nodes = svgSelection.append('g')
          .selectAll('g')
          .data(dag.descendants())
          .enter()
          .append('g')
          .attr('transform', ({x0, x1, y0, y1}) => `translate(${x0}, ${y0})`);
      
        // Plot node rectangles
        nodes.append('rect')
          .attr('width', (d) => d.x1 - d.x0)
          .attr('height', (d) => d.y1 - d.y0)
          .attr('fill', n => colorMap[n.id]);
      
        // Add text to nodes
        nodes.append('text')
          .text(d => d.id)
          .attr('dy', 10)
          .attr('font-size', 10)
          .attr('font-weight', 'bold')
          .attr('font-family', 'sans-serif')
          .attr('fill', 'black');
      }
}
