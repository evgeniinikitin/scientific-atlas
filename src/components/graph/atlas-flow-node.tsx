"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { AtlasNode } from "@/domains/atlas/types";
import { NODE_STATUS_LABELS, NODE_TYPE_LABELS } from "@/domains/atlas/types";

export type AtlasFlowNodeType = Node<{ atlas: AtlasNode }, "atlas">;

export function AtlasFlowNode({ data, selected }: NodeProps<AtlasFlowNodeType>) {
  const node = data.atlas;
  return (
    <div className={`flow-node type-${node.type} status-${node.status} ${selected ? "selected" : ""}`} title={`${NODE_TYPE_LABELS[node.type]} · ${NODE_STATUS_LABELS[node.status]}\n${node.shortDescription}`}>
      <Handle type="target" position={Position.Left} className="node-handle" />
      <span className="node-code">{node.type.slice(0, 3).toUpperCase()} / {node.evidenceLevel}</span>
      <strong>{node.title}</strong>
      <span className="node-status">{NODE_STATUS_LABELS[node.status]}</span>
      <Handle type="source" position={Position.Right} className="node-handle" />
    </div>
  );
}
