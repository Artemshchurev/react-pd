import React from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import * as AdditionalSteps from "../additional-steps/AdditionalSteps";

export const getSteps = props => [
  {
    name: "Вид и сумма платежа",
    component: <Step1 name="Вид и сумма платежа"/>
  },
  {
    name: "Реквизиты плательщика",
    component: <Step2 name="Реквизиты плательщика"/>
  },
  ...AdditionalSteps.getSteps(props)
];

export const getFormData = (props) => {
  return {
    name: window.user ? window.user.name : '',
    inn: "",
    address: {
      address: window.user ? window.user.address : ""
    },
    email: window.user ? window.user.email : '',
    court_name: props.court,
    court_id: props.courtId,
    knows_amount: true,
    sum: "",
    type: "",
    ...AdditionalSteps.getFormData()
  };
};

export const formattedData = data => {
  const url = new URL(window.location.href);

  const fields = {
    fields: {
      court_id: data.court_id,
      knows_amount: data.knows_amount,
      sum: data.sum,
      type: data.type,
      inn: data.inn,
    },
    react: true
  };

  if (data.debtor_no_other_children) {
    fields.fields.debtor.no_other_children = true;
  }

  return fields;
};
