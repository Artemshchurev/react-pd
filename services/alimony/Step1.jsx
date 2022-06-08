import React, {useContext} from "react";

import axios from "axios";
import ServiceHeader from "../ServiceHeader";
import {Formik, Form} from "formik";
import FieldPhone from "../formFields/FieldPhone";
import FieldName from "../formFields/FieldName";
import FieldAddress from "../formFields/FieldAddress";
import FieldEmail from "../formFields/FieldEmail";
import ServiceFooter from "../ServiceFooter";
import {ServiceContext} from "../ServiceContext";

const Step1 = props => {
  const {step, isAuth, formData, nextStep, authorizedWithEsia, isDesktop} = useContext(ServiceContext);

  const goToEnterData = !isAuth && !authorizedWithEsia;

  const accountExistsClick = (event) => {
    window.ym(44274484, "reachGoal", 'ALIMONY_ESIA');

    event.preventDefault();

    (new EnterData(process.env.MIX_ENTERDATA_ID)).startAuth(async function (session) {
      try {
        const response = await axios.get('/esia', {
          params: {session: session},
        });
        if (!response.data.error) {
          document.location.reload();
        }
      } catch {
        alert("Данный способ для Вас недоступен. Заполните данные вручную.");
      }
    })
  }

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

        const ruPhoneNumber = values.phone.replace(/\(|\)|\s+|-/g, "");

        if (!(ruPhoneNumber.length > 9 && /^((\+7|7|8)+([0-9]){10})$/.test(ruPhoneNumber))) {
          errors.phone = true;
        }

        return errors;
      }}
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
              touchField={() => setFieldTouched("email")}

            />
            <FieldPhone
              touched={touched.phone}
              error={errors.phone}
              readOnly={isAuth}
              value={values.phone}
              touchField={() => setFieldTouched("phone")}
              onChange={e => setFieldValue("phone", e.target.value)}
            />
          </div>
          <ServiceFooter/>
        </Form>
      )}
    </Formik>
  );
};
export default Step1;
