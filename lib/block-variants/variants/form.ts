import { BlockTypeDefinition } from "../types";

export const formDefinition: BlockTypeDefinition = {
  type: "FORM",
  label: "Form",
  description: "Dynamic form builder for contact and application forms",
  defaultVariant: "form-default",
  variants: [
    {
      id: "form-default",
      type: "FORM",
      name: "Default Form",
      description: "Standard form with dynamic fields",
      fields: [
        {
          name: "title",
          label: "Title",
          type: "text",
          defaultValue: "CONTACT US",
        },
        {
          name: "subtitle",
          label: "Subtitle",
          type: "textarea",
          defaultValue: "We'd love to hear from you.",
        },
        {
          name: "submitLabel",
          label: "Submit Button Label",
          type: "text",
          defaultValue: "SUBMIT",
        },
        {
          name: "successMessage",
          label: "Success Message",
          type: "text",
          defaultValue: "Thank you for your submission!",
        },
        {
          name: "fields",
          label: "Form Fields",
          type: "list",
          itemLabel: "Field",
          minItems: 1,
          fields: [
            {
              name: "name",
              label: "Field Name (ID)",
              type: "text",
              placeholder: "e.g., first_name",
              required: true,
            },
            {
              name: "label",
              label: "Label",
              type: "text",
              placeholder: "e.g., First Name",
              required: true,
            },
            {
              name: "type",
              label: "Input Type",
              type: "select",
              options: [
                { label: "Text", value: "text" },
                { label: "Email", value: "email" },
                { label: "Phone (with Country Code)", value: "tel" },
                { label: "Textarea", value: "textarea" },
                { label: "File Upload", value: "file" },
                { label: "Select Dropdown", value: "select" },
              ],
              defaultValue: "text",
            },
            {
              name: "placeholder",
              label: "Placeholder",
              type: "text",
            },
            {
              name: "required",
              label: "Required",
              type: "switch",
              defaultValue: true,
            },
            {
              name: "width",
              label: "Width",
              type: "select",
              options: [
                { label: "Full Width", value: "full" },
                { label: "Half Width", value: "half" },
              ],
              defaultValue: "full",
            },
            {
              name: "options",
              label: "Options (for Select type only)",
              type: "list",
              itemLabel: "Option",
              fields: [
                {
                  name: "label",
                  label: "Label",
                  type: "text",
                },
                {
                  name: "value",
                  label: "Value",
                  type: "text",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "agency-registration",
      type: "FORM",
      name: "Agency Registration Form",
      description: "Registration form with sections and file uploads",
      fields: [
        {
          name: "title",
          label: "Title",
          type: "text",
          defaultValue: "AGENCY REGISTRATION",
        },
        {
          name: "subtitle",
          label: "Subtitle",
          type: "textarea",
          defaultValue: "WELCOME TO THE REAL ESTATE BROKERAGE REGISTRATION PORTAL",
        },
        {
          name: "introText",
          label: "Intro Text",
          type: "textarea",
          defaultValue: "WE ARE EXCITED TO ESTABLISH PARTNERSHIPS...",
        },
        {
          name: "submitLabel",
          label: "Submit Button Label",
          type: "text",
          defaultValue: "REGISTER NOW",
        },
        {
          name: "successMessage",
          label: "Success Message",
          type: "text",
          defaultValue: "Thank you for your registration request!",
        },
        {
          name: "fields",
          label: "Form Fields",
          type: "list",
          itemLabel: "Field",
          minItems: 1,
          fields: [
            {
              name: "name",
              label: "Field Name (ID)",
              type: "text",
              placeholder: "e.g., company_name",
              required: true,
            },
            {
              name: "label",
              label: "Label",
              type: "text",
              placeholder: "e.g., Company Name",
              required: true,
            },
            {
              name: "type",
              label: "Input Type",
              type: "select",
              options: [
                { label: "Text", value: "text" },
                { label: "Email", value: "email" },
                { label: "Phone (with Country Code)", value: "tel" },
                { label: "Textarea", value: "textarea" },
                { label: "File Upload", value: "file" },
                { label: "Select Dropdown", value: "select" },
                { label: "Section Header", value: "section-header" },
              ],
              defaultValue: "text",
            },
            {
              name: "placeholder",
              label: "Placeholder",
              type: "text",
            },
            {
              name: "required",
              label: "Required",
              type: "switch",
              defaultValue: true,
            },
            {
              name: "width",
              label: "Width",
              type: "select",
              options: [
                { label: "Full Width", value: "full" },
                { label: "Half Width", value: "half" },
              ],
              defaultValue: "full",
            },
            {
              name: "options",
              label: "Options (for Select type only)",
              type: "list",
              itemLabel: "Option",
              fields: [
                {
                  name: "label",
                  label: "Label",
                  type: "text",
                },
                {
                  name: "value",
                  label: "Value",
                  type: "text",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
