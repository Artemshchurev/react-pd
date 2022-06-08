import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Field } from 'formik'
import { FormGroup, FormText, Label } from 'reactstrap'
import MaskedInput from 'react-text-mask'

const FieldPrice = (props) => {
    const id = props.id ?? props.name
    const value = props.value

    const [rub, setRub] = useState(value === '' ? '' : Math.trunc(value))
    const [kop, setKop] = useState(value === '' ? '' : Math.round((value % 1) * 100))
    const [showPrice, setShowPrice] = useState(value !== '')
    const [focus, setFocus] = useState(false)
    const [modalText, setModalText] = useState(false)
    const [modalShown, setModalShown] = useState(false)

    const showModal = (text) => {
        setModalText(text)
        setModalShown(true)
    };


    const onRubChange = e => {
        const newValue = e.target.value.replace(/[^\d]/, "")
        setRub(newValue)
        setPrice('rub', newValue)
    }

    const onKopChange = e => {
        setKop(e.target.value)
        setPrice('kop', e.target.value)
    }

    const setPrice = (type,  newValue) => {
        const rubValue = type === 'rub' ? newValue : rub
        const kopValue = type === 'kop' ? newValue : kop
        if (rubValue === '' && kopValue === "") {
            props.onChange('')
            setShowPrice(false)
            return
        }
        props.onChange(`${rubValue ? rubValue : 0}${kopValue ? `.${kopValue}` : ""}`)
        setShowPrice(true)
    }

    return (
        <FormGroup className="field-price-container">
            <div
                className={`field-price form-control ${focus || showPrice ? '' : 'hide-price-label'} ${props.error && props.touched ? 'is-invalid' : ''}`}
                style={{
                    backgroundColor: focus || showPrice ? 'white' : null,
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
                    value={rub}
                    style={{
                        width: rub.toString().length > 4 ? `${rub.toString().length + 1}ch` : '60px',
                        backgroundColor: focus || showPrice ? null : '#EAEDF4',
                    }}
                    onChange={onRubChange}
                    id={id}
                />
                <label>руб.</label>
                <MaskedInput
                    style={{
                        width: '40px',
                        backgroundColor: focus || showPrice ? null : '#EAEDF4',
                    }}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    value={kop}
                    guide={false}
                    mask={[/\d/, /\d/]}
                    onChange={onKopChange}
                />
                <label>коп.</label>
            </div>
            <Label htmlFor={id} className={`label-price-placeholder ${focus || showPrice ? 'label-price-placeholder-focused' : ''}`}>
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
