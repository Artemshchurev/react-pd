import React, {useContext, useState} from 'react'
import {Form, Formik} from 'formik'

import ServiceHeader from '../ServiceHeader'
import ServiceFooter from '../ServiceFooter'
import {ServiceContext} from '../ServiceContext'
import EntityForm from './components/EntityForm'
import IndividualForm from './components/IndividualForm'
import FieldRadiobutton from '../formFields/FieldRadiobutton'
import Spinner from "../formFields/Spinner";


const Step2 = props => {
    const {step, maxStep, formData, previousStep, nextStep} = useContext(ServiceContext)
    const [isSpinner, setIsSpinner] = useState(false)

    const buttonNextClick = data => {
        setIsSpinner(true)
        setTimeout(() => {
            setIsSpinner(false)
            if (nextStep(data)) {
                props.jumpToStep(step + 1);
            }
        }, 1000)
    }

    const buttonPreviousClick = () => {
        previousStep()
        props.jumpToStep(step - 1)
    }

    const isPhoneValid = phone => {
        const ruPhone_number = phone.replace(/\(|\)|\s+|-/g, "");
        return (
            ruPhone_number.length > 9 &&
            /^((\+7|7|8)+([0-9]){10})$/.test(ruPhone_number)
        )
    }

    return (
        <Formik
            initialValues={formData}
            validate={async values => {
                const errors = {}

                if (values.claim_recipient === 'entity') {
                    if (!values.legal_entity_inn) {
                        errors.legal_entity_inn = true
                    } else if (!/^\d+$/i.test(values.legal_entity_inn)) {
                        errors.legal_entity_inn = 'ИНН юр. лица должен состоять из цифр'
                    }
                    if (!values.legal_entity_name) {
                        errors.legal_entity_name = true
                    }
                    if (!values.legal_entity_address) {
                        errors.legal_entity_address = 'Неполный адрес. Должен содержать населенный пункт, улицу, дом.'
                    }
                } else {
                    if (!values.individual_entrepreneur_fio) {
                        errors.individual_entrepreneur_fio = true
                    } else if (/((?![а-яa-z\s]).)+/i.test(values.individual_entrepreneur_fio)) {
                        errors.individual_entrepreneur_fio = 'Укажите, используя буквы русского или латинского алфавита'
                    } else if (/^\s/.test(values.individual_entrepreneur_fio)) {
                        errors.individual_entrepreneur_fio = 'Данное поле не может начинаться с пробела'
                    } else if (!/^[а-яa-z]+\s[а-яa-z]+([а-яa-z\s]+)?$/i.test(values.individual_entrepreneur_fio)) {
                        errors.individual_entrepreneur_fio = 'Укажите полностью фамилию, имя и отчество (при наличии)'
                    }
                    if (!values.individual_entrepreneur_address) {
                        errors.individual_entrepreneur_address = 'Неполный адрес. Должен содержать населенный пункт, улицу, дом.'
                    }
                    if (!values.individual_entrepreneur_phone) {
                        errors.individual_entrepreneur_phone = true
                    } else if (!isPhoneValid(values.individual_entrepreneur_phone)) {
                        errors.individual_entrepreneur_phone = 'Введите корректный номер телефона'
                    } else if (!!window.user
                        && window.user.phone
                        && values.individual_entrepreneur_phone.includes(window.user.phone.substring(2))) {
                        errors.individual_entrepreneur_phone = 'Номер телефона получателя совпадает с номером отправителя'
                    }
                }

                return errors;
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
                        <FieldRadiobutton
                            label="Юридическое лицо"
                            name="claim_recipient"
                            className="custom-control-inline"
                            checked={values.claim_recipient === "entity"}
                            onClick={() => setFieldValue("claim_recipient", "entity")}
                            value="entity"
                        />
                        <FieldRadiobutton
                            label="ИП"
                            name="claim_recipient"
                            className="custom-control-inline"
                            checked={values.claim_recipient === "individual"}
                            onClick={() => setFieldValue("claim_recipient", "individual")}
                            value="individual"
                        />
                        {values.claim_recipient === 'entity'
                            ? <EntityForm
                                touched={touched}
                                errors={errors}
                                values={values}
                                setFieldValue={setFieldValue}
                                setFieldTouched={setFieldTouched}
                                />
                            : <IndividualForm
                                touched={touched}
                                errors={errors}
                                values={values}
                                setFieldValue={setFieldValue}
                                setFieldTouched={setFieldTouched}
                                /> }
                    </div>
                    <ServiceFooter buttonPreviousClick={buttonPreviousClick}/>
                </Form>
            )}
        </Formik>
    );
};
export default Step2;
