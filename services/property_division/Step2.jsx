import React, {useContext} from "react";

import ServiceHeader from "../ServiceHeader";
import FieldName from "../formFields/FieldName";
import FieldAddress from "../formFields/FieldAddress";
import {Formik, Form} from "formik";
import ServiceFooter from "../ServiceFooter";
import {ServiceContext} from "../ServiceContext";
import FieldEmail from "../formFields/FieldEmail";
import FieldPhone from "../formFields/FieldPhone";

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

  const isPhoneValid = phone => {
    const ruPhone_number = phone.replace(/\(|\)|\s+|-/g, "");
    return (
      ruPhone_number.length > 9 &&
      /^((\+7|7|8)+([0-9]){10})$/.test(ruPhone_number)
    );
  };

  const isPhoneSame = phone => {
    if (window.user?.phone) {
      const phone1 = window.user.phone.replace(/\(|\)|\s+|-|\+/g, "");
      const phone2 = phone.replace(/\(|\)|\s+|-|\+/g, "");
      return phone1.substr(1, phone1.length) === phone2.substr(1, phone2.length);
    } else {
      return false;
    }
  }

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

        if (!values.spouse_email) {
          errors.spouse_email = true;
        } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(values.email)) {
            errors.email = "Адрес электронной почты введен неверно. Проверьте правильность ввода";
        }

        if (!values.spouse_phone) {
          errors.spouse_phone = true;
        } else if (!isPhoneValid(values.spouse_phone)) {
          errors.spouse_phone = "Введите корректный номер телефона";
        } else if (isPhoneSame(values.spouse_phone)) {
          errors.spouse_phone = "Телефон ответчика совпадает с номером заявителя";
        }

        return errors;
      }}
      onSubmit={buttonNextClick}
    >
      {({values, errors, touched, setFieldValue, setFieldTouched, isValid}) => (
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
            <FieldEmail
              name="spouse_email"
              placeholder="Электронная почта супруга(и)"
              touched={touched.spouse_email}
              error={errors.spouse_email}
              value={values.spouse_email}
              onChange={e => setFieldValue("spouse_email", e.target.value)}
            />
            <FieldPhone
              name="spouse_phone"
              placeholder="Телефон супруга(и)"
              touched={touched.spouse_phone}
              error={errors.spouse_phone}
              value={values.spouse_phone}
              onChange={e => setFieldValue("spouse_phone", e.target.value)}
            />
          </div>
          <ServiceFooter isValid={isValid}/>
        </Form>
      )}
    </Formik>
  );
};
export default Step2;
