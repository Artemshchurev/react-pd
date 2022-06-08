import React, {createContext, useState} from "react";

import * as Alimony from "./alimony/Alimony";
import * as Divorce from "./divorce/Divorce";
import * as Claim from "./claim/Claim";
import * as Duty from "./duty/Duty";
import * as PropertyDivision from "./property_division/PropertyDivision";
import * as ChildCommunication from "./child_communication/ChildCommunication"
import * as AccruedWagesCollection from './accrued_wages_collection/AccruedWagesCollection'
import * as DebtCollection from './debt_collection/DebtCollection'
import * as Inheritance from "./inheritance/Inheritance"
import axios from "axios";
import Spinner from "./formFields/Spinner";

export const ServiceContext = createContext();

export const ServiceProvider = props => {
  const [isAuth, setIsAuth] = useState(!!window.user);
  const [user, setUser] = useState(window.user);
  const [step, setStep] = useState(0);
  const [maxStep] = useState(props.stepsLength ?? 0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [progressFields, setProgressFields] = useState([]);

  let formDataInitialState = {};

  switch (props.form) {
    case "alimony":
      formDataInitialState = Alimony.getFormData();
      break;
    case "divorce":
      formDataInitialState = Divorce.getFormData();
      break;
    case "claim":
      formDataInitialState = Claim.getFormData();
      break;
    case "property_division":
      formDataInitialState = PropertyDivision.getFormData();
      break;
    case "child_communication":
      formDataInitialState = ChildCommunication.getFormData();
      break;
    case "accrued_wages_collection":
      formDataInitialState = AccruedWagesCollection.getFormData();
      break;
    case "inheritance":
      formDataInitialState = Inheritance.getFormData();
      break
    case "debt_collection":
      formDataInitialState = DebtCollection.getFormData();
      break;
    case "duty":
      formDataInitialState = Duty.getFormData(props);
      break;
  }

  if (localStorage.getItem(props.form)) {
    formDataInitialState = JSON.parse(localStorage.getItem(props.form));
  }

  const [formData, setFormData] = useState(formDataInitialState);


  const previousStep = () => {
    const n = step - 1;
    if (step > 0) {
      setStep(n);
    }
  };

  const removeProgressField = (name, percent) => {
    if (progressFields.includes(name)) {
        const array = progressFields
        const index = progressFields.indexOf(name)
        array.splice(index, 1)
        setProgressFields(array)
        setProgressWidth(progressWidth - percent)
    }
  }

  const addProgressField = (name, percent) => {
    if (!progressFields.includes(name)) {

        const array = progressFields
        array.push(name)
        setProgressFields(array)

        if ((progressWidth + percent) >= 90){
            setProgressWidth(90)
            return
        }

        setProgressWidth((prev) => prev + percent)
    }
  }

  const storeData = data => {
    setFormData(data);
    localStorage.setItem(props.form, JSON.stringify(data));
  };

  const [isAccepted, setIsAccepted] = useState(true);
  const [acceptanceError, setAcceptanceError] = useState("");

  const nextStep = data => {
    if (!isAccepted) {
      setAcceptanceError("Примите условия лицензионного соглашения")
      return false;
    } else {
      setAcceptanceError("");
    }

    storeData(data);

    const n = step + 1;

    if (['alimony', 'divorce', 'claim', 'inheritance', 'accrued_wages_collection', 'debt_collection'].includes(props.form)) {
      ym(44274484, "reachGoal", props.form.toUpperCase() + '_' + n);
    }

    if (n < maxStep) {
      setStep(n);
      return true;
    } else {
      finish(data);
      return false;
    }
  };

  function formattedData(data) {
    switch (props.form) {
      case "alimony":
        return Alimony.formattedData(data);
      case "divorce":
        return Divorce.formattedData(data);
      case "claim":
        return Claim.formattedData(data);
      case "property_division":
        return PropertyDivision.formattedData(data);
      case "child_communication":
        return ChildCommunication.formattedData(data);
      case "inheritance":
        return Inheritance.formattedData(data);
      case "debt_collection":
        return DebtCollection.formattedData(data);
      case "accrued_wages_collection":
        return AccruedWagesCollection.formattedData(data);
      case "duty":
        return Duty.formattedData(data);
      default:
        return data;
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false);

  function finish(data) {
    setIsSubmitting(true);

    axios
      .post(props.storeUrl, formattedData(data), {
        headers: {
          "X-CSRF-TOKEN": props.csrfToken
        }
      })
      .then(response => {
        localStorage.removeItem(props.form);
        window.location.href = response.data.next;
      })
      .catch(() => alert("Во время выполнения запроса возникла ошибка, попробуйте позже"));
  }

  return (
    <ServiceContext.Provider
      value={{
        user,
        progressWidth,
        removeProgressField,
        addProgressField,
        step,
        isAuth,
        maxStep,
        formData,
        isSubmitting,
        isAccepted,
        acceptanceError,
        setUser,
        setIsAuth,
        setIsAccepted,
        previousStep,
        nextStep,
        ...props
      }}
    >
      {props.children}
      {isSubmitting
        ? <div
          className="service-form-backdrop"
          style={{
            position: "fixed",
            borderRadius: 0
          }}
        >
          <Spinner/>
        </div>
        : ''
      }
    </ServiceContext.Provider>
  );
};
