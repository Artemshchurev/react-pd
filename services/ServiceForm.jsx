import React from "react";
import StepZilla from "react-stepzilla";
import {ServiceProvider} from "./ServiceContext";
import * as Alimony from "./alimony/Alimony";
import * as Divorce from "./divorce/Divorce";
import * as Duty from "./duty/Duty";
import * as Claim from "./claim/Claim";
import EsiaWarning from "./EsiaWarning";
import * as PropertyDivision from "./property_division/PropertyDivision";
import * as Inheritance from "./inheritance/Inheritance";
import * as ChildCommunication from './child_communication/ChildCommunication'
import * as DebtCollection from './debt_collection/DebtCollection'
import * as AccruedWagesCollection from './accrued_wages_collection/AccruedWagesCollection'

const ServiceForm = props => {
  const steps = [];

  switch (props.form) {
    case "alimony":
      steps.push(...Alimony.getSteps(props));
      break;
    case "divorce":
      steps.push(...Divorce.getSteps(props));
      break;
    case "claim":
      steps.push(...Claim.getSteps(props));
      break;
    case "property_division":
      steps.push(...PropertyDivision.getSteps(props));
      break;
    case "child_communication":
      steps.push(...ChildCommunication.getSteps(props));
      break;
    case "debt_collection":
      steps.push(...DebtCollection.getSteps(props));
      break;
    case "inheritance":
      steps.push(...Inheritance.getSteps(props));
      break;
    case "accrued_wages_collection":
      steps.push(...AccruedWagesCollection.getSteps(props));
      break;
    case "duty":
      steps.push(...Duty.getSteps(props));
      break;
  }

  return (
    <ServiceProvider stepsLength={steps.length} {...props}>
      <h3 className="card-header text-center service-line">
        Заполните электронное заявление
      </h3>
      <div className="card-body">
        <StepZilla
          steps={steps}
          showNavigation={false}
          showSteps={false}
          preventEnterSubmission={true}
        />
      </div>
      {props.form === "alimony" && EsiaWarning(props)}
    </ServiceProvider>
  );
};
export default ServiceForm;
