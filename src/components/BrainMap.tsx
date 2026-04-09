"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useKnowledgeStore } from "@/store/useKnowledgeStore";
import ForceGraph2D from "react-force-graph-2d";

interface BrainMapProps {
  width: number;
  height: number;
}

export default function BrainMap({ width, height }: BrainMapProps) {
  const {
    nodes,
    links,
    domains,
    selectedDomainId,
    selectedNodeId,
    selectNode,
  } = useKnowledgeStore();

  const fgRef = useRef<any>(null);

  const graphData = useMemo(() => {
    const domainMap = new Map(domains.map((d) => [d.id, d]));

    const graphNodes = nodes.map((n) => {
      const domain = domainMap.get(n.domainId);
      const isSelected = n.id === selectedNodeId;
      const isDimmed = selectedDomainId ? n.domainId !== selectedDomainId : false;
      return {
        id: n.id,
        name: n.title,
        val: n.importance * 2,
        color: domain?.color || "#4fc3f7",
        domainId: n.domainId,
        isSelected,
        isDimmed,
        importance: n.importance,
      };
    });

    const nodeIds = new Set(graphNodes.map((n) => n.id));
    const graphLinks = links
      .filter((l) => nodeIds.has(l.source) && nodeIds.has(l.target))
      .map((l) => ({
        source: l.source,
        target: l.target,
      }));

    return { nodes: graphNodes, links: graphLinks };
  }, [nodes, links, domains, selectedDomainId, selectedNodeId]);

  // Center on selected node
  useEffect(() => {
    if (selectedNodeId && fgRef.current) {
      const node = graphData.nodes.find((n) => n.id === selectedNodeId);
      if (node && (node as any).x !== undefined) {
        fgRef.current.centerAt((node as any).x, (node as any).y, 800);
        fgRef.current.zoom(3, 800);
      }
    }
  }, [selectedNodeId, graphData.nodes]);

  const handleNodeClick = useCallback(
    (node: any) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  // Custom 2D node rendering with glow
  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const { x, y, color, name, importance, isSelected, isDimmed } = node;
    const radius = Math.max(3, importance * 1.8);
    const fontSize = Math.max(10 / globalScale, 1.5);
    const alpha = isDimmed ? 0.12 : 1;

    // Outer glow
    if (!isDimmed) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, radius * 3, 0, 2 * Math.PI);
      ctx.fillStyle = color + (isSelected ? "25" : "10");
      ctx.fill();
      ctx.restore();
    }

    // Middle glow
    if (!isDimmed) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, radius * 1.8, 0, 2 * Math.PI);
      ctx.fillStyle = color + (isSelected ? "40" : "18");
      ctx.fill();
      ctx.restore();
    }

    // Core circle
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = isSelected ? 20 : 8;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();

    // Inner bright spot
    if (!isDimmed) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x - radius * 0.2, y - radius * 0.2, radius * 0.35, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(255,255,255," + (isSelected ? "0.6" : "0.3") + ")";
      ctx.fill();
      ctx.restore();
    }

    // Selection ring
    if (isSelected) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, radius + 2, 0, 2 * Math.PI);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5 / globalScale;
      ctx.stroke();
      ctx.restore();
    }

    // Label
    if (!isDimmed && globalScale > 0.6) {
      ctx.save();
      ctx.font = `${isSelected ? "bold " : ""}${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      // Background for label
      const textWidth = ctx.measureText(name).width;
      const padding = 2 / globalScale;
      ctx.fillStyle = "rgba(10,14,26,0.7)";
      ctx.fillRect(
        x - textWidth / 2 - padding,
        y + radius + 3 - padding / 2,
        textWidth + padding * 2,
        fontSize + padding
      );

      ctx.fillStyle = isSelected ? "#ffffff" : "rgba(200,214,229,0.75)";
      ctx.fillText(name, x, y + radius + 3);
      ctx.restore();
    }
  }, []);

  // Custom link rendering
  const paintLink = useCallback((link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const source = link.source;
    const target = link.target;
    if (!source || !target || source.x == null || target.x == null) return;

    const sourceNode = graphData.nodes.find((n) => n.id === (source.id || source));
    const targetNode = graphData.nodes.find((n) => n.id === (target.id || target));

    let alpha = 0.12;
    if (selectedDomainId) {
      if (sourceNode?.isDimmed && targetNode?.isDimmed) {
        alpha = 0.03;
      } else if (!sourceNode?.isDimmed && !targetNode?.isDimmed) {
        alpha = 0.3;
      }
    }
    if (selectedNodeId) {
      const sid = source.id || source;
      const tid = target.id || target;
      if (sid === selectedNodeId || tid === selectedNodeId) {
        alpha = 0.5;
      }
    }

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.strokeStyle = `rgba(79,195,247,${alpha})`;
    ctx.lineWidth = 0.5 / globalScale;
    ctx.stroke();
    ctx.restore();
  }, [graphData.nodes, selectedDomainId, selectedNodeId]);

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={graphData}
      width={width}
      height={height}
      backgroundColor="#0a0e1a"
      nodeCanvasObject={paintNode}
      nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
        const radius = Math.max(3, (node.importance || 3) * 1.8);
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 4, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      }}
      linkCanvasObject={paintLink}
      onNodeClick={handleNodeClick}
      d3AlphaDecay={0.02}
      d3VelocityDecay={0.3}
      warmupTicks={50}
      cooldownTicks={100}
      enableZoomInteraction={true}
      enablePanInteraction={true}
      minZoom={0.5}
      maxZoom={10}
    />
  );
}
