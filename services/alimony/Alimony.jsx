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
    name: "Данные о должнике",
    component: <Step2 name="Данные о должнике"/>
  },
  {
    name: "Данные о детях",
    component: <Step3 name="Данные о детях"/>
  },
  ...AdditionalSteps.getSteps(props)
];

export const getFormData = () => {
  let kids = [];
  if (window.userKids?.length) {
    for (const kid of window.userKids) {
      kids.push({
        name: kid.lastName + ' ' + kid.firstName + ' ' + kid.middleName,
        birth_date: kid.birthDate
      })
    }
  } else {
    kids.push({
      name: "",
      birth_date: ""
    })
  }

  return {
    name: window.user ? window.user.name : "",
    address: {
      address: window.user ? window.user.address : ""
    },
    email: window.user ? window.user.email : "",
    phone: window.user ? window.user.phone : "",
    debtor_name: "",
    debtor_address: {
      address: ""
    },
    debtor_birth_date: "",
    debtor_birth_place: "",
    debtor_work_place: "",
    debtor_identifier: "",
    debtor_no_other_children: false,
    kids: kids,
    ...AdditionalSteps.getFormData()
  };
};

export const formattedData = data => {
  const url = new URL(window.location.href);

  const fields = {
    fias: data.address.fias,
    house: data.address.house,
    fields: {
      debtor: {
        name: data.debtor_name,
        address: data.debtor_address.address,
        birth_date: data.debtor_birth_date,
        birth_place: data.debtor_birth_place,
        work_place: data.debtor_work_place,
        identifier: data.debtor_identifier
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
