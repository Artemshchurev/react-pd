import React from "react";
import PropTypes from "prop-types";
import {Field} from "formik";
import {FormGroup, FormText, Label} from "reactstrap";

const FieldCheckbox = props => {
  const id = props.id ?? props.name;

  const formProps = {
    placeholder: props.placeholder,
    name: props.name,
    disabled: props.readOnly,
    checked: props.checked,
    onClick: props.onClick
  };

  return (
    <FormGroup className={`custom-control custom-checkbox ${props.className ?? ''}`}>
      <Field
        type="checkbox"
        className={`custom-control-input ${
          props.error && props.touched ? "is-invalid" : ""
        }`}
        {...formProps}
        id={id}
      />
      <Label htmlFor={id} className="custom-control-label">
        {props.label}
      </Label>
      {props.hint && <FormText color="muted">{props.hint}</FormText>}
      <div className="invalid-feedback">
        {props.touched && props.error}
      </div>
    </FormGroup>
  );
};

FieldCheckbox.propTypes = {
  label: PropTypes.node.isRequired,
  name: PropTypes.string,
  id: PropTypes.string,
  readOnly: PropTypes.bool,
  className: PropTypes.string,

  touched: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  hint: PropTypes.string,

  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func
};

FieldCheckbox.defaultProps = {
  name: "checkbox",
  readOnly: false
};

export default FieldCheckbox;
