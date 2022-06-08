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
import { Collapse } from 'reactstrap'
import ArrowUp from './icons/arrow-up.svg'
import ArrowDown from './icons/arrow-down.svg'

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

    return (
        <Formik
            initialValues={formData}
            validate={async values => {
                const errors = {}
                if (!values.spouse_name) {
                    errors.spouse_name = true
                } else if (/((?![а-яa-z\s]).)+/i.test(values.spouse_name)) {
                    errors.spouse_name = "Укажите, используя буквы русского или латинского алфавита"
                } else if (/^\s/.test(values.spouse_name)) {
                    errors.spouse_name = "Данное поле не может начинаться с пробела"
                } else if (!/^[а-яa-z]+\s[а-яa-z]+([а-яa-z\s]+)?$/i.test(values.spouse_name)) {
                    errors.spouse_name = "Укажите полностью фамилию, имя и отчество (при наличии)"
                }
                if (!values.spouse_address.address) {
                    errors.spouse_address = 'Неполный адрес. Должен содержать населенный пункт, улицу, дом'
                }
                if (!values.spouse_email) {
                    errors.spouse_email = true
                } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(values.spouse_email)) {
                    errors.spouse_email = "Адрес электронной почты введен неверно. Проверьте правильность ввода"
                }
                if (!values.spouse_phone) {
                    errors.spouse_phone = true
                } else {
                    const ruPhoneNumber = values.spouse_phone.replace(/\(|\)|\s+|-/g, "")
                    if (!(ruPhoneNumber.length > 9 && /^((\+7|7|8)+([0-9]){10})$/.test(ruPhoneNumber))) {
                        errors.spouse_phone = true
                    }
                }

                if (values.spouse_snils && values.spouse_snils.replaceAll(/\D/ig, '').length < 11) {
                    errors.spouse_snils = 'Укажите данные полностью'
                }

                if (values.spouse_inn && values.spouse_inn.replaceAll(/\D/ig, '').length < 12) {
                    errors.spouse_inn = 'Укажите данные полностью'
                }

                if (values.spouse_passport_data && values.spouse_passport_data.replaceAll(/\D/ig, '').length < 10) {
                    errors.spouse_passport_data = 'Укажите данные полностью'
                }

                if (values.spouse_driver_licence && values.spouse_driver_licence.replaceAll(/\D/ig, '').length < 10) {
                    errors.spouse_driver_licence = 'Укажите данные полностью'
                }

                return errors
            }}
            onSubmit={buttonNextClick}
        >
            {({values, errors, touched, setFieldValue, setFieldTouched}) => (
                <Form noValidate>
                    <ServiceHeader
                        text={props.name}
                        maxSteps={maxStep}
                        currentStep={step + 1}
                        buttonPreviousClick={buttonPreviousClick}
                    />
                    {isSpinner && <Spinner/>}
                    <div className="mx-auto" style={{maxWidth: 450, filter: isSpinner ? 'blur(5px)' : null}}>
                        <FieldName
                            touched={touched.spouse_name}
                            error={errors.spouse_name}
                            value={values.spouse_name}
                            onChange={value => setFieldValue('spouse_name', value)}
                            touchField={() => setFieldTouched('spouse_name')}
                        />
                        <FieldAddress
                            touched={touched.spouse_address}
                            error={errors.spouse_address}
                            placeholder="Адрес проживания"
                            defaultValue={values.spouse_address.address}
                            onChange={address => setFieldValue('spouse_address', address)}
                            touchField={() => setFieldTouched('spouse_address')}
                        />
                        <FieldEmail
                            name="spouse_email"
                            touched={touched.spouse_email}
                            error={errors.spouse_email}
                            value={values.spouse_email}
                            onChange={e => setFieldValue('spouse_email', e.target.value)}
                        />
                        <FieldPhone
                            touched={touched.spouse_phone}
                            error={errors.spouse_phone}
                            placeholder="Телефон"
                            value={values.spouse_phone}
                            onChange={e => setFieldValue('spouse_phone', e.target.value)}
                        />
                        <div onClick={toggle} className="form-add-info">
                            Указать дополнительную информацию <img src={isOpen ? ArrowUp: ArrowDown} alt=""/>
                        </div>
                        <Collapse isOpen={isOpen}>
                            <FieldText
                                error={errors.spouse_job_place}
                                touched={touched.spouse_job_place}
                                name="spouse_job_place"
                                placeholder="Место работы"
                                value={values.spouse_job_place}
                                onChange={e => setFieldValue('spouse_job_place', e.target.value)}
                            />
                            <FieldMaskedText
                                error={errors.spouse_snils}
                                touched={touched.spouse_snils}
                                name="spouse_snils"
                                placeholder="СНИЛС"
                                value={values.spouse_snils}
                                onChange={e => setFieldValue('spouse_snils', e.target.value)}
                                mask={[/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, ' ', /\d/, /\d/]}
                            />
                            <FieldMaskedText
                                error={errors.spouse_inn}
                                touched={touched.spouse_inn}
                                name="spouse_inn"
                                placeholder="ИНН"
                                value={values.spouse_inn}
                                onChange={e => setFieldValue('spouse_inn', e.target.value)}
                                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                            />
                            <FieldMaskedText
                                error={errors.spouse_passport_data}
                                touched={touched.spouse_passport_data}
                                name="spouse_passport_data"
                                placeholder="Серия и номер паспорта"
                                value={values.spouse_passport_data}
                                onChange={e => setFieldValue('spouse_passport_data', e.target.value)}
                                mask={[/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                            />
                            <FieldMaskedText
                                error={errors.spouse_driver_licence}
                                touched={touched.spouse_driver_licence}
                                name="spouse_driver_licence"
                                placeholder="Серия и номер в/у"
                                value={values.spouse_driver_licence}
                                onChange={e => setFieldValue('spouse_driver_licence', e.target.value)}
                                mask={[/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                            />
                        </Collapse>
                    </div>
                    <ServiceFooter/>
                </Form>
            )}
        </Formik>
    )
}

export default Step2
