import React from "react";

import RegisterStep from "./RegisterStep";
import PassportStep from "./PassportStep";
import DocumentsStep from "./DocumentsStep";

export const getSteps = props => {
  const steps = [];

  if (props.needRegisterForm == 1) {
    steps.push({
      name: "Регистрация нового пользователя",
      component: <RegisterStep name="Регистрация нового пользователя"/>
    });
  }
  if (props.needPassportForm == 1) {
    steps.push({
      name: "Паспортные данные отправителя",
      component: <PassportStep name="Паспортные данные отправителя"/>
    });
  }
  if (props.needDocumentsForm == 1) {
    steps.push({
      name: "Документы для подписания",
      component: <DocumentsStep name="Документы для подписания"/>
    });
  }

  return steps;
};

export const getFormData = () => {
  return {
    phone: window.user ? window.user.phone : "",
    sms_code: "",
    date_of_birth: "",
    passport_number: "",
    passport_issuer: "",
    passport_date: "",
    inn: "",
    documents_sign: ""
  };
};
