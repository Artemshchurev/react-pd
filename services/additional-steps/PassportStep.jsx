import React, {useContext, useState} from "react";

import ServiceHeader from "../ServiceHeader";
import {Formik, Form} from "formik";
import ServiceFooter from "../ServiceFooter";
import {ServiceContext} from "../ServiceContext";
import axios from "axios";
import FieldDate from "../formFields/FieldDate";
import FieldNumber from "../formFields/FieldNumber";
import FieldText from "../formFields/FieldText";

const PassportStep = props => {
  const {
    step,
    formData,
    nextStep,
    previousStep,
    checkInnUrl,
    csrfToken
  } = useContext(ServiceContext);

  const buttonNextClick = data => {
    if (nextStep(data)) {
      props.jumpToStep(step + 1);
    }
  };

  const buttonPreviousClick = () => {
    previousStep();
    props.jumpToStep(step - 1);
  };

  const [correctInn, setCorrectInn] = useState(null);

  async function isInnCorrect(data) {
    if (correctInn) {
      return correctInn === data.inn;
    }

    const isCorrect = await axios
      .post(
        checkInnUrl,
        {
          inn: data.inn,
          date_of_birth: data.date_of_birth,
          passport_number: data.passport_number,
          passport_date: data.passport_date,
          fio: data.name
        },
        {
          headers: {
            "X-CSRF-TOKEN": csrfToken
          }
        }
      )
      .then(response => {
        return response.status === 200 && response.data;
      })
      .catch(() => false);

    if (isCorrect) {
      setCorrectInn(data.inn);
    }

    return isCorrect;
  }

  return (
    <Formik
      initialValues={formData}
      validate={async values => {
        const errors = {};

        if (!values.date_of_birth) {
          errors.date_of_birth = "Введите дату рождения";
        }

        if (!values.passport_number) {
          errors.passport_number = "Введите серию и номер паспорта";
        } else if (!/^\d{4}\s?\d{6}$/i.test(values.passport_number)) {
          errors.passport_number = "Некорректные серия и номер паспорта";
        }

        if (!values.passport_issuer) {
          errors.passport_issuer = "Введите кем выдан паспорт";
        }

        if (!values.passport_date) {
          errors.passport_date = "Введите дату выдачи паспорта";
        }

        if (!values.inn) {
          errors.inn = "Введите ИНН";
        } else if (!/^\d{12}$/i.test(values.inn)) {
          errors.inn = "Некорректный ИНН";
        } else if (!Object.keys(errors).length) {
          if (!(await isInnCorrect(values))) {
            errors.inn = "Проверьте введенные данные. Комбинация ИНН и предоставленных паспортных данных не найдена на портале ФНС";
          } else {
            buttonNextClick(values);
          }
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
            <FieldDate
              placeholder="Дата рождения"
              name="date_of_birth"
              touched={touched.date_of_birth}
              error={errors.date_of_birth}
              value={values.date_of_birth}
              onChange={(date, str) => setFieldValue("date_of_birth", str)}
              onClose={() => setFieldTouched("date_of_birth")}
            />
            <FieldNumber
              placeholder="Серия и номер"
              name="passport_number"
              touched={touched.passport_number}
              error={errors.passport_number}
              value={values.passport_number}
              onChange={e => setFieldValue("passport_number", e.target.value)}
              regexp={/^[0-9\b]{0,4}\s?[0-9\b]{0,6}$/}
            />
            <FieldText
              placeholder="Кем выдан"
              name="passport_issuer"
              touched={touched.passport_issuer}
              error={errors.passport_issuer}
              value={values.passport_issuer}
              onChange={e => setFieldValue("passport_issuer", e.target.value)}
            />
            <FieldDate
              placeholder="Дата выдачи"
              name="passport_date"
              touched={touched.passport_date}
              error={errors.passport_date}
              value={values.passport_date}
              onChange={(date, str) => setFieldValue("passport_date", str)}
              onClose={() => setFieldTouched("passport_date")}
            />
            <FieldNumber
              placeholder="ИНН"
              name="inn"
              touched={touched.inn}
              error={errors.inn}
              value={values.inn}
              onChange={e => setFieldValue("inn", e.target.value)}
              regexp={/^[0-9\b]{0,12}$/}
            />
          </div>
          <ServiceFooter/>
        </Form>
      )}
    </Formik>
  );
};

export default PassportStep;
