import React from "react";
import { Formik, Form, FormikValues, FormikHelpers } from "formik";
import * as Yup from "yup";

interface FormProviderProps {
  children: React.ReactNode;
  submitHandlar: (
    values: FormikValues,
    formikHelpers: FormikHelpers<FormikValues>
  ) => void;
  step?: number;
  initialValues: FormikValues;
  storageKey?: string;
  validationSchema?: Yup.AnySchema;
  formStepsLength?: number;
  isDynamicForm?: boolean;
}

const FormProvaider: React.FC<FormProviderProps> = ({
  children,
  submitHandlar,
  step,
  initialValues,
  validationSchema,
  formStepsLength,
  isDynamicForm,
}) => {
  const FormFieldWatcher: React.FC = () => {
    // const formik = useFormikContext<FormikValues>();

    // useEffect(() => {
    //   const formValues = formik.values;

    //   console.log("formValues", formValues);
    //   console.log(formik.errors);

    //   // localStorage.setItem("formData", JSON.stringify(formValues));
    // }, [formik.values]);

    return null;
  };

  return (
    <Formik
      onSubmit={(values, formikHelpers) => {
        submitHandlar(values, formikHelpers);

        if (!isDynamicForm) {
          formikHelpers?.resetForm();
          if (step === (formStepsLength as number) - 1) {
            void formikHelpers?.setValues(initialValues ?? {});
          } else {
            void formikHelpers?.setValues(values);
          }
        }
      }}
      initialValues={initialValues ?? {}}
      validationSchema={validationSchema}
    >
      {() => (
        <Form>
          <FormFieldWatcher />
          {children}
        </Form>
      )}
    </Formik>
  );
};

export default FormProvaider;
