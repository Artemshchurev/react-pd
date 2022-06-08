import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Field } from "formik";
import { FormGroup, FormText, Label } from "reactstrap";

const FieldEmail = (props) => {
  const id = props.id ?? props.name;


  const [placeholderShown, setPlaceholderShown] = useState(
    props.value.length === 0
  );

  function handleFocus() {
    setPlaceholderShown(false);
  }

  function handleBlur() {
    props.touchField();

    setPlaceholderShown(props.value.length === 0);
  }

  const formProps = {
    placeholder: props.placeholder,
    name: props.name,
    readOnly: props.readOnly,
    value: props.value,
  };

  if (props.percents) {
    formProps.onFocus = handleFocus;
    formProps.onBlur = handleBlur;
  }

  return (
    <FormGroup className="form-label-group">
      <Field
        type="email"
        className={`form-control form-control-lg ${
          props.error && props.touched ? "is-invalid" : ""
        }`}
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

FieldEmail.propTypes = {
  placeholder: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  readOnly: PropTypes.bool,

  touched: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  hint: PropTypes.string,

  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  touchField: PropTypes.func,
};

FieldEmail.defaultProps = {
  placeholder: "Электронная почта",
  name: "email",
  readOnly: false,
};

export default FieldEmail;
