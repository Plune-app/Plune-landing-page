import { type NodeProps } from "reactflow";
import React from "react";
import { FlowCard } from "../ui/FlowCard";
import { TypographyMuted } from "../ui/Typography";
import { DefaultNodeComponents } from "./DefaultNodeComponents";
import type { FlowNodeStatus } from "@/@types/Flow";

export const StageNodeType = React.memo((nodeProps: NodeProps<{ stage: "start" | "end", status : FlowNodeStatus }>) => {
  return (
    <FlowCard title="Stage" status={nodeProps.data.status}>
      <TypographyMuted content={nodeProps.data.stage} />

      <DefaultNodeComponents nodeProps={nodeProps} />
    </FlowCard>
  );
})