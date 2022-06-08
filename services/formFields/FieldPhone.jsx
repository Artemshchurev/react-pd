import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Field, useFormikContext } from "formik";
import { FormGroup, FormText, Label } from "reactstrap";

const FieldPhone = (props) => {
  const id = props.id ?? props.name;

  const { values: formValues } = useFormikContext();

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

  if (props.touchField) {
    formProps.onBlur = async () => {
      props.touchField();

      const form = new FormData();

      form.append("product", "alimony");
      form.append("email", formValues.email);
      form.append("name", formValues.name);
      form.append("address", formValues.address.address);
      form.append("phone", formValues.phone);

      await axios.post("/abandoned-applications", form);
    };
  }

  return (
    <FormGroup className="form-label-group">
      <Field
        type="tel"
        className={`form-control form-control-lg ${
          props.error && props.touched ? "is-invalid" : ""
        }`}
        {...formProps}
        id={id}
        onChange={(e) => {
          if (
            e.target.value === "" ||
            /^[0-9\(\)\+\-\s]+$/.test(e.target.value)
          ) {
            props.onChange(e);
          }
        }}
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

FieldPhone.propTypes = {
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

FieldPhone.defaultProps = {
  placeholder: "Номер телефона",
  name: "phone",
  readOnly: false,
};

export default FieldPhone;
