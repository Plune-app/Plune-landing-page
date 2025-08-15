import { Handle, Position, useReactFlow, type NodeProps } from "reactflow";
import { DefaultNodeComponents } from "./DefaultNodeComponents";
import type { ConditionRule, FlowNode, FlowNodeData } from "@/@types/Flow";
import { TypographyMuted } from "../ui/Typography";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { FlowCard } from "../ui/FlowCard";
import { RuleSchema } from "@/lib/DTO/flow.dto";
import { RULES } from "@/lib/constants/rules";
import { ComboSelect } from "../ui/ComboSelect";
import { Option } from "../ui/multiselect";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useMutation } from "@tanstack/react-query";
import { ManipulationType, useFlow } from "@/hooks/use-flow";
import { useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Plus, Trash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { FormField } from "@/@types/Form";
import MultiSelectControlled from "../ui/MultiSelectControlled";

export const ConditionNodeType = memo((nodeProps: NodeProps<FlowNodeData>) => {
  const [rules, setRules] = useState(nodeProps.data.rules ?? []);
  const [fields, setFields] = useState<FormField[]>([]);
  const params = useParams<{ id: string, type: ManipulationType }>();

  const { replaceNodeById } = useFlow();
  const { mutateAsync } = useMutation({
    mutationFn: replaceNodeById,
    mutationKey: ["replace-node", params.id],
  });
  const { getNodes, setNodes } = useReactFlow();
  const handleAddNewRule = useCallback(() => {
    const newRule: ConditionRule = { id: crypto.randomUUID(), fieldName: "", operator: "equals" };
    const nodesUpdated = (getNodes() as FlowNode[]).map(
      (node) => {
        if (node.id == nodeProps.id) {
          const nodeUpdated = {
            ...node, data: { ...node.data, rules: [...node.data.rules ?? [], newRule] }
          } as FlowNode
          mutateAsync({
            flow: {
              id: parseInt(params.id!),
              type: params.type!
            },
            node: nodeUpdated
          });
          return nodeUpdated
        }
        return node;
      }
    )

    setNodes(nodesUpdated);
  }, [rules]);

  const handleDelete = useCallback((id: string) => {
    setNodes(
      (getNodes() as FlowNode[]).map(
        (node) => {
          if (node.id == nodeProps.id) {
            const nodeUpdated = {
              ...node,
              data: {
                ...node.data,
                rules: node.data.rules ? node.data.rules.filter((rule) => rule.id != id) : []
              }
            }
            mutateAsync({
              flow: {
                id: parseInt(params.id!),
                type: params.type!
              },
              node: nodeUpdated
            });
            return nodeUpdated;
          }
          return node;
        }
      ))
  }, [rules]);

  useEffect(() => {
    if (nodeProps.data.sourceNodeId) {
      const sourceNode = getNodes().find((node) => node.id == nodeProps.data.sourceNodeId) as FlowNode;

      if (sourceNode.type == "form" && sourceNode.data.form && sourceNode.data.form.sections) {
        const formSections = sourceNode.data.form.sections;

        let fieldsArr: FormField[] = [];
        formSections.forEach((section) => {
          section.fields.forEach((field) => {
            fieldsArr = [...fieldsArr, field]
          })
        })
        setFields(fieldsArr)
      }
    }
  }, [nodeProps.data.sourceNodeId]);

  useEffect(() => {
    if (nodeProps.data.rules) {
      setRules(nodeProps.data.rules)
    }
  }, [nodeProps.data.rules]);

  return (
    <FlowCard
      status={nodeProps.data.status ?? "pending"}
      title={"Conditional rules"}
      headerAction={
        <Tooltip>
          <TooltipTrigger onClick={handleAddNewRule}>
            <Button size={"icon"} variant={"ghost"}>
              <Plus size={15} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add new rule</p>
          </TooltipContent>
        </Tooltip>
      }
    >
      <header className="flex flex-col gap-1">
        <TypographyMuted
          className="border-b border-zinc-200 dark:border-zinc-700 pb-2"
          content="Rules to be applied after form submission"
        />
      </header>
      {rules && rules.map((rule, idx) => (
        <RuleSlot
          sourceFormFields={fields}
          handleDelete={handleDelete}
          key={rule.id}
          nodeId={nodeProps.id}
          rule={rule}
          hasNext={rules![idx + 1] != undefined}
        />
      ))}
      <DefaultNodeComponents nodeProps={nodeProps} />
      <Handle
        className={`${!nodeProps.selected && "opacity-90"} p-1 bg-zinc-200 dark:bg-zinc-200 -mb-5`}
        id="left"
        type="source"
        position={Position.Bottom}
      />
    </FlowCard >
  );
})
interface RuleSlotProps {
  sourceFormFields: FormField[]
  rule: RuleSchema;
  nodeId: string;
  hasNext: boolean;
  handleDelete: (id: string) => void;
}
function RuleSlot({ rule, nodeId, hasNext, handleDelete, sourceFormFields }: RuleSlotProps) {
  const { replaceNodeById } = useFlow();
  const { setNodes, getNodes } = useReactFlow();

  const params = useParams();
  const fields = useMemo<Option[]>(
    () => sourceFormFields.map(
      (field) => ({ label: field.name, value: field.name })
    ), [sourceFormFields]
  );
  const fieldSelectedAccordingRuleFieldName = sourceFormFields.find((field) => field.name == rule.fieldName)

  const fieldFromSourceFormFields = sourceFormFields.find((field) => field.name == rule.fieldName);
  const rules: Option[] = useMemo(
    () => RULES.map(
      (rule) => ({ value: rule, label: rule })
    ) satisfies Option[], []
  );

  const { mutateAsync } = useMutation({
    mutationFn: replaceNodeById,
    mutationKey: ["replace-node", params.id],
  });

  const handleChangeRuleSlot = useCallback((
    value: (string | string[]),
    type: "operator" | "fieldName" | "value" | "logicalOperatorForNextRule"
  ) => {
    setNodes(
      (getNodes() as FlowNode[]).map((node) => {
        if (node.id == nodeId) {
          const nodeUpdated = {
            ...node,
            data: {
              ...node.data,
              rules: node.data.rules?.map((mappedRule) => {
                if (mappedRule.id == rule.id) {
                  return { ...mappedRule, [type]: value }
                }
                return mappedRule
              })
            }
          }
          mutateAsync({
            node: nodeUpdated,
            flow: {
              type: params.type as ManipulationType,
              id: parseInt(params.id!)
            }
          })
          return nodeUpdated
        }
        return node;
      })
    )
  }, [rule, getNodes, setNodes, params]);

  useEffect(() => {
    handleChangeRuleSlot("", "value");
  }, [rule.fieldName])
  return (
    <>
      <Card className="flex flex-col gap-2 px-2 py-3">
        <div className="flex gap-2">
          <ComboSelect
            className="w-full"
            placeholder="Choose a field"
            setValue={(value) => handleChangeRuleSlot(value, "fieldName")}
            value={rule.fieldName ?? "None"}
            options={fields}
          />
          <Button
            className="self-end"
            size={"icon"}
            onClick={() => handleDelete(rule.id)}
            variant={"destructive"}
          >
            <Trash size={15} />
          </Button>
        </div>

        <ComboSelect
          className="w-full"
          options={rules}
          placeholder={'Operator'}
          setValue={(val) => handleChangeRuleSlot(val, "operator")}
          value={rule.operator}
        />
        {
          fieldFromSourceFormFields &&
            fieldFromSourceFormFields.options &&
            fieldFromSourceFormFields.type == "select" &&
            fieldSelectedAccordingRuleFieldName &&
            fieldSelectedAccordingRuleFieldName.options
            ? (
              <ComboSelect
                className="w-full"
                placeholder="Value for compare"
                setValue={(value) => handleChangeRuleSlot(value, "value")}
                value={rule.value ?? ""}
                options={fieldSelectedAccordingRuleFieldName.options.map((opt) => ({ label: opt.text, value: opt.id })) ?? []}
              />
            ) : fieldFromSourceFormFields && fieldFromSourceFormFields?.type == "checkbox" ? (
              <MultiSelectControlled
                options={fieldSelectedAccordingRuleFieldName!.options?.map((opt) => ({ label: opt.text, value: opt.text })) ?? []}
                setSelected={(selected) => handleChangeRuleSlot(selected, "value")}
                selected={(rule.value as string[]) ?? []}
                onChange={(selected) => handleChangeRuleSlot(selected, "value")}
              />
            ) : (
              <Input
                name="value"
                disabled={!rule.fieldName}
                placeholder={!rule.fieldName ? "Select an field to set value" : "Change value to compare"}
                value={rule.value ? rule.value.toString() : ""}
                onChange={(e) => handleChangeRuleSlot(e.target.value, "value")}
              />
            )}
      </Card>
      {hasNext && (
        <div>
          <RadioGroup
            defaultValue={rule.logicalOperatorForNextRule}
            onValueChange={(a) => handleChangeRuleSlot(a, "logicalOperatorForNextRule")}
            className="flex "
          >
            <Card
              className={`${rule.logicalOperatorForNextRule == "AND" ? "border border-zinc-600 dark:border-zinc-50" : ""} w-full relative cursor-pointer`}
            >
              <CardContent className="flex items-center justify-between">
                <Label htmlFor="AND">AND</Label>
                <RadioGroupItem className=" after:absolute after:inset-0" value="AND" id="AND" />
              </CardContent>
            </Card>
            <Card className={`${rule.logicalOperatorForNextRule == "OR" ? "border border-zinc-600 dark:border-zinc-50" : ""} w-full relative cursor-pointer`}>
              <CardContent className="flex items-center justify-between">
                <Label htmlFor="OR">OR</Label>
                <RadioGroupItem className=" after:absolute after:inset-0" value="OR" id="OR" />
              </CardContent>
            </Card>
          </RadioGroup>
        </div>
      )}
    </>

  )

}