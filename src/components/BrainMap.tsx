"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useKnowledgeStore } from "@/store/useKnowledgeStore";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import SpriteText from "three-spritetext";

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
      const isDimmed = selectedDomainId && n.domainId !== selectedDomainId;
      return {
        id: n.id,
        name: n.title,
        val: n.importance * 2,
        color: isDimmed
          ? "rgba(60,70,100,0.3)"
          : domain?.color || "#4fc3f7",
        domainId: n.domainId,
        description: n.content,
        isSelected,
        isDimmed: !!isDimmed,
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

  // Focus on selected node
  useEffect(() => {
    if (selectedNodeId && fgRef.current) {
      const node = graphData.nodes.find((n) => n.id === selectedNodeId);
      if (node) {
        const distance = 120;
        const nodePos = node as any;
        if (nodePos.x !== undefined) {
          fgRef.current.cameraPosition(
            {
              x: nodePos.x + distance,
              y: nodePos.y + distance / 2,
              z: nodePos.z + distance,
            },
            { x: nodePos.x, y: nodePos.y, z: nodePos.z },
            1000
          );
        }
      }
    }
  }, [selectedNodeId, graphData.nodes]);

  const handleNodeClick = useCallback(
    (node: any) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const nodeThreeObject = useCallback(
    (node: any) => {
      const group = new THREE.Group();

      // Main sphere
      const radius = Math.max(3, node.importance * 1.5);
      const geometry = new THREE.SphereGeometry(radius, 24, 24);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(node.color),
        transparent: true,
        opacity: node.isDimmed ? 0.15 : 0.85,
        emissive: new THREE.Color(node.color),
        emissiveIntensity: node.isSelected ? 0.8 : 0.3,
      });
      const sphere = new THREE.Mesh(geometry, material);
      group.add(sphere);

      // Glow effect
      if (!node.isDimmed) {
        const glowGeometry = new THREE.SphereGeometry(radius * 1.8, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(node.color),
          transparent: true,
          opacity: node.isSelected ? 0.2 : 0.08,
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        group.add(glow);
      }

      // Label
      if (!node.isDimmed) {
        const sprite = new SpriteText(node.name);
        sprite.color = node.isSelected ? "#ffffff" : "rgba(200,214,229,0.8)";
        sprite.textHeight = node.isSelected ? 3.5 : 2.5;
        sprite.position.set(0, radius + 5, 0);
        sprite.fontFace = "Inter, system-ui, sans-serif";
        sprite.backgroundColor = node.isSelected
          ? "rgba(10,14,26,0.8)"
          : "rgba(10,14,26,0.5)";
        sprite.padding = 1.5;
        sprite.borderRadius = 2;
        group.add(sprite as any);
      }

      return group;
    },
    []
  );

  const linkColor = useCallback(
    (link: any) => {
      if (selectedDomainId) {
        const sourceNode = nodes.find(
          (n) =>
            n.id === (typeof link.source === "object" ? link.source.id : link.source)
        );
        const targetNode = nodes.find(
          (n) =>
            n.id === (typeof link.target === "object" ? link.target.id : link.target)
        );
        if (
          sourceNode?.domainId !== selectedDomainId &&
          targetNode?.domainId !== selectedDomainId
        ) {
          return "rgba(30,40,80,0.1)";
        }
      }
      return "rgba(79,195,247,0.15)";
    },
    [selectedDomainId, nodes]
  );

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={graphData}
      width={width}
      height={height}
      backgroundColor="#0a0e1a"
      nodeThreeObject={nodeThreeObject}
      nodeThreeObjectExtend={false}
      onNodeClick={handleNodeClick}
      linkColor={linkColor}
      linkWidth={0.5}
      linkOpacity={0.3}
      linkDirectionalParticles={1}
      linkDirectionalParticleWidth={1.2}
      linkDirectionalParticleSpeed={0.004}
      linkDirectionalParticleColor={() => "rgba(79,195,247,0.5)"}
      d3AlphaDecay={0.02}
      d3VelocityDecay={0.3}
      warmupTicks={50}
      cooldownTicks={100}
      showNavInfo={false}
    />
  );
}
