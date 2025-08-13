import z from "zod";

export class FlowDTO {
  static type = z.enum(["template", "instance"]);

  static tag = z.object({ text: z.string(), id: z.string() })
  static formField = z.object({
    id: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    label: z.string().optional(),
    placeholder: z.string().optional(),
    description: z.string().optional(),
    type: z.enum(['text', 'email', 'number', 'select', 'checkbox', 'radio', 'date']),
    required: z.boolean(),
    value: z.string(),
    options: z.array(FlowDTO.tag).optional(), //em caso de select // checkbox
    order: z.number().optional(),
    values: z.array(z.object({ id: z.string(), text: z.string() })).optional(),
    masterDetailValues: z.object({}).optional()
  })
  static sections = z.object({
    layout: z.enum(["cols-1", "cols-2", "cols-3", "cols-4"]),
    fields: z.array(FlowDTO.formField),
    id: z.string().min(1),
    order: z.number().min(1).optional()
  })
  static form = z.object({
    id: z.number().min(1).optional(),
    name: z.string().min(1),
    organizationId: z.number().min(1).optional(),
    sections: z.array(FlowDTO.sections).optional()
  })
  static conditionalRule = z.object({
    id: z.string(),
    fieldName: z.string(),
    operator: z.enum([
      "equals",
      "not_equals",
      "contains",
      "greater_than",
      "less_than",
      "greater_than_or_equals",
      "less_than_or_equals",
      "is_empty",
      "is_not_empty"
    ]),
    //podendo ser string[], Option[], string
    value: z.any(),
    logicalOperatorForNextRule: z.enum(["OR", "AND"]).optional()
  })
  static WebhookHeaderSchema = z.array(z.object({ property: z.string(), value: z.string() }));
  static webhookSchema = z.object({
    url: z.string().min(4),
    token: z.string().optional(),
    payload: z.array(z.string()).optional(),
    method: z.enum([
      "GET",
      "POST",
      "DELETE",
      "OPTIONS",
      "HEAD",
      "PUT",
      "PATCH"
    ]),
    headers: FlowDTO.WebhookHeaderSchema.optional()
  })

  static approverSchema = z.object({
    id: z.string(),
    userId: z.string(),
    email: z.string().email()
  })
  static flowNodeData = z.object({
    label: z.string().min(2),
    sourceNodeId: z.string().optional(),
    description: z.string().optional(),
    rules: z.array(FlowDTO.conditionalRule),        // se type === 'condition'
    status: z.enum(["pending", "completed", "failed", "skipped"]),
    createdBy: z.string(),
    form: FlowDTO.form,                             // se type === 'form'
    approvers: z.array(FlowDTO.approverSchema),     // se type === 'approval'
    webhook: FlowDTO.webhookSchema.optional(),      // se type === 'webhook'
  });

  static flowNode = z.object({
    id: z.number().min(1).optional(),
    type: z.enum(["stage", "form", "approval", "webhook", "condition"]),
    position: z.object({
      x: z.number(),
      y: z.number()
    }),
    data: FlowDTO.flowNodeData
  });

  static flowEdge = z.object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    sourceHandle: z.string(),
    targetHandle: z.string(),
    label: z.string().optional(),
  });

  static saveFlowDTO = z.object({
    id: z.number().min(1).optional(),
    organizationId: z.number().min(1).optional(),
    name: z.string().min(2),
    description: z.string().min(2).optional(),
    currentStage: z.string().optional(),
    isPublished: z.boolean().optional(),
    type: FlowDTO.type.optional(),
  });

  static getFlowDTO = z.object({
    page: z.string().min(1),
    pageSize: z.string().optional(),
    isPublished: z.preprocess((val) => Boolean(val), z.boolean().optional()),
    orgId: z.string().min(1)
  })

}
export type SaveFormDTO = z.infer<typeof FlowDTO.form>;

export type SaveFlowDTO = z.infer<typeof FlowDTO.saveFlowDTO>;
export type HeaderDTO = z.infer<typeof FlowDTO.WebhookHeaderSchema>;
export type SaveWebhookDTO = z.infer<typeof FlowDTO.webhookSchema>;
export type FlowTypeDTO = z.infer<typeof FlowDTO.type>;
export type GetFlowDTO = z.infer<typeof FlowDTO.getFlowDTO>;
export type FormSectionsSchema = z.infer<typeof FlowDTO.sections>
export type TagSchema = z.infer<typeof FlowDTO.tag>

export type RuleSchema = z.infer<typeof FlowDTO.conditionalRule>;

export type KeyofRuleSchema = keyof RuleSchema;