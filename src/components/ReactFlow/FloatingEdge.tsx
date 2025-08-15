import { getEdgeParams } from '@/lib/edgeParams';
import { useCallback } from 'react';
import { useStore, getBezierPath, type EdgeProps } from 'reactflow';


export function FloatingEdge({ id, source, target, markerEnd, style, selected }: EdgeProps) {
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <path
      id={id}
      className={`react-flow__edge-path hover:stroke-[5] stroke-[4]  ${selected ? "stroke-orange-600 stroke-[6]" : "stroke-zinc-400"}  `}
      strokeWidth={20}
      d={edgePath}
      markerEnd={markerEnd}
      style={style}
    />
  );
}
