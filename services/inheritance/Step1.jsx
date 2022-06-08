import React, { useContext, useState } from 'react'
import { Form, Formik } from 'formik'
import { Collapse } from 'reactstrap'

import ServiceHeader from '../ServiceHeader'
import FieldName from '../formFields/FieldName'
import FieldAddress from '../formFields/FieldAddress'
import FieldEmail from '../formFields/FieldEmail'
import ServiceFooter from '../ServiceFooter'
import { ServiceContext } from '../ServiceContext'
import Spinner from '../formFields/Spinner'
import FieldText from '../formFields/FieldText'
import FieldMaskedText from '../formFields/FieldMaskedText'
import ArrowUp from './icons/arrow-up.svg'
import ArrowDown from './icons/arrow-down.svg'

const Step1 = props => {
    const {step, maxStep, isAuth, formData, nextStep} = useContext(ServiceContext)
    const [isSpinner, setIsSpinner] = useState(false)

    const buttonNextClick = data => {
        setIsSpinner(true)
        setTimeout(() => {
            setIsSpinner(false)
            if (nextStep(data)) {
                props.jumpToStep(step + 1)
            }
        }, 1000)
    }

    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => setIsOpen(!isOpen)

    return (
        <Formik
            initialValues={formData}
            validate={async values => {
                const errors = {}

                if (!values.name) {
                    errors.name = true
                } else if (/((?![а-яa-z\s]).)+/i.test(values.name)) {
                    errors.name = "Укажите, используя буквы русского или латинского алфавита"
                } else if (/^\s/.test(values.name)) {
                    errors.name = "Данное поле не может начинаться с пробела"
                } else if (!/^[а-яa-z]+\s[а-яa-z]+([а-яa-z\s]+)?$/i.test(values.name)) {
                    errors.name = "Укажите полностью фамилию, имя и отчество (при наличии)"
                }

                if (!values.address.address) {
                    errors.address = 'Неполный адрес. Должен содержать населенный пункт, улицу, дом.'
                }

                if (!values.email) {
                    errors.email = true;
                } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(values.email)) {
                    errors.email = "Адрес электронной почты введен неверно. Проверьте правильность ввода"
                }

                if (values.snils && values.snils.replaceAll(/\D/ig, '').length < 11) {
                    errors.snils = 'Укажите данные полностью'
                }

                if (values.inn && values.inn.replaceAll(/\D/ig, '').length < 12) {
                    errors.inn = 'Укажите данные полностью'
                }

                if (values.passport_data && values.passport_data.replaceAll(/\D/ig, '').length < 10) {
                    errors.passport_data = 'Укажите данные полностью'
                }

                if (values.driver_licence && values.driver_licence.replaceAll(/\D/ig, '').length < 10) {
                    errors.driver_licence = 'Укажите данные полностью'
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
                    />
                    {isSpinner && <Spinner/>}
                    <div className="mx-auto" style={{maxWidth: 450, filter: isSpinner ? 'blur(5px)' : null}}>
                        <FieldName
                            touched={touched.name}
                            error={errors.name}
                            readOnly={isAuth}
                            value={values.name}
                            onChange={value => setFieldValue("name", value)}
                            touchField={() => setFieldTouched("name")}
                        />
                        <FieldAddress
                            touched={touched.address}
                            error={errors.address}
                            placeholder="Ваш адрес проживания"
                            readOnly={isAuth}
                            defaultValue={values.address.address}
                            onChange={address => setFieldValue('address', address)}
                            touchField={() => setFieldTouched('address')}
                        />
                        <FieldEmail
                            placeholder="Электронная почта"
                            touched={touched.email}
                            error={errors.email}
                            readOnly={isAuth}
                            value={values.email}
                            onChange={e => setFieldValue('email', e.target.value)}
                        />
                        <div onClick={toggle} className="form-add-info">
                            Указать дополнительную информацию <img src={isOpen ? ArrowUp: ArrowDown} alt=""/>
                        </div>
                        <Collapse isOpen={isOpen}>
                            <FieldText
                                error={errors.job_place}
                                touched={touched.job_place}
                                name="job_place"
                                placeholder="Место работы"
                                value={values.job_place}
                                onChange={e => setFieldValue('job_place', e.target.value)}
                            />
                            <FieldMaskedText
                                error={errors.snils}
                                touched={touched.snils}
                                name="snils"
                                placeholder="СНИЛС"
                                value={values.snils}
                                onChange={e => setFieldValue('snils', e.target.value)}
                                mask={[/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, ' ', /\d/, /\d/]}
                            />
                            <FieldMaskedText
                                error={errors.inn}
                                touched={touched.inn}
                                name="inn"
                                placeholder="ИНН"
                                value={values.inn}
                                onChange={e => setFieldValue('inn', e.target.value)}
                                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                            />
                            <FieldMaskedText
                                error={errors.passport_data}
                                touched={touched.passport_data}
                                name="passport_data"
                                placeholder="Серия и номер паспорта"
                                value={values.passport_data}
                                onChange={e => setFieldValue('passport_data', e.target.value)}
                                mask={[/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                            />
                            <FieldMaskedText
                                error={errors.driver_licence}
                                touched={touched.driver_licence}
                                name="driver_licence"
                                placeholder="Серия и номер в/у"
                                value={values.driver_licence}
                                onChange={e => setFieldValue('driver_licence', e.target.value)}
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

export default Step1
