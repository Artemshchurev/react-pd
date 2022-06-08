import React, { createRef, useContext, useState } from "react";
import PropTypes from "prop-types";
import { FormText, Label } from "reactstrap";
import { FioSuggestions } from "react-dadata";
import "react-dadata/dist/react-dadata.css";
import { ServiceContext } from "../ServiceContext";

const FieldName = (props) => {
  const id = props.id ?? props.name;

  const { dadataToken } =
    useContext(ServiceContext);

  const [placeholderShown, setPlaceholderShown] = useState(
    props.value.length === 0
  );

  const ref = createRef();

  function handleChange(e) {
    props.onChange(e.target.value);
  }

  function handleFocus() {
    setPlaceholderShown(false);
  }

  function handleBlur() {
    setPlaceholderShown(ref.current.textInput.value.length === 0);
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
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  function handleSuggestion(suggestion) {
    props.onChange(suggestion.value);
  }

  return (
    <FioSuggestions
      ref={ref}
      token={dadataToken}
      count={5}
      minChars={2}
      defaultQuery={props.value}
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
      {props.hint && <FormText color="muted">{props.hint}</FormText>}
      <div
        className="invalid-feedback"
        dangerouslySetInnerHTML={{
          __html: props.touched && (props.error !== true ? props.error : ""),
        }}
      />
    </FioSuggestions>
  );
};

FieldName.propTypes = {
  placeholder: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  readOnly: PropTypes.bool,

  touched: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  hint: PropTypes.string,

  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  touchField: PropTypes.func.isRequired,
};

FieldName.defaultProps = {
  placeholder: "Фамилия, имя и отчество",
  name: "name",
  readOnly: false,
};

export default FieldName;
