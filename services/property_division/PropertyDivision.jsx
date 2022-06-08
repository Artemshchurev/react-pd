import React from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import * as AdditionalSteps from "../additional-steps/AdditionalSteps";

export const getSteps = props => [
  {
    name: "Данные о заявителе",
    component: <Step1 name="Данные о заявителе"/>
  },
  {
    name: "Данные об ответчике",
    component: <Step2 name="Данные об ответчике"/>
  },
  {
    name: "Данные о браке",
    component: <Step3 name="Данные о браке"/>
  },
  ...AdditionalSteps.getSteps(props)
];

export const getFormData = () => {
  return {
    name: window.user ? window.user.name : "",
    address: {
      address: window.user ? window.user.address : ""
    },
    email: window.user ? window.user.email : "",
    spouse_name: "",
    spouse_address: {
      address: ""
    },
    spouse_email: "",
    spouse_phone: "",
    marriage_is_dissolved: "1",
    marriage_date: "",
    marriage_contract: null,
    marriage_agreement: null,
    kids: [],
    ...AdditionalSteps.getFormData()
  };
};

export const formattedData = data => {
  const marriage_date = {};
  if (data.marriage_is_dissolved === "1") {
    marriage_date.divorce_date = data.marriage_date;
  } else if (data.marriage_is_dissolved === "0") {
    marriage_date.date = data.marriage_date;
  }

  const fields = {
    fias: data.spouse_address.fias,
    house: data.spouse_address.house,
    fields: {
      spouse: {
        name: data.spouse_name,
        address: data.spouse_address.address,
        email: data.spouse_email,
        phone: data.spouse_phone,
      },
      marriage: {
        is_dissolved: data.marriage_is_dissolved,
        ...marriage_date,
      },
      kids: data.kids
    },
    react: true
  };

  if (data.debtor_no_other_children) {
    fields.fields.debtor.no_other_children = true;
  }

  return fields;
};
