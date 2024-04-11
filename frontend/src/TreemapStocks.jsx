import { useRef, useEffect, useMemo  } from 'react';
import * as d3 from 'd3';

export default function TreemapStocks({ data ,width = '1000px', height = '600px' }) {
  const svgRef = useRef(null);
  console.log(data)
  function renderTreemap() {
    const parsedWidth = parseInt(width);
    const parsedHeight = parseInt(height);
    const svg = d3.select(svgRef.current);
    svg.attr('width', width).attr('height', height);

    const root = d3.hierarchy(data, (d) => d.children).sum((d) => d.value);
    const treemapRoot = d3.treemap().size([parsedWidth, parsedHeight]).padding(2)(root);
    const fader = (color) => d3.interpolateRgb(color, '#fff')(0.3);

    const nodes = svg
  .selectAll('g')
  .data(treemapRoot.leaves())
  .join('g')
  .attr('transform', (d) => {
    return `translate(${d.x0},${d.y0})`;
  });

  nodes
  .append('rect')
  .attr('width', (d) => {
    return d.x1 - d.x0;
  })
  .attr('height', (d) => {
    return d.y1 - d.y0;
  })
  .attr('fill', (d) => {
    if (d.data.category === 'Positive') {
      return 'green';
    } else if (d.data.category === 'Negative') {
      return 'red';
    } 
  })
  .style('transition-duration', '.2s')
  .style('transition-property', 'filter, opacity')
  .style('opacity', 1)
  .style('filter', 'saturate(100%)')
  .on('mouseover', function (d, i) {
    d3.select(this).style('opacity', 1).style('filter', 'saturate(100%)');
    nodes.selectAll('rect').filter(':not(:hover)').style('opacity', 0.4).style('filter', 'saturate(50%)');
  })
  .on('mouseout', function (d, i) {
    nodes.selectAll('rect').style('opacity', 1).style('filter', 'saturate(100%)');
  });

  }

  useEffect(() => {
    renderTreemap();
  }, [data]);

  return (
    <div>
      <svg ref={svgRef} />
    </div>
  );
}