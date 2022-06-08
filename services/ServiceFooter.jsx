import React, {useContext} from "react";
import {Button} from "reactstrap";
import {ServiceContext} from "./ServiceContext";
import PropTypes from "prop-types";
import FieldCheckbox from "./formFields/FieldCheckbox";

const ServiceFooter = props => {
  const {step, formNumber, customRulesUrl, isSubmitting, isAccepted, setIsAccepted, acceptanceError} = useContext(ServiceContext);

  return (
    <div className="card-footer">
      <div style={{maxWidth: "450px"}} className="mx-auto">
        <Button
          disabled={isSubmitting}
          type="submit"
          color="primary"
          size="lg"
          block
          className="mb-4"
        >
          {props.buttonNextCaption}
        </Button>
        <div className="mb-2">№ формы {formNumber}</div>
        <FieldCheckbox
          label={
            <React.Fragment>
              Я принимаю условия&nbsp;
              <a
                className="hover-dashed"
                target="_blank"
                href="/документы/Лицензионное соглашение.pdf"
              >
                лицензионного соглашения
              </a>
              {customRulesUrl
                ? <React.Fragment>
                  {" "}и&nbsp;
                  <a
                    className="hover-dashed"
                    target="_blank"
                    href={customRulesUrl}
                  >
                    правила
                  </a>
                </React.Fragment>
                : ""
              }
            </React.Fragment>
          }
          name="acceptance"
          checked={isAccepted}
          onChange={() => null}
          onClick={() => setIsAccepted(!isAccepted)}
          error={!isAccepted ? acceptanceError : null}
          touched={true}
        />
      </div>
    </div>
  );
};

ServiceFooter.defaultProps = {
  buttonNextCaption: "Далее",
};

ServiceFooter.propTypes = {
  buttonNextCaption: PropTypes.node,
};

export default ServiceFooter;
