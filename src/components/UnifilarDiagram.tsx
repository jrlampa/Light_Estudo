import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { EstudoRowData } from '../App';

interface UnifilarDiagramProps {
  data: EstudoRowData[];
  trafoAtual?: string;
  isReport?: boolean;
}

interface TreeNode {
  id: string;
  ponto: string;
  trechoMontante: string;
  isTrafo: boolean;
  children: TreeNode[];
  data: EstudoRowData;
}

export const UnifilarDiagram: React.FC<UnifilarDiagramProps> = ({ data, trafoAtual, isReport = false }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight || 600
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Build hierarchy
    const nodeMap = new Map<string, TreeNode>();
    
    // First pass: create nodes
    data.forEach(row => {
      if (row.ponto) {
        nodeMap.set(row.ponto, {
          id: row.id,
          ponto: row.ponto,
          trechoMontante: row.trechoMontante,
          isTrafo: row.ponto === 'TRAFO',
          children: [],
          data: row
        });
      }
    });

    // Second pass: build tree
    let root: TreeNode | null = null;
    nodeMap.forEach(node => {
      if (node.isTrafo) {
        root = node;
      } else if (node.trechoMontante && nodeMap.has(node.trechoMontante)) {
        nodeMap.get(node.trechoMontante)!.children.push(node);
      } else {
        // If no valid parent, treat as disconnected (or attach to a dummy root if needed)
        // For now, we only render the tree starting from TRAFO
      }
    });

    if (!root) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // Add defs for glow filter
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "glow")
      .attr("x", "-20%")
      .attr("y", "-20%")
      .attr("width", "140%")
      .attr("height", "140%");
    filter.append("feDropShadow")
      .attr("dx", "0")
      .attr("dy", "1")
      .attr("stdDeviation", "2")
      .attr("flood-color", "#0f766e")
      .attr("flood-opacity", "0.3");

    const { width, height } = dimensions;
    const margin = { top: 60, right: 60, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create a zoomable group
    const g = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    
    svg.call(zoom);
    
    // Initial transform to center
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, margin.top));

    // Create hierarchy
    const hierarchy = d3.hierarchy(root, d => d.children);
    
    // Vertical tree layout (top to bottom)
    const treeLayout = d3.tree<TreeNode>().nodeSize([100, 120]);
    const rootNode = treeLayout(hierarchy);

    // Links
    g.selectAll(".link")
      .data(rootNode.links())
      .join("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2)
      .attr("d", d3.linkVertical<d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
        .x(d => d.x)
        .y(d => d.y)
      );

    // Nodes
    const nodeGroup = g.selectAll(".node")
      .data(rootNode.descendants())
      .join("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    // Draw TRAFO as inverted triangle, others as circles
    nodeGroup.each(function(d) {
      const el = d3.select(this);
      if (d.data.isTrafo) {
        // Inverted triangle
        el.append("path")
          .attr("d", d3.symbol().type(d3.symbolTriangle).size(500)())
          .attr("transform", "rotate(180)")
          .attr("fill", "#115e59")
          .attr("stroke", "#042f2e")
          .attr("stroke-width", 3);
      } else {
        // Circle
        el.append("circle")
          .attr("r", 12)
          .attr("fill", "#f8fafc")
          .attr("stroke", "#0f766e")
          .attr("stroke-width", 2);
      }
    });

    // Node labels (Ponto)
    nodeGroup.append("text")
      .attr("dy", d => d.data.isTrafo ? -25 : -20)
      .attr("x", 0)
      .attr("text-anchor", "middle")
      .text(d => d.data.ponto)
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "#1e293b");

    // Node secondary labels (Total Trecho or Trafo Atual)
    nodeGroup.append("text")
      .attr("dy", d => d.data.isTrafo ? 25 : 25)
      .attr("x", 0)
      .attr("text-anchor", "middle")
      .text(d => {
        if (d.data.isTrafo && trafoAtual) {
          return trafoAtual;
        }
        const c = d.data.data.totalTrecho;
        return c && c !== '0,00' ? `${c} kVA` : '';
      })
      .attr("font-size", d => d.data.isTrafo ? "12px" : "10px")
      .attr("font-weight", d => d.data.isTrafo ? "600" : "normal")
      .attr("fill", "#0f766e");

    // Edge labels (Comprimento)
    const linkGroup = g.selectAll(".link-label")
      .data(rootNode.links())
      .join("g")
      .attr("class", "link-label")
      .attr("transform", d => `translate(${(d.source.x + d.target.x) / 2},${(d.source.y + d.target.y) / 2})`);

    linkGroup.append("rect")
      .attr("x", -20)
      .attr("y", -12)
      .attr("width", 40)
      .attr("height", 24)
      .attr("fill", "white")
      .attr("opacity", 0.95)
      .attr("rx", 6)
      .attr("filter", "url(#glow)");

    linkGroup.append("text")
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .text(d => {
        const comp = d.target.data.data.comprimento;
        return comp ? `${comp}m` : '';
      })
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("fill", "#0f766e");

  }, [data, dimensions]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full overflow-hidden relative ${
        isReport 
          ? 'bg-white' 
          : 'bg-slate-50 rounded-2xl border border-slate-200 shadow-inner min-h-[600px]'
      }`}
    >
      {!isReport && (
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200 shadow-sm z-10 text-xs text-slate-600">
          <p><strong>Dica:</strong> Use o mouse para arrastar e o scroll para dar zoom.</p>
        </div>
      )}
      <svg 
        ref={svgRef} 
        width="100%" 
        height="100%" 
        className={isReport ? '' : 'cursor-grab active:cursor-grabbing'} 
      />
    </div>
  );
};
