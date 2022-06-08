import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'formik'
import { FormGroup, FormText, Label } from 'reactstrap'
import MaskedInput from 'react-text-mask'

const FieldMaskedText = props => {
  const id = props.id ?? props.name

  const formProps = {
    placeholder: props.placeholder,
    name: props.name,
    readOnly: props.readOnly,
    value: props.value
  }

  return (
    <FormGroup className="form-label-group">
      <Field
        render={({ field }) => (
            <MaskedInput
                {...field}
                {...formProps}
                mask={props.mask}
                id={id}
                type="text"
                onChange={e => props.onChange(e)}
                className={`form-control form-control-lg ${
                    props.error && props.touched ? "is-invalid" : ""
                }`}
            />
        )}
      />
      <Label htmlFor={id}>
        <span>{props.placeholder}</span>
      </Label>
      {props.hint && <FormText color="muted">{props.hint}</FormText>}
      <div className="invalid-feedback">
        {props.touched && props.error}
      </div>
    </FormGroup>
  )
}

FieldMaskedText.propTypes = {
  placeholder: PropTypes.string.isRequired,
  mask: PropTypes.array.isRequired,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,

  touched: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  hint: PropTypes.string,

  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange: PropTypes.func.isRequired,
}

FieldMaskedText.defaultProps = {
  readOnly: false,
}

export default FieldMaskedText
