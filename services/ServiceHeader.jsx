import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import {Button, Modal, ModalBody, ModalFooter} from "reactstrap";
import { ServiceContext } from "./ServiceContext";

const ServiceHeader = (props) => {
  const { step, maxStep, form, progressWidth, isSubmitting } =
    useContext(ServiceContext);

    const [modalText, setModalText] = useState(false);
    const [modalShown, setModalShown] = useState(false);

    const showModal = (text) => {
        setModalText(text);
        setModalShown(true);
    };

  return (
    <div>
      <div className="h5">
        <div className="d-flex justify-content-between justify-content-sm-center align-items-center">
          <Button
            disabled={isSubmitting}
            hidden={step === 0}
            onClick={props.buttonPreviousClick}
            color="primary"
            outline
            className="mr-sm-2"
            style={{ padding: "2px 8px" }}
          >
            {props.buttonPreviousCaption}
          </Button>
          <div
            className="d-sm-none"
            style={{ width: 42 }}
            hidden={step !== 0}
          />
          <span className="service-form-step mr-sm-3">
            {step + 1} / {maxStep}
          </span>
          <div className="d-sm-none" style={{ width: 42 }} />
          <div className="d-none d-sm-block" style={{ maxWidth: "60%" }}>
            {props.text}
              {props.modalQuestion && (
                  <button style={{marginLeft: '5px'}} type="button" className="btn btn-link p-0 btn-sm"
                      onClick={() => showModal(props.modalQuestion)}
                  >
                      <i className="far fa-question-circle fa-lg" />
                  </button>
              )}
          </div>

        </div>
        <div className="d-sm-none mt-3 text-center">{props.text}</div>
      </div>
      {/*form === "alimony" && (
        <div className="h5">
          <div className="d-flex justify-content-between align-items-center mx-auto mb-2 service-form-percents-header">
            <div>
              <span className="small font-weight-bold">
                Вероятность, что суд назначит алименты
              </span>
            </div>
            <div>
              <strong>{progressWidth}%</strong>
            </div>
          </div>
          <div
            className="d-flex justify-content-between align-items-center mx-auto border mb-2 service-form-percents-header"
            style={{ borderRadius: "20px" }}
          >
            <div
              style={{
                borderRadius: "20px",
                height: "8px",
                width: progressWidth + "%",
                background: "blue",
              }}
            ></div>
          </div>
          <div className="d-flex justify-content-between align-items-center mx-auto service-form-percents-header">
            <div>
              <small className="font-weight-light text-secondary">
                Шаг {step + 1} из {maxStep}
              </small>
            </div>
            <div>
              {step === 0 ? (
                <small>+ 20%</small>
              ) : step === 1 ? (
                <small>+ 25%</small>
              ) : step === 2 ? (
                <small>+ 15%</small>
              ) : (
                ""
              )}{" "}
              {step !== 3 && <small className="text-secondary"> за шаг</small>}
            </div>
          </div>
        </div>
      )*/}

        <Modal isOpen={modalShown} toggle={() => setModalShown(!modalShown)}>
            <ModalBody>{modalText}</ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={() => setModalShown(!modalShown)}>
                    Закрыть
                </Button>
            </ModalFooter>
        </Modal>

    </div>
  );
};

ServiceHeader.propTypes = {
  text: PropTypes.string,
  buttonPreviousClick: PropTypes.func,
  buttonPreviousCaption: PropTypes.node,
  modalQuestion: PropTypes.element,
};

ServiceHeader.defaultProps = {
  text: "",
  buttonPreviousClick: () => console.log("not implemented"),
  buttonPreviousCaption: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 11.9998C3 11.4475 3.44772 10.9998 4 10.9998H20C20.5523 10.9998 21 11.4475 21 11.9998C21 12.552 20.5523 12.9998 20 12.9998H4C3.44772 12.9998 3 12.552 3 11.9998Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.29402 12.7069C2.9035 12.3163 2.9035 11.6832 3.29402 11.2926L8.54375 6.04292C8.93427 5.6524 9.56744 5.6524 9.95796 6.04292C10.3485 6.43345 10.3485 7.06661 9.95796 7.45714L5.41534 11.9998L9.95796 16.5424C10.3485 16.9329 10.3485 17.5661 9.95796 17.9566C9.56744 18.3471 8.93427 18.3471 8.54375 17.9566L3.29402 12.7069Z"
        fill="currentColor"
      />
    </svg>
  ),
};

export default ServiceHeader;
