import React, { useContext, useState } from 'react'
import { Form, Formik } from 'formik'

import ServiceHeader from '../ServiceHeader'
import FieldName from '../formFields/FieldName'
import ServiceFooter from '../ServiceFooter'
import { ServiceContext } from '../ServiceContext'
import Spinner from '../formFields/Spinner'
import FieldAddress from '../formFields/FieldAddress'
import FieldEmail from '../formFields/FieldEmail'
import FieldPhone from '../formFields/FieldPhone'
import FieldText from '../formFields/FieldText'
import FieldMaskedText from '../formFields/FieldMaskedText'
import {Button, Collapse} from 'reactstrap'
import ArrowUp from './icons/arrow-up.svg'
import ArrowDown from './icons/arrow-down.svg'
import FieldRadiobutton from '../formFields/FieldRadiobutton'
import getRandomString from './../../helper/random-string'
import FieldDate from "../formFields/FieldDate";


const Step2 = props => {
    const {step, maxStep, previousStep, formData, nextStep} = useContext(ServiceContext)
    const [isSpinner, setIsSpinner] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => setIsOpen(!isOpen)

    const buttonNextClick = data => {
        setIsSpinner(true)
        setTimeout(() => {
            setIsSpinner(false)
            if (nextStep(data)) {
                props.jumpToStep(step + 1)
            }
        }, 1000)
    }

    const buttonPreviousClick = () => {
        previousStep()
        props.jumpToStep(step - 1)
    }

    const selectDebtorType = (setFieldValue, type) => {
        setIsOpen(false)
        setFieldValue('debtor_type', type)
    }

    return (
        <Formik
            initialValues={formData}
            validate={async values => {
                const errors = {}
                if (!values.debtor_type) {
                    errors.debtor_type = true
                } else {
                    if (!values.debtor_name) {
                        errors.debtor_name = true
                    } else if (['entrepreneur', 'individual'].includes(values.debtor_type)) {
                        if (/((?![??-??a-z\s]).)+/i.test(values.debtor_name)) {
                            errors.debtor_name = '??????????????, ?????????????????? ?????????? ???????????????? ?????? ???????????????????? ????????????????'
                        } else if (/^\s/.test(values.debtor_name)) {
                            errors.debtor_name = '???????????? ???????? ???? ?????????? ???????????????????? ?? ??????????????'
                        } else if (!/^[??-??a-z]+\s[??-??a-z]+([??-??a-z\s]+)?$/i.test(values.debtor_name)) {
                            errors.debtor_name = '?????????????? ?????????????????? ??????????????, ?????? ?? ???????????????? (?????? ??????????????)'
                        }
                    }

                    if (!values.debtor_address.address) {
                        errors.debtor_address = '???????????????? ??????????. ???????????? ?????????????????? ???????????????????? ??????????, ??????????, ??????.'
                    }

                    if (['entrepreneur', 'individual'].includes(values.debtor_type)) {
                        if (values.debtor_email && !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(values.debtor_email)) {
                            errors.debtor_email = '?????????? ?????????????????????? ?????????? ???????????? ??????????????. ?????????????????? ???????????????????????? ??????????'
                        }

                        if (values.debtor_phone) {
                            const ruPhoneNumber = values.debtor_phone.replace(/\(|\)|\s+|-/g, "")
                            if (!(ruPhoneNumber.length > 9 && /^((\+7|7|8)+([0-9]){10})$/.test(ruPhoneNumber))) {
                                errors.debtor_phone = '??????????????, ?????????????????? ???????????????? ??????????'
                            }
                        }

                        if (values.debtor_snils && values.debtor_snils.replaceAll(/\D/ig, '').length < 11) {
                            errors.debtor_snils = '?????????????? ???????????? ??????????????????'
                        }

                        if (values.debtor_passport_data && values.debtor_passport_data.replaceAll(/\D/ig, '').length < 10) {
                            errors.debtor_passport_data = '?????????????? ???????????? ??????????????????'
                        }

                        if (values.debtor_driver_licence && values.debtor_driver_licence.replaceAll(/\D/ig, '').length < 10) {
                            errors.debtor_driver_licence = '?????????????? ???????????? ??????????????????'
                        }
                    }

                    if (values.deFbtor_inn) {
                        const innCount = values.debtor_type === 'entity' ? 10 : 12
                        if (values.debtor_inn.replaceAll(/\D/ig, '').length < innCount) {
                            errors.debtor_inn = '?????????????? ???????????? ??????????????????'
                        }
                    }

                    if (['entrepreneur', 'entity'].includes(values.debtor_type)) {
                        if (values.debtor_ogrn) {
                            const ogrnCount = values.debtor_type === 'entity' ? 13 : 15
                            if (values.debtor_ogrn.replaceAll(/\D/ig, '').length < ogrnCount) {
                                errors.debtor_ogrn = '?????????????? ???????????? ??????????????????'
                            }
                        }
                    }
                }

                return errors
            }}
            onSubmit={buttonNextClick}
        >
            {({values, errors, touched, setFieldValue, setFieldTouched, setFieldError}) => (
                <Form noValidate>
                    <ServiceHeader
                        text={props.name}
                        maxSteps={maxStep}
                        currentStep={step + 1}
                        buttonPreviousClick={buttonPreviousClick}
                    />
                    {isSpinner && <Spinner/>}
                    <div className="mx-auto" style={{maxWidth: 450, filter: isSpinner ? 'blur(5px)' : null}}>
                        <FieldRadiobutton
                            label="???????????????????? ????????"
                            value="individual"
                            name="debtor_type"
                            onClick={() => selectDebtorType(setFieldValue, 'individual')}
                            checked={values.debtor_type === 'individual'}
                            touched={touched.debtor_type}
                            error={errors.debtor_type}
                        />
                        <FieldRadiobutton
                            label="???????????????????????????? ??????????????????????????????"
                            value="entrepreneur"
                            name="debtor_type"
                            onClick={() => selectDebtorType(setFieldValue, 'entrepreneur')}
                            checked={values.debtor_type === 'entrepreneur'}
                            touched={touched.debtor_type}
                            error={errors.debtor_type}
                        />
                        <FieldRadiobutton
                            label="?????????????????????? ????????"
                            value="entity"
                            name="debtor_type"
                            onClick={() => selectDebtorType(setFieldValue, 'entity')}
                            checked={values.debtor_type === 'entity'}
                            touched={touched.debtor_type}
                            error={errors.debtor_type}
                        />
                        {values.debtor_type && (
                            <React.Fragment>
                                <FieldName
                                    name="debtor_name"
                                    placeholder={values.debtor_type === 'entity' ? '????. ????????' : '??????'}
                                    hint={values.debtor_type === 'entity'
                                        ? '???????????????????????? ???????????????????????? ????????'
                                        : '??????????????, ?????? ?? ????????????????'
                                    }
                                    touched={touched.debtor_name}
                                    error={errors.debtor_name}
                                    value={values.debtor_name}
                                    onChange={value => setFieldValue('debtor_name', value)}
                                    touchField={() => setFieldTouched('debtor_name')}
                                />
                                <FieldAddress
                                    touched={touched.debtor_address}
                                    error={errors.debtor_address}
                                    placeholder={values.debtor_type === 'entity' ? '?????????????????????? ??????????' : '?????????? ????????????????????'}
                                    defaultValue={values.debtor_address.address}
                                    name="debtor_address"
                                    onChange={address => setFieldValue('debtor_address', address)}
                                    touchField={() => setFieldTouched('debtor_address')}
                                />
                                {values.debtor_type === 'entity' && (
                                    <React.Fragment>
                                        <FieldMaskedText
                                            error={errors.debtor_inn}
                                            touched={touched.debtor_inn}
                                            name="debtor_inn"
                                            placeholder="??????"
                                            value={values.debtor_inn}
                                            onChange={e => setFieldValue('debtor_inn', e.target.value)}
                                            mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                        />
                                        <FieldMaskedText
                                            error={errors.debtor_ogrn}
                                            touched={touched.debtor_ogrn}
                                            name="debtor_ogrn"
                                            placeholder="????????"
                                            value={values.debtor_ogrn}
                                            onChange={e => setFieldValue('debtor_ogrn', e.target.value)}
                                            mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                        />
                                    </React.Fragment>
                                )}
                                {['entrepreneur', 'individual'].includes(values.debtor_type) && (
                                    <React.Fragment>
                                        <FieldEmail
                                            name="debtor_email"
                                            touched={touched.debtor_email}
                                            error={errors.debtor_email}
                                            value={values.debtor_email}
                                            onChange={e => setFieldValue('debtor_email', e.target.value)}
                                            touchField={() => setFieldTouched('debtor_email')}
                                        />
                                        <FieldPhone
                                            touched={touched.debtor_phone}
                                            error={errors.debtor_phone}
                                            placeholder="??????????????"
                                            value={values.debtor_phone}
                                            name="debtor_phone"
                                            onChange={e => setFieldValue('debtor_phone', e.target.value)}
                                            touchField={() => setFieldTouched('debtor_phone')}
                                        />
                                        <div onClick={toggle} className="form-add-info">
                                            ???????????????????? ?? ???????????????? <img src={isOpen ? ArrowUp: ArrowDown} alt=""/>
                                        </div>
                                        <Collapse isOpen={isOpen}>
                                            <FieldDate
                                                placeholder="???????? ????????????????"
                                                name="debtor_birth_date"
                                                touched={touched.debtor_birth_date}
                                                error={errors.debtor_birth_date}
                                                value={values.debtor_birth_date}
                                                onChange={(date, str) => setFieldValue('debtor_birth_date', str)}
                                                onClose={() => setFieldTouched('debtor_birth_date')}
                                            />
                                            <FieldText
                                                error={errors.debtor_job_place}
                                                touched={touched.debtor_job_place}
                                                name='debtor_job_place'
                                                placeholder="?????????? ????????????"
                                                value={values.debtor_job_place}
                                                onChange={e => setFieldValue('debtor_job_place', e.target.value)}
                                                touchField={() => setFieldTouched('debtor_job_place')}
                                            />
                                            <FieldMaskedText
                                                error={errors.debtor_snils}
                                                touched={touched.debtor_snils}
                                                name="debtor_snils"
                                                placeholder="??????????"
                                                value={values.debtor_snils}
                                                onChange={e => setFieldValue('debtor_snils', e.target.value)}
                                                mask={[/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, ' ', /\d/, /\d/]}
                                            />
                                            <FieldMaskedText
                                                error={errors.debtor_inn}
                                                touched={touched.debtor_inn}
                                                name="debtor_inn"
                                                placeholder="??????"
                                                value={values.debtor_inn}
                                                onChange={e => setFieldValue('debtor_inn', e.target.value)}
                                                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                            />
                                            <FieldMaskedText
                                                error={errors.debtor_passport_data}
                                                touched={touched.debtor_passport_data}
                                                name="debtor_passport_data"
                                                placeholder="??????????????"
                                                hint="?????????? ?? ?????????? ????????????????"
                                                value={values.debtor_passport_data}
                                                onChange={e => setFieldValue('debtor_passport_data', e.target.value)}
                                                mask={[/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                            />
                                            {values.debtor_type === 'entrepreneur' && (
                                                <FieldMaskedText
                                                    error={errors.debtor_ogrn}
                                                    touched={touched.debtor_ogrn}
                                                    name="debtor_ogrn"
                                                    placeholder="????????"
                                                    hint="???????? ?????????????????????????????? ??????????????????????????????"
                                                    value={values.debtor_ogrn}
                                                    onChange={e => setFieldValue('debtor_ogrn', e.target.value)}
                                                    mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                                />
                                            )}
                                            <FieldMaskedText
                                                error={errors.debtor_driver_licence}
                                                touched={touched.debtor_driver_licence}
                                                name="debtor_driver_licence"
                                                placeholder="?????????? ?? ?????????? ??/??"
                                                value={values.debtor_driver_licence}
                                                onChange={e => setFieldValue('debtor_driver_licence', e.target.value)}
                                                mask={[/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                            />
                                        </Collapse>
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        )}
                        {errors.debtor_type && touched.debtor_type && (
                            <div className="invalid-feedback" style={{display: 'block'}}>??????  ?????????????????????? ???????????????????? ?????????????? ???????? ???? ??????????????????</div>
                        )}
                    </div>
                    <ServiceFooter/>
                </Form>
            )}
        </Formik>
    )
}

export default Step2
