import React, {useContext} from "react";

import ServiceHeader from "../ServiceHeader";
import {Formik, Form} from "formik";
import FieldName from "../formFields/FieldName";
import FieldAddress from "../formFields/FieldAddress";
import FieldEmail from "../formFields/FieldEmail";
import ServiceFooter from "../ServiceFooter";
import {ServiceContext} from "../ServiceContext";

const Step1 = props => {
  const {step, isAuth, formData, nextStep} = useContext(ServiceContext);

  const buttonNextClick = data => {
    if (nextStep(data)) {
      props.jumpToStep(step + 1);
    }
  };

  return (
    <Formik
      initialValues={formData}
      validate={async values => {
        const errors = {};

        if (!values.name) {
          errors.name = true;
        } else if (/((?![а-яa-z\s]).)+/i.test(values.name)) {
          errors.name = "Укажите, используя буквы русского или латинского алфавита";
        } else if (/^\s/.test(values.name)) {
          errors.name = "Данное поле не может начинаться с пробела";
        } else if (!/^[а-яa-z]+\s[а-яa-z]+([а-яa-z\s]+)?$/i.test(values.name)) {
          errors.name = "Укажите полностью фамилию, имя и отчество (при наличии)";
        }

        if (!values.address.address) {
          errors.address = true;
        }

        if (!values.email) {
          errors.email = true;
        } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(values.email)) {
            errors.email = "Адрес электронной почты введен неверно. Проверьте правильность ввода";
        }

        return errors;
      }}
      onSubmit={buttonNextClick}
    >
      {({values, errors, touched, setFieldValue, setFieldTouched, isValid}) => (
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
            <FieldAddress
              touched={touched.address}
              error={errors.address}
              placeholder="Ваш адрес проживания"
              hint="Укажите номер дома и квартиры (при наличии)"
              readOnly={isAuth}
              defaultValue={values.address.address}
              onChange={address => setFieldValue("address", address)}
              touchField={() => setFieldTouched("address")}
            />
            <FieldEmail
              touched={touched.email}
              error={errors.email}
              readOnly={isAuth}
              value={values.email}
              onChange={e => setFieldValue("email", e.target.value)}
            />
          </div>
          <ServiceFooter isValid={isValid}/>
        </Form>
      )}
    </Formik>
  );
};
export default Step1;
