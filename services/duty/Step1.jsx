import React, {useContext} from "react";

import axios from "axios";
import ServiceHeader from "../ServiceHeader";
import {Formik, Form} from "formik";
import FieldText from "../formFields/FieldText";
import FieldCheckbox from "../formFields/FieldCheckbox";
import ServiceFooter from "../ServiceFooter";
import {object, string, number} from "yup";
import {ServiceContext} from "../ServiceContext";

const Step1 = props => {
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
        sum: number().required(),
        type: string().when('knows_amount', {
          is: false,
          then: string().required()
        })
      })}
      onSubmit={buttonNextClick}
    >
      {({values, errors, touched, setFieldValue, setFieldTouched}) => (
        <Form noValidate>
          <ServiceHeader text={props.name}/>
          <div className="mx-auto" style={{maxWidth: 450}}>
            <FieldText
              touched={touched.court_name}
              error={errors.court_name}
              name="court_name"
              readOnly={true}
              placeholder="Территориальная подсудность"
              value={values.court_name}
              onChange={value => setFieldValue("court_name", value)}
              touchField={() => setFieldTouched("court_name")}
            />
            <FieldCheckbox
              label="Знаю сумму"
              name="knows_amount"
              checked={values.knows_amount}
              disabled={true}
              onChange={() => setFieldValue("knows_amount", !values.knows_amount)}
            />
            <FieldText
              touched={touched.sum}
              error={errors.sum}
              name="sum"
              placeholder="Сумма платежа"
              value={values.sum}
              onChange={value => setFieldValue("sum", value)}
              touchField={() => setFieldTouched("sum")}
            />
            {values.knows_amount ? null : (
              <FieldText
                touched={touched.type}
                error={errors.type}
                name="type"
                placeholder="Вид платежа"
                value={values.type}
                onChange={value => setFieldValue("type", value)}
                touchField={() => setFieldTouched("type")}
              />
            )}

          </div>
          <ServiceFooter/>
        </Form>
      )}
    </Formik>
  );
};
export default Step1;
