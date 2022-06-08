import React, {useContext} from "react";

import ServiceHeader from "../ServiceHeader";
import FieldName from "../formFields/FieldName";
import {Formik, Form} from "formik";
import ServiceFooter from "../ServiceFooter";
import {ServiceContext} from "../ServiceContext";
import FieldDate from "../formFields/FieldDate";
import {Button} from "reactstrap";

const Step3 = props => {
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

  const removeChild = (kids, index) => {
    kids.splice(index, 1);
    return kids;
  };

  const addNewChild = kids => {
    kids.push({
      name: "",
      birth_date: ""
    });
    return kids;
  };

  return (
    <Formik
      initialValues={formData}
      validate={async values => {
        const errors = {
          kids: []
        };

        let kidsHasError = false;

        if (values.kids.length) {
          values.kids.map((kid, index) => {
            errors.kids[index] = {};
            if (!kid.birth_date) {
              errors.kids[index].birth_date = true;
              kidsHasError = true;
            }

            if (!kid.name) {
              errors.kids[index].name = true;
              kidsHasError = true;
            } else if (/((?![а-яa-z\s]).)+/i.test(kid.name)) {
              errors.kids[index].name = "Укажите, используя буквы русского или латинского алфавита";
              kidsHasError = true;
            } else if (/^\s/.test(kid.name)) {
              errors.kids[index].name = "Данное поле не может начинаться с пробела";
              kidsHasError = true;
            } else if (!/^[а-яa-z]+\s[а-яa-z]+([а-яa-z\s]+)?$/i.test(kid.name)) {
              errors.kids[index].name = "Укажите полностью фамилию, имя и отчество (при наличии)";
              kidsHasError = true;
            }
          });
        }

        if (!kidsHasError) {
          delete errors.kids;
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
            {values.kids.length ? (
              <React.Fragment>
                <div className="kids">
                  {values.kids.map((kid, index) => (
                    <div className="card mb-3" key={index}>
                      <div className="card-body">
                        <FieldName
                          placeholder="Полное имя ребенка"
                          name={`kids.${index}.name`}
                          touched={
                            touched.kids &&
                            touched.kids[index] &&
                            touched.kids[index].name
                          }
                          error={
                            errors.kids &&
                            errors.kids[index] &&
                            errors.kids[index].name
                          }
                          value={kid.name}
                          onChange={value => setFieldValue(`kids.${index}.name`, value)}
                          touchField={() => setFieldTouched(`kids.${index}.name`)}
                        />
                        <FieldDate
                          name={`kids.${index}.birth_date`}
                          placeholder="Дата рождения"
                          touched={
                            touched.kids &&
                            touched.kids[index] &&
                            touched.kids[index]
                              .birth_date
                          }
                          error={
                            errors.kids &&
                            errors.kids[index] &&
                            errors.kids[index]
                              .birth_date
                          }
                          value={kid.birth_date}
                          onChange={(date, str) => setFieldValue(`kids.${index}.birth_date`, str)}
                          touchField={() => setFieldTouched(`kids.${index}.birth_date`)}
                        />
                        <Button
                          style={{
                            fontSize: 14,
                            lineHeight: "18px",
                            padding: "10px 20px"
                          }}
                          className={`float-right align-items-center ${values.kids.length === 1 ? 'd-none' : 'd-flex'}`}
                          outline
                          color="primary"
                          onClick={() => setFieldValue("kids", removeChild(values.kids, index))}
                        >
                          Удалить&nbsp;
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4.5 15.0779C4.5 15.9029 5.175 16.5779 6 16.5779H12C12.825 16.5779 13.5 15.9029 13.5 15.0779V6.07788H4.5V15.0779ZM6 7.57788H12V15.0779H6V7.57788ZM11.625 3.82788L10.875 3.07788H7.125L6.375 3.82788H3.75V5.32788H14.25V3.82788H11.625Z"
                              fill="currentColor"
                            />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  block
                  color="primary"
                  outline
                  onClick={() => setFieldValue("kids", addNewChild(values.kids))}
                >
                  Добавить еще ребенка
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="text-center mb-3">
                  Есть дети до 18 лет?
                </div>
                <div className="text-center mb-3 kids-text">
                  <Button
                    color="primary"
                    className="mr-3"
                    onClick={() => setFieldValue("kids", addNewChild(values.kids))}
                  >
                    Да
                  </Button>
                  <Button
                    color="primary"
                    outline
                    onClick={() => buttonNextClick(values)}
                  >
                    Нет
                  </Button>
                </div>
              </React.Fragment>
            )}
          </div>
          <ServiceFooter/>
        </Form>
      )}
    </Formik>
  );
};
export default Step3;
