import React, {useContext, useEffect, useState} from "react";

import {ServiceContext} from "../ServiceContext";
import axios from "axios";
import ServiceHeader from "../ServiceHeader";
import {Formik, Form} from "formik";
import FieldPhone from "../formFields/FieldPhone";
import FieldNumber from "../formFields/FieldNumber";
import {Button} from "reactstrap";
import ServiceFooter from "../ServiceFooter";

const RegisterStep = props => {
  const timerStart = 60;

  const {
    form,
    step,
    formData,
    nextStep,
    previousStep,
    isAuth,
    setIsAuth,
    registerSmsUrl,
    loginSmsUrl,
    phoneExistsUrl,
    csrfToken
  } = useContext(ServiceContext);

  const [stage, setStage] = useState(form == "alimony" ? "sms" : "phone");
  const [availablePhone, setAvailablePhone] = useState(null);
  const [timer, setTimer] = useState(timerStart);
  const [smsId, setSmsId] = useState(null);
  const [smsCode, setSmsCode] = useState(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  useEffect(() => {
    if (stage === "sms") {
      timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
    }
  }, [timer, stage]);

  if (form == "alimony") {
    useEffect(() => {
      (async () => {
        if (await isPhoneAvailable(formData.phone)) {
          setIsAuthorizing(false);

          sendSms(formData, false);
        } else {
          setIsAuthorizing(true);

          sendSms(formData, true);
        }
      })()
    }, []);
  }

  const sendSms = (data, isAuthorizingFinal = isAuthorizing) => {
    setTimer(timerStart);

    axios
      .post(isAuthorizingFinal ? loginSmsUrl : registerSmsUrl, data)
      .then(response => {
        setSmsId(response.status === 200 && response.data);
      });
  };

  const buttonNextClick = data => {
    if (stage === "phone" && !isAuth) {
      setStage("sms");
      sendSms(data);
    } else {
      // if there can be more steps, just reload the page to log in and continue form filling
      //
      // if (isAuthorizing) {
      //   window.location.reload();
      // }
      if (nextStep(data)) {
        props.jumpToStep(step + 1);
      }
    }
  };

  const buttonPreviousClick = () => {
    if (stage === "phone") {
      previousStep();
      props.jumpToStep(step - 1);
    } else {
      setStage("phone");
    }
  };

  const isPhoneValid = phone => {
    const ruPhone_number = phone.replace(/\(|\)|\s+|-/g, "");
    return (
      ruPhone_number.length > 9 &&
      /^((\+7|7|8)+([0-9]){10})$/.test(ruPhone_number)
    );
  };

  async function isPhoneAvailable(phone) {
    if (availablePhone === phone) {
      return true;
    }

    const isAvailable = await axios
      .get(phoneExistsUrl, {
        params: {phone: phone}
      })
      .then(response => {
        return !(response.status === 200 && response.data.exists);
      });

    if (isAvailable) {
      setAvailablePhone(phone);
    }
    return isAvailable;
  }

  async function isSmsCodeValid(data) {
    if (smsCode) {
      return smsCode === data.sms_code;
    }

    if (isAuthorizing) {
      const isLoggedIn = await axios
        .post(
          "/login",
          {
            id: smsId,
            code: data.sms_code,
            react: true,
          }
        )
        .then(response => {
          return response.status === 200 && response.data.login;
        })
        .catch(() => false);

      if (isLoggedIn) {
        setIsAuth(true);
        setSmsCode(data.sms_code);
      }

      return isLoggedIn;
    } else {
      const isRegistered = await axios
        .post(
          "/register",
          {
            sms_id: smsId,
            sms_code: data.sms_code,
            name: data.name,
            address: data.address.address,
            email: data.email
          }
        )
        .then(response => {
          return response.status === 200 && response.data.register;
        })
        .catch(() => false);

      if (isRegistered) {
        setIsAuth(true);
        setSmsCode(data.sms_code);
      }

      return isRegistered;
    }
  }

  function getNextButtonCaption() {
    if (isAuth) {
      return undefined;
    } else if (stage === "sms") {
      return "??????????";
    } else if (isAuthorizing) {
      return "????????????????????????????"
    } else {
      return "?????????????????? ?????? ??????????????????????????"
    }
  }

  return (
    <Formik
      initialValues={formData}
      validate={async values => {
        const errors = {};

        if (!isAuth) {
          if (!values.phone) {
            errors.phone = true;
          } else if (isPhoneValid(values.phone)) {
            if (await isPhoneAvailable(values.phone)) {
              setIsAuthorizing(false);
            } else {
              setIsAuthorizing(true);
            }
          } else {
            errors.phone = "?????????????? ???????????????????? ?????????? ????????????????";
          }
        }

        if (stage === "sms") {
          if (!smsId) {
            errors.smsId = "smsId not found";
          } else if (!(await isSmsCodeValid(values))) {
            errors.sms_code = "???????????????? ??????";
          }
        }

        return errors;
      }}
      onSubmit={buttonNextClick}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({values, errors, touched, setFieldValue}) => (
        <Form noValidate>
          <ServiceHeader
            text={isAuthorizing || isAuth ? "??????????????????????" : props.name}
            buttonPreviousClick={buttonPreviousClick}
          />
          <div className="mx-auto" style={{maxWidth: 450}}>
            {stage === "phone" ? (
              <React.Fragment>
                <FieldPhone
                  touched={touched.phone}
                  error={errors.phone}
                  value={values.phone}
                  readOnly={isAuth}
                  onChange={e => setFieldValue("phone", e.target.value)}
                />
                <div
                  className="text-center"
                  hidden={!isAuthorizing}
                >
                  ?????????????? ?????? ????????????????????. ???????????? ??????????????????????????
                </div>
              </React.Fragment>
            ) : (
              ""
            )}
            {stage === "sms" ? (
              <React.Fragment>
                <FieldNumber
                  placeholder="?????? ???? ??????"
                  name="sms_code"
                  touched={touched.sms_code}
                  error={errors.sms_code}
                  value={values.sms_code}
                  onChange={e => setFieldValue("sms_code", e.target.value)}
                  regexp={/^[0-9\b]{0,6}$/}
                />
                <div className="text-center">
                  <Button
                    color="link"
                    onClick={() => sendSms(values)}
                    disabled={timer !== 0}
                    className="hover-dashed"
                  >
                    {timer > 0
                      ? `?????????????????? ?????? ?????????? (?????????? ${timer} ??)`
                      : "?????????????????? ?????? ??????????"}
                  </Button>
                </div>
              </React.Fragment>
            ) : (
              ""
            )}
          </div>
          <ServiceFooter buttonNextCaption={getNextButtonCaption()}/>
        </Form>
      )}
    </Formik>
  );
};
export default RegisterStep;
