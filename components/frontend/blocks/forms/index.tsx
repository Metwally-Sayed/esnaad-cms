import { BlockContent } from "@/lib/block-variants";
import AgencyRegistrationForm from "./AgencyRegistrationForm";
import FormDefault from "./FormDefault";

type FormFactoryProps = {
  variant: string;
  content: BlockContent;
  className?: string;
};

export const FormFactory = ({ variant, content, className }: FormFactoryProps) => {
  switch (variant) {
    case "agency-registration":
      return <AgencyRegistrationForm content={content as any} />;
    case "default":
    default:
      return <FormDefault content={content as any} />;
  }
};
