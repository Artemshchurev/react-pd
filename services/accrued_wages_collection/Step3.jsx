import React, { useContext, useState } from 'react'
import { Form, Formik } from 'formik'

import ServiceHeader from '../ServiceHeader'
import ServiceFooter from '../ServiceFooter'
import { ServiceContext } from '../ServiceContext'
import Spinner from '../formFields/Spinner'
import FieldRadiobutton from '../formFields/FieldRadiobutton'
import FieldDate from '../formFields/FieldDate'
import FieldNumber from '../formFields/FieldNumber'
import FieldText from '../formFields/FieldText'


const Step3 = props => {
    const {step, maxStep, previousStep, formData, nextStep} = useContext(ServiceContext)
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

    const buttonPreviousClick = () => {
        previousStep()
        props.jumpToStep(step - 1)
    }

    return (
        <Formik
            initialValues={formData}
            validate={async values => {
                const errors = {}
                if (!values.is_employment_contract_terminated) {
                    errors.is_employment_contract_terminated = true
                } else {
                    if (!values.employment_contract_date_conclusion) {
                        errors.employment_contract_date_conclusion = 'укажите вручную или используйте календарь'
                    }
                    if (!values.employee_position) {
                        errors.employee_position = true
                    }
                    if (values.is_employment_contract_terminated === '0' && !values.presence_of_order_to_work) {
                        errors.presence_of_order_to_work = true
                    }
                    if (values.is_employment_contract_terminated === '1') {
                        if (!values.employment_contract_date_dissolution) {
                            errors.employment_contract_date_dissolution = 'укажите вручную или используйте календарь'
                        } else if (values.employment_contract_date_conclusion) {
                            const dissolutionDMY = values.employment_contract_date_dissolution.split('.'),
                                conclusionDMY = values.employment_contract_date_conclusion.split('.'),
                                dissolutionDate = new Date(dissolutionDMY[2], parseInt(dissolutionDMY[1]) - 1, dissolutionDMY[0]),
                                conclusionDate = new Date(conclusionDMY[2], parseInt(conclusionDMY[1]) - 1, conclusionDMY[0])
                            if (conclusionDate > dissolutionDate) {
                                errors.employment_contract_date_dissolution = 'Дата расторжения трудового договора не может быть раньше даты заключения трудового договора'
                            }
                        }
                        if (!values.presence_of_dismissal_order) {
                            errors.presence_of_dismissal_order = true
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
                        <p>Трудовой договор</p>
                        <FieldRadiobutton
                            label="Трудовой договор не расторгнут (работник продолжает работу у должника)"
                            value="0"
                            name="is_employment_contract_terminated"
                            onClick={() => setFieldValue('is_employment_contract_terminated', '0')}
                            checked={values.is_employment_contract_terminated === '0'}
                            touched={touched.is_employment_contract_terminated}
                            error={errors.is_employment_contract_terminated}
                        />
                        <FieldRadiobutton
                            label="Трудовой договор расторгнут"
                            value="1"
                            name="is_employment_contract_terminated"
                            onClick={() => setFieldValue('is_employment_contract_terminated', '1')}
                            checked={values.is_employment_contract_terminated === '1'}
                            touched={touched.is_employment_contract_terminated}
                            error={errors.is_employment_contract_terminated}
                        />
                        {values.is_employment_contract_terminated && (
                            <React.Fragment>
                                <FieldDate
                                    placeholder="Дата"
                                    hint="Дата заключения трудового договора"
                                    name="employment_contract_date_conclusion"
                                    touched={touched.employment_contract_date_conclusion}
                                    error={errors.employment_contract_date_conclusion}
                                    value={values.employment_contract_date_conclusion}
                                    onChange={(date, str) => setFieldValue('employment_contract_date_conclusion', str)}
                                    onClose={() => setFieldTouched('employment_contract_date_conclusion')}
                                />
                                <FieldNumber
                                    placeholder="Номер договора"
                                    hint="Номер трудового договора"
                                    name="employment_contract_number"
                                    touched={touched.employment_contract_number}
                                    error={errors.employment_contract_number}
                                    value={values.employment_contract_number}
                                    onChange={e => setFieldValue('employment_contract_number', e.target.value)}
                                />
                                <FieldText
                                    name="employee_position"
                                    placeholder="Должность работника"
                                    touched={touched.employee_position}
                                    error={errors.employee_position}
                                    value={values.employee_position}
                                    onChange={e => setFieldValue('employee_position', e.target.value)}
                                    touchField={() => setFieldTouched('employee_position')}
                                />
                                {values.is_employment_contract_terminated === '0' && (
                                    <React.Fragment>
                                        <p>Наличие приказа о приеме на работу</p>
                                        <FieldRadiobutton
                                            label="Есть"
                                            value="1"
                                            name="presence_of_order_to_work"
                                            onClick={() => setFieldValue('presence_of_order_to_work', '1')}
                                            checked={values.presence_of_order_to_work === '1'}
                                            touched={touched.presence_of_order_to_work}
                                            error={errors.presence_of_order_to_work}
                                        />
                                        <FieldRadiobutton
                                            label="Нет"
                                            value="0"
                                            name="presence_of_order_to_work"
                                            onClick={() => setFieldValue('presence_of_order_to_work', '0')}
                                            checked={values.presence_of_order_to_work === '0'}
                                            touched={touched.presence_of_order_to_work}
                                            error={errors.presence_of_order_to_work}
                                        />
                                        {errors.presence_of_order_to_work && touched.presence_of_order_to_work && (
                                            <div className="invalid-feedback" style={{display: 'block'}}>Для  продолжения необходимо выбрать один из вариантов</div>
                                        )}
                                    </React.Fragment>
                                )}
                                {values.is_employment_contract_terminated === '1' && (
                                    <React.Fragment>
                                        <FieldDate
                                            placeholder="Дата"
                                            hint="Дата расторжения трудового договора"
                                            name="employment_contract_date_dissolution"
                                            touched={touched.employment_contract_date_dissolution}
                                            error={errors.employment_contract_date_dissolution}
                                            value={values.employment_contract_date_dissolution}
                                            onChange={(date, str) => setFieldValue('employment_contract_date_dissolution', str)}
                                            onClose={() => setFieldTouched('employment_contract_date_dissolution')}
                                        />
                                        <p>Наличие приказа об увольнении</p>
                                        <FieldRadiobutton
                                            label="Есть"
                                            value="1"
                                            name="presence_of_dismissal_order"
                                            onClick={() => setFieldValue('presence_of_dismissal_order', '1')}
                                            checked={values.presence_of_dismissal_order === '1'}
                                            touched={touched.presence_of_dismissal_order}
                                            error={errors.presence_of_dismissal_order}
                                        />
                                        <FieldRadiobutton
                                            label="Нет"
                                            value="0"
                                            name="presence_of_dismissal_order"
                                            onClick={() => setFieldValue('presence_of_dismissal_order', '0')}
                                            checked={values.presence_of_dismissal_order === '0'}
                                            touched={touched.presence_of_dismissal_order}
                                            error={errors.presence_of_dismissal_order}
                                        />
                                        {errors.presence_of_dismissal_order && touched.presence_of_dismissal_order && (
                                            <div className="invalid-feedback" style={{display: 'block'}}>Для  продолжения необходимо выбрать один из вариантов</div>
                                        )}
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        )}
                        {errors.is_employment_contract_terminated && touched.is_employment_contract_terminated && (
                            <div className="invalid-feedback" style={{display: 'block'}}>Для  продолжения необходимо выбрать один из вариантов</div>
                        )}
                    </div>
                    <ServiceFooter/>
                </Form>
            )}
        </Formik>
    )
}

export default Step3
