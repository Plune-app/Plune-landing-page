import { TagSchema } from "@/lib/DTO/flow.dto";
import { Tag } from "emblor";

export type FormFieldType = 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'radio' | 'date' | "password"

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  value?: (string|string[]);
  options?: TagSchema[] //em caso de select // checkbox
  order?: number;
  values?: TagSchema[];
  masterDetailValues? : Record<string, any>;
}

export interface Form {
  id: number
  name: string
  organizationId: string
  createdBy: { name : string, email : string, avatar?: string}
  createdAt: string
  updatedAt: string
  deletedAt: Date;
  sections: FormSections[];
  deleted?: boolean;
}

export type SectionLayout = "cols-1" | "cols-2" | "cols-3" | "cols-4";
export interface FormSections {
  layout: SectionLayout;
  fields: FormField[];
  id: string;
  order?: number;

} 