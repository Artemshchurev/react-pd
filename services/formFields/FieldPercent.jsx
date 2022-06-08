import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Field } from 'formik'
import { FormGroup, FormText, Label } from 'reactstrap'

const FieldPrice = (props) => {
    const id = props.id ?? props.name
    const value = props.value

    const [percent, setPercent] = useState(value === '' ? '' : parseFloat(value))
    const [showPercent, setShowPercent] = useState(value !== '')
    const [focus, setFocus] = useState(false)

    const onRubChange = e => {
        const newValue = e.target.value.replace(/,/g, '.').replace(/[^\d\\.]/, '')
        setPercent(newValue)
        if (newValue === '') {
            props.onChange('')
            setShowPercent(false)
            return
        }
        props.onChange(newValue)
        setShowPercent(true)
    }

    return (
        <FormGroup className="field-price-container">
            <div
                className={`field-price form-control ${focus || showPercent ? '' : 'hide-price-label'} ${props.error && props.touched ? 'is-invalid' : ''}`}
                style={{
                    backgroundColor: focus || showPercent ? 'white' : null,
                    borderColor: props.error && props.touched ? '#dc3545' : '',
                }}
            >
                <Field
                    type="text"
                    onFocus={() => setFocus(true)}
                    onBlur={() => {
                        setFocus(false)
                        props.touchField()
                    }}
                    value={percent}
                    style={{
                        width: `${percent.toString().length + 1}ch`,
                        backgroundColor: focus || showPercent ? null : '#EAEDF4',
                    }}
                    onChange={onRubChange}
                    id={id}
                />
                <label>%</label>
            </div>
            <Label htmlFor={id} className={`label-price-placeholder ${focus || showPercent ? 'label-price-placeholder-focused' : ''}`}>
                <span>{props.placeholder}</span>
            </Label>
            {props.hint && <FormText color="muted">{props.hint}</FormText>}
            <div className="invalid-feedback">{props.touched && props.error}</div>
        </FormGroup>
    )
}

FieldPrice.propTypes = {
    placeholder: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    id: PropTypes.string,
    readOnly: PropTypes.bool,
    touched: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    touchField: PropTypes.func.isRequired,
    hint: PropTypes.string,

  value: PropTypes.string.isRequired,
}

FieldPrice.defaultProps = {
  readOnly: false,
}

export default FieldPrice
