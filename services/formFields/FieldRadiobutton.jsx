import React from "react";
import PropTypes from "prop-types";
import {Field} from "formik";
import {FormGroup, FormText, Label} from "reactstrap";

const FieldRadiobutton = props => {
  const id = props.id ?? props.name + "_" + props.value;

  const formProps = {
    placeholder: props.placeholder,
    name: props.name,
    readOnly: props.readOnly,
    checked: props.checked,
    onClick: props.onClick,
    value: props.value,
    style: props.style,
  };

  return (
    <FormGroup className={`custom-control custom-radio ${props.className ?? ''}`} style={props.style}>
      <Field
        type="radio"
        className={`custom-control-input ${
          props.error && props.touched ? "is-invalid" : ""
        }`}
        {...formProps}
        id={id}
      />
      <Label htmlFor={id} className="custom-control-label" style={props.labelStyle}>
        {props.label}
      </Label>
      {props.hint && <FormText color="muted">{props.hint}</FormText>}
      <div className="invalid-feedback">
        {props.touched && props.error}
      </div>
    </FormGroup>
  );
};

FieldRadiobutton.propTypes = {
  label: PropTypes.node.isRequired,
  name: PropTypes.string,
  id: PropTypes.string,
  readOnly: PropTypes.bool,
  className: PropTypes.string,

  touched: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  hint: PropTypes.string,

  checked: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  labelStyle: PropTypes.object,
};

FieldRadiobutton.defaultProps = {
  name: "radiobutton",
  readOnly: false
};

export default FieldRadiobutton;
