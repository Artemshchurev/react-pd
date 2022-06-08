import React, {useContext, useEffect, useState} from "react";

import {ServiceContext} from "../ServiceContext";
import axios from "axios";
import ServiceHeader from "../ServiceHeader";
import {Formik, Form} from "formik";
import FieldNumber from "../formFields/FieldNumber";
import {Button} from "reactstrap";
import ServiceFooter from "../ServiceFooter";
import Spinner from "../formFields/Spinner";

const DocumentsStep = props => {
  const timerStart = 60;

  const {
    step,
    formData,
    nextStep,
    previousStep,
    documentsUrl,
    documentsSmsUrl,
    csrfToken
  } = useContext(ServiceContext);

  const [stage, setStage] = useState("documents");
  const [documents, setDocuments] = useState([]);
  const [timer, setTimer] = useState(timerStart);
  const [smsId, setSmsId] = useState(null);
  const [smsCode, setSmsCode] = useState(null);

  useEffect(() => {
    if (stage === "sms") {
      timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
    }
  }, [timer, stage]);

  const sendSms = () => {
    setTimer(timerStart);

    axios
      .get(documentsSmsUrl)
      .then(response => {
        setSmsId(response.status === 200 && response.data);
      });
  };

  const buttonNextClick = data => {
    if (stage === "documents") {
      setStage("sms");
      sendSms();
    } else {
      if (nextStep(data)) {
        props.jumpToStep(step + 1);
      }
    }
  };

  const buttonPreviousClick = () => {
    if (stage === "documents") {
      previousStep();
      props.jumpToStep(step - 1);
    } else {
      setStage("documents");
    }
  };

  async function isSmsCodeValid(data) {
    if (smsCode) {
      return smsCode === data.sms_code;
    }

    const isSigned = await axios
      .post(
        documentsUrl,
        {
          sms_id: smsId,
          sms_code: data.documents_sign
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

    if (isSigned) {
      setSmsCode(data.documents_sign);
    }

    return isSigned;
  }

  (() => {
    if (!documents.length) {
      axios
        .get(documentsUrl)
        .then(response => setDocuments(response.data));
    }
  })();

  return (
    <Formik
      initialValues={formData}
      validate={async values => {
        const errors = {};

        if (stage === "sms") {
          if (!values.documents_sign) {
            errors.documents_sign = "Введите код из СМС";
          } else if (!(await isSmsCodeValid(values))) {
            errors.documents_sign = "Неверный код";
          } else {
            buttonNextClick(values);
          }
        }

        return errors;
      }}
      onSubmit={buttonNextClick}
    >
      {({values, errors, touched, setFieldValue}) => (
        <Form noValidate>
          <ServiceHeader
            text={props.name}
            buttonPreviousClick={buttonPreviousClick}
          />
          <div className="mx-auto" style={{maxWidth: 450}}>
            {stage === "documents" ? (
              <React.Fragment>
                <div style={{marginBottom: 20}}>
                  Нажимая кнопку «Подписать», Вы соглашаетесь
                  и&nbsp;принимаете условия следующих
                  документов:
                </div>
                {documents.length ? (
                  documents.map((document, index) => (
                    <div
                      key={index}
                      className="d-flex"
                      style={{marginBottom: 10}}
                    >
                      <div className="mr-2">
                        <svg
                          width="21"
                          height="20"
                          viewBox="0 0 21 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.1665 2.5L12.467 2.19948L12.1665 2.075V2.5ZM16.3332 6.66667H16.7582L16.6337 6.36615L16.3332 6.66667ZM15.3332 17.075H5.6665V17.925H15.3332V17.075ZM5.0915 16.5V3.5H4.2415V16.5H5.0915ZM5.6665 2.925H12.1665V2.075H5.6665V2.925ZM15.9082 6.66667V16.5H16.7582V6.66667H15.9082ZM11.866 2.80052L16.0327 6.96719L16.6337 6.36615L12.467 2.19948L11.866 2.80052ZM11.7415 2.5V5.66667H12.5915V2.5H11.7415ZM13.1665 7.09167H16.3332V6.24167H13.1665V7.09167ZM5.6665 17.075C5.34894 17.075 5.0915 16.8176 5.0915 16.5H4.2415C4.2415 17.287 4.8795 17.925 5.6665 17.925V17.075ZM15.3332 17.925C16.1202 17.925 16.7582 17.287 16.7582 16.5H15.9082C15.9082 16.8176 15.6507 17.075 15.3332 17.075V17.925ZM11.7415 5.66667C11.7415 6.45367 12.3795 7.09167 13.1665 7.09167V6.24167C12.8489 6.24167 12.5915 5.98423 12.5915 5.66667H11.7415ZM5.0915 3.5C5.0915 3.18244 5.34894 2.925 5.6665 2.925V2.075C4.8795 2.075 4.2415 2.71299 4.2415 3.5H5.0915Z"
                            fill="#8DA7E8"
                          />
                          <line
                            x1="7.59492"
                            y1="9.92539"
                            x2="13.3866"
                            y2="9.92539"
                            stroke="#8DA7E8"
                            strokeWidth="0.85"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <line
                            x1="7.59492"
                            y1="13.2571"
                            x2="13.3866"
                            y2="13.2571"
                            stroke="#8DA7E8"
                            strokeWidth="0.85"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <a
                          className="hover-dashed"
                          target="_blank"
                          href={document.url}
                        >
                          {document.name}
                        </a>
                      </div>
                    </div>
                  ))
                ) : <Spinner/>}
              </React.Fragment>
            ) : (
              ""
            )}
            {stage === "sms" ? (
              <React.Fragment>
                <FieldNumber
                  placeholder="Код из СМС"
                  name="documents_sign"
                  touched={touched.documents_sign}
                  error={errors.documents_sign}
                  value={values.documents_sign}
                  onChange={e => setFieldValue("documents_sign", e.target.value)}
                  regexp={/^[0-9\b]{0,6}$/}
                />
                <div className="text-center">
                  <Button
                    color="link"
                    onClick={sendSms}
                    disabled={timer !== 0}
                    className="hover-dashed"
                  >
                    {timer > 0
                      ? `Отправить СМС снова (через ${timer} с)`
                      : "Отправить СМС снова"}
                  </Button>
                </div>
              </React.Fragment>
            ) : (
              ""
            )}
          </div>
          <ServiceFooter buttonNextCaption={stage === "documents" ? "Подписать" : "Подтвердить"}/>
        </Form>
      )}
    </Formik>
  );
};
export default DocumentsStep;
