import React, {useContext} from "react";

import ServiceHeader from "../ServiceHeader";
import FieldName from "../formFields/FieldName";
import FieldAddress from "../formFields/FieldAddress";
import {Formik, Form} from "formik";
import ServiceFooter from "../ServiceFooter";
import {ServiceContext} from "../ServiceContext";
import FieldDate from "../formFields/FieldDate";
import FieldCheckbox from "../formFields/FieldCheckbox";

const Step2 = props => {
  const {step, formData, previousStep, nextStep} = useContext(ServiceContext);

  const buttonNextClick = data => {
    if (nextStep(data)) {
      props.jumpToStep(step + 1);
    }
  };

  const buttonPreviousClick = () => {
    previousStep();
    props.jumpToStep(step - 1);
  };

  return (
    <Formik
      initialValues={formData}
      validate={async values => {
        const errors = {};

        if (!values.spouse_name) {
          errors.spouse_name = true;
        } else if (/((?![а-яa-z\s]).)+/i.test(values.spouse_name)) {
          errors.spouse_name = "Укажите, используя буквы русского или латинского алфавита";
        } else if (/^\s/.test(values.spouse_name)) {
          errors.spouse_name = "Данное поле не может начинаться с пробела";
        } else if (!/^[а-яa-z]+\s[а-яa-z]+([а-яa-z\s]+)?$/i.test(values.spouse_name)) {
          errors.spouse_name = "Укажите полностью фамилию, имя и отчество (при наличии)";
        }

        if (!values.spouse_address.address) {
          errors.spouse_address = true;
        }

        if (!values.marriage_date) {
          errors.marriage_date = true;
        } else if (!/^[0-3][0-9]\.[0-1][0-9]\.((19)|(20))[0-9]{2}$/.test(values.marriage_date)) {
          errors.marriage_date = "Введите корректную дату";
        }

        return errors;
      }}
      onSubmit={buttonNextClick}
    >
      {({values, errors, touched, setFieldValue, setFieldTouched}) => (
        <Form noValidate>
          <ServiceHeader
            text={props.name}
            buttonPreviousClick={buttonPreviousClick}
          />
          <div className="mx-auto" style={{maxWidth: 450}}>
            <FieldName
              touched={touched.spouse_name}
              error={errors.spouse_name}
              name="spouse_name"
              placeholder="ФИО супруга(и)"
              value={values.spouse_name}
              onChange={value => setFieldValue("spouse_name", value)}
              touchField={() => setFieldTouched("spouse_name")}
            />
            <FieldAddress
              touched={touched.spouse_address}
              error={errors.spouse_address}
              name="spouse_address"
              placeholder="Адрес супруга(и)"
              hint="Укажите номер дома и квартиры (при наличии)"
              defaultValue={values.spouse_address.address}
              onChange={address => setFieldValue("spouse_address", address)}
              touchField={() => setFieldTouched("spouse_address")}
            />
            <FieldDate
              placeholder="Дата заключения брака"
              name="marriage_date"
              touched={touched.marriage_date}
              error={errors.marriage_date}
              value={values.marriage_date}
              onChange={(date, str) => setFieldValue("marriage_date", str)}
              onClose={() => setFieldTouched("marriage_date")}
            />
            <FieldCheckbox
              label="Ходатайство о рассмотрении в мое отсутствие"
              name="absence"
              checked={values.absence}
              onChange={() => setFieldValue("absence", !values.absence)}
            />
          </div>
          <ServiceFooter/>
        </Form>
      )}
    </Formik>
  );
};
export default Step2;
