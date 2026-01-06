import { BlockContent } from "@/lib/block-variants";
import AgencyRegistrationForm from "./AgencyRegistrationForm";
import FormDefault from "./FormDefault";

type FormContent = BlockContent & {
  fields?: unknown[];
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  successMessage?: string;
  [key: string]: unknown;
};

type FormFactoryProps = {
  variant: string;
  content: FormContent;
};

export const FormFactory = ({ variant, content }: FormFactoryProps) => {
  switch (variant) {
    case "agency-registration":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <AgencyRegistrationForm content={content as any} />;
    case "default":
    default:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <FormDefault content={content as any} />;
  }
};
