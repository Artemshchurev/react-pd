import React, {useContext} from "react";

import axios from "axios";
import ServiceHeader from "../ServiceHeader";
import {Formik, Form} from "formik";
import FieldName from "../formFields/FieldName";
import FieldText from "../formFields/FieldText";
import FieldAddress from "../formFields/FieldAddress";
import FieldEmail from "../formFields/FieldEmail";
import FieldCheckbox from "../formFields/FieldCheckbox";
import ServiceFooter from "../ServiceFooter";
import {object, string, number} from "yup";
import {ServiceContext} from "../ServiceContext";

const Step2 = props => {
  const {step, isAuth, formData, nextStep, authorizedWithEsia, isDesktop} = useContext(ServiceContext);

  const goToEnterData = !isAuth && !authorizedWithEsia;

  const buttonNextClick = data => {
    if (nextStep(data)) {
      props.jumpToStep(step + 1);
    }
  };

  return (
    <Formik
      initialValues={formData}
      validationSchema={object().shape({
        name: string().required(),
        inn: string().required().matches(/^\d{12}$/, 'Это не похоже на ИНН'),
        address: object().shape({
          address: string().required()
        }),
        email: string().required().email(),
      })}
      onSubmit={buttonNextClick}
    >
      {({values, errors, touched, setFieldValue, setFieldTouched}) => (
        <Form noValidate>
          <ServiceHeader text={props.name}/>
          <div className="mx-auto" style={{maxWidth: 450}}>
            <FieldName
              touched={touched.name}
              error={errors.name}
              readOnly={isAuth}
              value={values.name}
              onChange={value => setFieldValue("name", value)}
              touchField={() => setFieldTouched("name")}
            />
            <FieldText
              touched={touched.inn}
              name="inn"
              error={errors.inn}
              placeholder="ИНН"
              value={values.inn}
              onChange={value => setFieldValue("inn", value)}
              touchField={() => setFieldTouched("inn")}
            />
            <FieldAddress
              touched={touched.address}
              id="dutyAddress"
              error={errors.address}
              readOnly={isAuth}
              defaultValue={values.address.address}
              onChange={value => setFieldValue("address", value)}
              touchField={() => setFieldTouched("address")}
            />
            <FieldEmail
              touched={touched.email}
              error={errors.email}
              readOnly={isAuth}
              value={values.email}
              onChange={value => setFieldValue("email", value)}
              touchField={() => setFieldTouched("email")}
            />
          </div>
          <ServiceFooter/>
        </Form>
      )}
    </Formik>
  );
};
export default Step2;
