import React from "react";
import PropTypes from "prop-types";
import {Field} from "formik";
import {FormGroup, FormText, Label} from "reactstrap";

const FieldNumber = props => {
  const id = props.id ?? props.name;

  const formProps = {
    placeholder: props.placeholder,
    name: props.name,
    readOnly: props.readOnly,
    value: props.value
  };

  return (
    <FormGroup className="form-label-group">
      <Field
        type="text"
        className={`form-control form-control-lg ${
          props.error && props.touched ? "is-invalid" : ""
        }`}
        {...formProps}
        id={id}
        onChange={e => {
          if (
            e.target.value === "" ||
            props.regexp.test(e.target.value)
          ) {
            props.onChange(e);
          }
        }}
      />
      <Label htmlFor={id}>
        <span>{props.placeholder}</span>
      </Label>
      {props.hint && <FormText color="muted">{props.hint}</FormText>}
      <div className="invalid-feedback">
        {props.touched && props.error}
      </div>
    </FormGroup>
  );
};

FieldNumber.propTypes = {
  placeholder: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  readOnly: PropTypes.bool,

  touched: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  hint: PropTypes.string,

  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange: PropTypes.func.isRequired,
  regexp: PropTypes.object
};

FieldNumber.defaultProps = {
  placeholder: "Номер",
  name: "number",
  readOnly: false,
  regexp: /^[0-9]+$/
};

export default FieldNumber;
