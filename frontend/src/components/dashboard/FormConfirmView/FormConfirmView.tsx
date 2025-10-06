import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "../../../hooks/Forms/useForm";

const FormConfirmView: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const { form } = useForm(formId ?? "");

  useEffect(() => {}, [form?.version]);

  return <div>FormConfirmView</div>;
};

export default FormConfirmView;
