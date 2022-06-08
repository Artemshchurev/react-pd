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
    name: "Данные о браке",
    component: <Step2 name="Данные о браке"/>
  },
  {
    name: "Данные о детях",
    component: <Step3 name="Данные о детях"/>
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
    marriage_date: "",
    absence: false,
    kids: [],
    ...AdditionalSteps.getFormData()
  };
};

export const formattedData = data => {
  const fields = {
    plaintiff_fias: data.address.fias,
    plaintiff_house: data.address.house,
    fields: {
      marriage: {
        spouse_name: data.spouse_name,
        spouse_address: data.spouse_address.address,
        marriage_date: data.marriage_date
      },
      kids: data.kids
    },
    react: true
  };

  if (data.absence) {
    fields.fields.marriage.absence = true;
  }
  if (data.kids.length) {
    fields.fields.marriage.have_kids = true;
  }

  return fields;
};
