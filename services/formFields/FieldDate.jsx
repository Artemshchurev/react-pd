import React, { useContext, useState } from "react";
import Flatpickr from "react-flatpickr";
import { Russian } from "flatpickr/dist/l10n/ru";
import PropTypes from "prop-types";
import moment from 'moment'
import { FormGroup, FormText, Label } from "reactstrap";

const FieldDate = (props) => {
  const id = props.id ?? props.name;

  const [placeholderShown, setPlaceholderShown] = useState(
    props.value.length === 0
  );

  function handleFocus() {
    setPlaceholderShown(false);
  }

  function handleBlur(date, dateStr) {
    props.touchField();

    setPlaceholderShown(dateStr.length === 0 && !props.value);
  }

  const formProps = {
    placeholder: "дд.мм.гггг",
    name: props.name,
    readOnly: props.readOnly,
    value: props.value,
  };

  if (props.percents) {
    formProps.onOpen = handleFocus;
    formProps.onClose = handleBlur;
  }
  return (
    <FormGroup className={`form-label-group ${props.className ?? ""}`}>
      <Flatpickr
        options={{
          locale: Russian,
          dateFormat: "d.m.Y",
          allowInput: true,
          disableMobile: true,
          maxDate: props.allowFuture ? undefined : "today",
          minDate: props.minDate,
          mode: props.mode,
        }}
        disablemobile="true"
        className={`form-control form-control-lg field-date ${
          props.error && props.touched ? "is-invalid" : ""
        }`}
        onChange={(selectedDates, dateStr) => {
            if (props.mode === 'multiple') {
                selectedDates = selectedDates
                    .sort((a, b) => moment(a).dayOfYear() - moment(b).dayOfYear())
                    .map(date => moment(date).format('DD.MM.YYYY'))
                dateStr = selectedDates.join(', ')
            }
            props.onChange(selectedDates, dateStr)
        }}
        onClose={props.onClose}
        {...formProps}
        id={id}
      />
      <Label htmlFor={id}>
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
      {props.hint && <FormText color="muted">{props.hint}</FormText>}
      <div className="invalid-feedback">{props.touched && props.error}</div>
    </FormGroup>
  );
};

FieldDate.propTypes = {
  placeholder: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  readOnly: PropTypes.bool,

  allowFuture: PropTypes.bool,
  touched: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  hint: PropTypes.string,

  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['single', 'multiple', 'range']),
  minDate: PropTypes.string,
};

FieldDate.defaultProps = {
  placeholder: "Дата",
  name: "date",
  readOnly: false,
  allowFuture: false,
  mode: 'single',
  minDate: '01.01.1900',
};

export default FieldDate;
