import React, { createRef, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {Button, FormText, Label, Modal, ModalBody, ModalFooter} from "reactstrap";
import { AddressSuggestions } from "react-dadata";
import "react-dadata/dist/react-dadata.css";
import { ServiceContext } from "../ServiceContext";

const FieldAddress = (props) => {
  const id = props.id ?? props.name;

  const { dadataToken } = useContext(ServiceContext);

  const [placeholderShown, setPlaceholderShown] = useState(
    props.defaultValue.length === 0
  );
  const [lastSuggestion, setLastSuggestion] = useState("");

    const [modalText, setModalText] = useState(false);
    const [modalShown, setModalShown] = useState(false);

    const showModal = (text) => {
        setModalText(text);
        setModalShown(true);
    };

  const ref = createRef();

  function handleFocus() {
    setPlaceholderShown(false);
  }

  function handleBlur() {
    if (ref.current.textInput.value.length === 0) {
        ref.current.setInputValue('');
        setPlaceholderShown(true);
        props.onChange({
            address: '',
        });
    } else {
      ref.current.setInputValue(lastSuggestion);
      setPlaceholderShown(lastSuggestion.length === 0);
    }
    props.touchField();
  }

  const formProps = {
    placeholder: props.placeholder,
    name: props.name,
    readOnly: props.readOnly,
    disabled: props.readOnly,
    id,
    className: `form-control form-control-lg ${
      props.error && props.touched ? "is-invalid" : ""
    }`,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  const [needSuggestions, setNeedSuggestions] = useState(props.readOnly);
  const [suggestionsCountdown, setSuggestionsCountdown] = useState(5);

  useEffect(() => {
    if (ref.current && needSuggestions) {
      ref.current.fetchSuggestions();

      const interval = setInterval(() => {
        if (ref.current.state.suggestions.length > 0) {
          handleSuggestion(ref.current.state.suggestions[0]);
          props.touchField();
          setNeedSuggestions(false);
          setSuggestionsCountdown(0);
          clearInterval(interval);
        }

        if (suggestionsCountdown - 1 === 0) {
          clearInterval(interval);
        }

        setSuggestionsCountdown(suggestionsCountdown - 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  });

  function handleSuggestion(suggestion) {
    const value = getValueWithPostalCode(suggestion);
    if (suggestion.value !== value) {
      ref.current.setInputValue(value);
    }

    if (suggestion.data.house) {
      let fias;

      if (suggestion.data.street_fias_id) {
        fias = suggestion.data.street_fias_id;
      } else if (suggestion.data.settlement_fias_id) {
        fias = suggestion.data.settlement_fias_id;
      } else {
        fias = suggestion.data.city_fias_id;
      }

      props.onChange({
        address: value,
        fias: fias,
        house: suggestion.data.house,
      });
    } else {
      props.onChange({
        address: "",
      });
    }
    setLastSuggestion(value);
  }

  function getValueWithPostalCode(suggestion) {
    if (suggestion.data.postal_code) {
      return suggestion.data.postal_code + ", " + suggestion.value;
    } else {
      return suggestion.value;
    }
  }

  return (
      <React.Fragment>
          <AddressSuggestions
              ref={ref}
              token={dadataToken}
              count={5}
              minChars={3}
              defaultQuery={props.defaultValue}
              inputProps={formProps}
              onChange={handleSuggestion}
              containerClassName="form-label-group form-group"
          >
              <Label
                  htmlFor={id}
                  className={`${placeholderShown ? "" : "placeholder-hidden"} ${
                      props.error && props.touched ? "is-invalid" : ""
                  }`}
              >
                  <div className="d-flex justify-content-between">
                      <span>{props.placeholder}</span>
                      {props.percents &&
                      (placeholderShown ? (
                          <small className="d-lg-flex d-none align-items-center bg-primary text-white rounded-pill px-2 mr-4">
                              + {props.percents}%
                          </small>
                      ) : (
                          ""
                      ))}
                  </div>
              </Label>
          </AddressSuggestions>
          {props.hint && <div style={{marginTop: '-1rem', marginBottom: '1rem'}}>
              <FormText color="muted">{props.hint} {props.modalQuestion && (
                  <button style={{marginLeft: '5px'}} type="button" className="btn btn-link p-0 btn-sm"
                          onClick={() => showModal(props.modalQuestion)}
                  ><i className="far fa-question-circle fa-lg" style={{fontSize: "unset"}} /></button>
              )}</FormText>
          </div>}
          <div
              className="invalid-feedback"
              dangerouslySetInnerHTML={{
                  __html: props.touched && (props.error !== true ? props.error : ""),
              }}
          />
          <Modal isOpen={modalShown} toggle={() => setModalShown(!modalShown)}>
              <ModalBody>{modalText}</ModalBody>
              <ModalFooter>
                  <Button color="secondary" onClick={() => setModalShown(!modalShown)}>
                      Закрыть
                  </Button>
              </ModalFooter>
          </Modal>
      </React.Fragment>
  );
};

FieldAddress.propTypes = {
  placeholder: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  readOnly: PropTypes.bool,

  touched: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  hint: PropTypes.string,
  modalQuestion: PropTypes.element,

  defaultValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  touchField: PropTypes.func.isRequired,
};

FieldAddress.defaultProps = {
  placeholder: "Адрес",
  name: "address",
  readOnly: false,
};

export default FieldAddress;
