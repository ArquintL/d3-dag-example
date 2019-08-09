import * as d3_base from "d3";
import * as d3_dag from "d3-dag";

export default function() {

    const width = 400;
    const height = 400;
    const layering = "Simplex (slow)";
    const decross = "Optimal (slow)";
    const coord = "Vertical (slow)";

    const d3 = Object.assign({}, d3_base, d3_dag);   

    function sugiyama(dag) {
        const layerings = {
            "Simplex (slow)": d3.layeringSimplex(),
            "Longest Path (fast)": d3.layeringLongestPath(),
            "Coffman Graham (medium)": d3.layeringCoffmanGraham(),
          }
          
        const decrossings = {
            "Optimal (slow)": d3.decrossOpt(),
            "Two Layer Opt (medium)": d3.decrossTwoLayer().order(d3.twolayerOpt()),
            "Two Layer (flast)": d3.decrossTwoLayer()
        }
          
        const coords = {
            "Vertical (slow)": d3.coordVert(),
            "Minimum Curves (slow)": d3.coordMinCurve(),
            "Greedy (medium)": d3.coordGreedy(),
            "Center (fast)": d3.coordCenter(),
        }

        const layout = d3.sugiyama()
            .size([width, height])
            .layering(layerings[layering])
            .decross(decrossings[decross])
            .coord(coords[coord]);

        layout(dag);
        draw(dag);
    }

    return sugiyama;

    function draw(dag) {
        // This code only handles rendering
        const nodeRadius = 20;
        
        const svgSelection = d3.select("body")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", `${-nodeRadius} ${-nodeRadius} ${width + 2 * nodeRadius} ${height + 2 * nodeRadius}`);
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
              .attr('x1', source.x)
              .attr('x2', target.x)
              .attr('y1', source.y)
              .attr('y2', target.y);
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
          .attr('transform', ({x, y}) => `translate(${x}, ${y})`);
      
        // Plot node circles
        nodes.append('circle')
          .attr('r', 20)
          .attr('fill', n => colorMap[n.id]);
      
        // Add text to nodes
        nodes.append('text')
          .text(d => d.id)
          .attr('font-weight', 'bold')
          .attr('font-family', 'sans-serif')
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .attr('fill', 'white');
      }
}
