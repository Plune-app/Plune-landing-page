import { Handle, Position, type NodeProps } from "reactflow";
interface Props {
  nodeProps: NodeProps
}
export function DefaultNodeComponents({ nodeProps }: Props) {
  return (
    <>
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        isConnectable
        className={`${!nodeProps.selected && "opacity-90"} p-1 bg-zinc-200 dark:bg-zinc-200 -mr-5`}
        />
      <Handle
        className={`${!nodeProps.selected && "opacity-90"} p-1 bg-zinc-200 dark:bg-zinc-200 -ml-5`}
        id="left"
        isConnectable
        type="source"
        position={Position.Left}
      /></>
  );
}