import React, {useContext} from "react";

import ServiceHeader from "../ServiceHeader";
import FieldName from "../formFields/FieldName";
import FieldAddress from "../formFields/FieldAddress";
import {Formik, Form} from "formik";
import ServiceFooter from "../ServiceFooter";
import {ServiceContext} from "../ServiceContext";
import FieldDate from "../formFields/FieldDate";
import FieldCheckbox from "../formFields/FieldCheckbox";
import FieldText from "../formFields/FieldText";

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

        if (!values.debtor_name) {
          errors.debtor_name = true;
        } else if (/((?![а-яa-z\s]).)+/i.test(values.debtor_name)) {
          errors.debtor_name = "Укажите, используя буквы русского или латинского алфавита";
        } else if (/^\s/.test(values.debtor_name)) {
          errors.debtor_name = "Данное поле не может начинаться с пробела";
        } else if (!/^[а-яa-z]+\s[а-яa-z]+([а-яa-z\s]+)?$/i.test(values.debtor_name)) {
          errors.debtor_name = "Укажите полностью фамилию, имя и отчество (при наличии)";
        }

        if (!values.debtor_address.address) {
          errors.debtor_address = true;
        }

        if (!values.debtor_birth_date) {
          errors.debtor_birth_date = true;
        } else if (!/^[0-3][0-9]\.[0-1][0-9]\.((19)|(20))[0-9]{2}$/.test(values.debtor_birth_date)) {
          errors.debtor_birth_date = "Введите корректную дату";
        }

        if (!values.debtor_birth_place) {
          errors.debtor_birth_place = true;
        }

        if (!values.debtor_work_place) {
          errors.debtor_work_place = true;
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
              touched={touched.debtor_name}
              error={errors.debtor_name}
              name="debtor_name"

              placeholder="ФИО должника"
              value={values.debtor_name}
              onChange={value => setFieldValue("debtor_name", value)}
              touchField={() => setFieldTouched("debtor_name")}
            />
            <FieldAddress
              touched={touched.debtor_address}
              error={errors.debtor_address}
              name="debtor_address"
              placeholder="Адрес должника"
              hint="Укажите номер дома и квартиры (при наличии)"
              defaultValue={values.debtor_address.address}
              onChange={address => setFieldValue("debtor_address", address)}
              touchField={() => setFieldTouched("debtor_address")}
            />
            <FieldDate
              placeholder="Дата рождения"
              name="debtor_birth_date"
              touched={touched.debtor_birth_date}
              error={errors.debtor_birth_date}
              value={values.debtor_birth_date}
              onChange={(date, str) => setFieldValue("debtor_birth_date", str)}
              touchField={() => setFieldTouched("debtor_birth_date")}

            />
            <FieldText
              name="debtor_birth_place"
              placeholder="Место рождения"
              touched={touched.debtor_birth_place}
              error={errors.debtor_birth_place}
              value={values.debtor_birth_place}
              onChange={e => setFieldValue("debtor_birth_place", e.target.value)}
              touchField={() => setFieldTouched("debtor_birth_place")}

            />
            <FieldText
              name="debtor_work_place"
              placeholder="Место работы"
              touched={touched.debtor_work_place}
              error={errors.debtor_work_place}
              value={values.debtor_work_place}
              onChange={e => setFieldValue("debtor_work_place", e.target.value)}
              touchField={() => setFieldTouched("debtor_work_place")}

            />
            <FieldText
              name="debtor_identifier"
              placeholder="Идентификатор"
              hint="Укажите номер ИНН или СНИЛС должника. Если не знаете, оставьте пустым"
              value={values.debtor_identifier}
              onChange={e => setFieldValue("debtor_identifier", e.target.value)}
            />
            <FieldCheckbox
              label="Других детей не имеет"
              name="debtor_no_other_children"
              checked={values.debtor_no_other_children}
              onChange={() => setFieldValue("debtor_no_other_children", !values.debtor_no_other_children)}
            />
          </div>
          <ServiceFooter/>
        </Form>
      )}
    </Formik>
  );
};
export default Step2;
