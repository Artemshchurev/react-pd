import React, { useContext, useState } from 'react'
import { Form, Formik } from 'formik'

import ServiceHeader from '../ServiceHeader'
import ServiceFooter from '../ServiceFooter'
import { ServiceContext } from '../ServiceContext'
import Spinner from '../formFields/Spinner'
import FieldRadiobutton from '../formFields/FieldRadiobutton'
import FieldDate from '../formFields/FieldDate'
import FieldNumber from '../formFields/FieldNumber'
import FieldPrice from '../formFields/FieldPrice'
import FieldText from '../formFields/FieldText'
import FieldPercent from '../formFields/FieldPercent'


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
                if (!values.is_contract_concluded) {
                    errors.is_contract_concluded = true
                } else if (values.is_contract_concluded === '1' && !values.contract_date_conclusion) {
                    errors.contract_date_conclusion = 'Укажите, используя календарь'
                }

                if (!values.is_money_receipt) {
                    errors.is_money_receipt = true
                } else if (values.is_money_receipt === '1' && !values.money_receipt_date_conclusion) {
                    errors.money_receipt_date_conclusion = 'Укажите, используя календарь'
                }

                if (values.is_contract_concluded
                    && values.is_money_receipt
                    && values.is_contract_concluded === '0'
                    && values.is_money_receipt === '0') {
                    errors.receipt_or_contract = true
                } else {
                    let total_debt_amount = 0

                    if (!values.loan) {
                        errors.loan = true
                    }
                    if (!values.debt) {
                        errors.debt = true
                    } else {
                        total_debt_amount += parseFloat(values.debt)
                    }
                    if (values.loan && values.debt && parseFloat(values.debt) > parseFloat(values.loan)) {
                        errors.debt = 'Сумма задолженности не может быть больше суммы займа'
                    }
                    if (!values.is_debt_type_percent) {
                        errors.is_debt_type_percent = true
                    }

                    if (values.is_debt_type_percent === '1') {
                        if (!values.interest_rate) {
                            errors.interest_rate = true
                        } else if (parseFloat(values.interest_rate) > 100) {
                            errors.interest_rate = 'Укажите процент в диапазоне от 1 до 100'
                        }
                        if (!values.interest_arrears) {
                            errors.interest_arrears = true
                        } else {
                            total_debt_amount += parseFloat(values.interest_arrears)
                        }
                    }

                    if (!values.is_forfeit_on_loan) {
                        errors.is_forfeit_on_loan = true
                    } else if (values.is_forfeit_on_loan === '1') {
                        if (!values.percent_of_penalty) {
                            errors.percent_of_penalty = true
                        } else if (parseFloat(values.percent_of_penalty) > 100) {
                            errors.percent_of_penalty = 'Укажите процент в диапазоне от 1 до 100'
                        }
                        if (!values.amount_of_penalty || parseFloat(values.amount_of_penalty) <= 0) {
                            errors.amount_of_penalty = true
                        } else {
                            total_debt_amount += parseFloat(values.amount_of_penalty)
                        }
                    }

                    if (total_debt_amount > 500000) {
                        errors.total_debt_amount = true
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
                        <div className="card mb-3">
                            <div className="card-body">
                                <p>Договор займа</p>
                                <FieldRadiobutton
                                    label="Заключался"
                                    value="1"
                                    name="is_contract_concluded"
                                    onClick={() => setFieldValue('is_contract_concluded', '1')}
                                    checked={values.is_contract_concluded === '1'}
                                    touched={touched.is_contract_concluded}
                                    error={errors.is_contract_concluded}
                                />
                                {values.is_contract_concluded === '1' && (
                                    <div style={{marginLeft: '1.5rem'}}>
                                        <FieldDate
                                            placeholder="Дата"
                                            hint="Дата заключения договора займа"
                                            name="contract_date_conclusion"
                                            touched={touched.contract_date_conclusion}
                                            error={errors.contract_date_conclusion}
                                            value={values.contract_date_conclusion}
                                            onChange={(date, str) => setFieldValue('contract_date_conclusion', str)}
                                            onClose={() => setFieldTouched('contract_date_conclusion')}
                                        />
                                    </div>
                                )}
                                <FieldRadiobutton
                                    label="Не заключался"
                                    style={{marginBottom: 'unset'}}
                                    value="0"
                                    name="is_contract_concluded"
                                    onClick={() => setFieldValue('is_contract_concluded', '0')}
                                    checked={values.is_contract_concluded === '0'}
                                    touched={touched.is_contract_concluded}
                                    error={errors.is_contract_concluded}
                                />
                                {errors.is_contract_concluded && touched.is_contract_concluded && (
                                    <div className="invalid-feedback" style={{display: 'block'}}>Для  продолжения необходимо выбрать один из вариантов</div>
                                )}
                            </div>
                        </div>
                        <div className="card mb-3">
                            <div className="card-body">
                                <p>Расписка в получении денежных средств</p>
                                <FieldRadiobutton
                                    label="Составлялась"
                                    value="1"
                                    name="is_money_receipt"
                                    onClick={() => setFieldValue('is_money_receipt', '1')}
                                    checked={values.is_money_receipt === '1'}
                                    touched={touched.is_money_receipt}
                                    error={errors.is_money_receipt}
                                />
                                {values.is_money_receipt === '1' && (
                                    <div style={{marginLeft: '1.5rem'}}>
                                        <FieldDate
                                            placeholder="Дата"
                                            hint="Дата составления расписки"
                                            name="money_receipt_date_conclusion"
                                            touched={touched.money_receipt_date_conclusion}
                                            error={errors.money_receipt_date_conclusion}
                                            value={values.money_receipt_date_conclusion}
                                            onChange={(date, str) => setFieldValue('money_receipt_date_conclusion', str)}
                                            onClose={() => setFieldTouched('money_receipt_date_conclusion')}
                                        />
                                    </div>
                                )}
                                <FieldRadiobutton
                                    label="Не составлялась"
                                    style={{marginBottom: 'unset'}}
                                    value="0"
                                    name="is_money_receipt"
                                    onClick={() => setFieldValue('is_money_receipt', '0')}
                                    checked={values.is_money_receipt === '0'}
                                    touched={touched.is_money_receipt}
                                    error={errors.is_money_receipt}
                                />
                                {errors.is_money_receipt && touched.is_money_receipt && (
                                    <div className="invalid-feedback" style={{display: 'block'}}>Для  продолжения необходимо выбрать один из вариантов</div>
                                )}
                            </div>
                        </div>
                        {errors.receipt_or_contract && (
                            <div className="invalid-feedback" style={{display: 'block'}}>Для  использования данного продукта, необходимо наличие договора займа и (или) расписки</div>
                        )}
                        {!errors.receipt_or_contract && (values.is_contract_concluded === '1' || values.is_money_receipt === '1' ) && (
                            <div className="card mb-3">
                                <div className="card-body">
                                    <div className="form-group">
                                        <FieldPrice
                                            name="loan"
                                            placeholder="Сумма займа"
                                            value={values.loan}
                                            onChange={val => setFieldValue('loan', val)}
                                            error={errors.loan}
                                            touched={touched.loan}
                                            touchField={() => setFieldTouched('loan')}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <FieldPrice
                                            name="debt"
                                            placeholder="Задолженность"
                                            hint="Сумма задолженности на дату составления заявления"
                                            value={values.debt}
                                            onChange={val => setFieldValue('debt', val)}
                                            error={errors.debt}
                                            touched={touched.debt}
                                            touchField={() => setFieldTouched('debt')}
                                        />
                                    </div>
                                    <p>Займ является</p>
                                    <FieldRadiobutton
                                        label="Процентным"
                                        value="1"
                                        name="is_debt_type_percent"
                                        onClick={() => setFieldValue('is_debt_type_percent', '1')}
                                        checked={values.is_debt_type_percent === '1'}
                                        touched={touched.is_debt_type_percent}
                                        error={errors.is_debt_type_percent}
                                    />
                                    {values.is_debt_type_percent === '1' && (
                                        <div style={{marginLeft: '1.5rem'}}>
                                            <FieldPercent
                                                name="interest_rate"
                                                placeholder="Процент (%)"
                                                value={values.interest_rate}
                                                onChange={val => setFieldValue('interest_rate', val)}
                                                error={errors.interest_rate}
                                                touched={touched.interest_rate}
                                                touchField={() => setFieldTouched('interest_rate')}
                                            />
                                            <div className="form-group">
                                                <FieldPrice
                                                    name="interest_arrears"
                                                    placeholder="Задолженность"
                                                    hint="Задолженность по процентам на сумму займа на дату составления заявления"
                                                    value={values.interest_arrears}
                                                    onChange={val => setFieldValue('interest_arrears', val)}
                                                    error={errors.interest_arrears}
                                                    touched={touched.interest_arrears}
                                                    touchField={() => setFieldTouched('interest_arrears')}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <FieldRadiobutton
                                        label="Беспроцентным"
                                        value="0"
                                        name="is_debt_type_percent"
                                        onClick={() => setFieldValue('is_debt_type_percent', '0')}
                                        checked={values.is_debt_type_percent === '0'}
                                        touched={touched.is_debt_type_percent}
                                        error={errors.is_debt_type_percent}
                                    />
                                    {errors.is_debt_type_percent && touched.is_debt_type_percent && (
                                        <div className="invalid-feedback" style={{display: 'block'}}>Для  продолжения необходимо выбрать один из вариантов</div>
                                    )}
                                    <p>Неустойка по займу</p>
                                    <FieldRadiobutton
                                        label="Предусмотрена"
                                        value="1"
                                        name="is_forfeit_on_loan"
                                        onClick={() => setFieldValue('is_forfeit_on_loan', '1')}
                                        checked={values.is_forfeit_on_loan === '1'}
                                        touched={touched.is_forfeit_on_loan}
                                        error={errors.is_forfeit_on_loan}
                                    />
                                    {values.is_forfeit_on_loan === '1' && (
                                        <div style={{marginLeft: '1.5rem'}}>
                                            <FieldPercent
                                                name="percent_of_penalty"
                                                placeholder="Неустойка (%)"
                                                value={values.percent_of_penalty}
                                                hint="Размер неустойки (% за просроченный день)"
                                                onChange={val => setFieldValue('percent_of_penalty', val)}
                                                error={errors.percent_of_penalty}
                                                touched={touched.percent_of_penalty}
                                                touchField={() => setFieldTouched('percent_of_penalty')}
                                            />
                                            <FieldPrice
                                                name="amount_of_penalty"
                                                placeholder="Неустойка"
                                                value={values.amount_of_penalty}
                                                hint="Размер неустойки на дату составления заявления"
                                                onChange={val => setFieldValue('amount_of_penalty', val)}
                                                error={errors.amount_of_penalty}
                                                touched={touched.amount_of_penalty}
                                                touchField={() => setFieldTouched('amount_of_penalty')}
                                            />
                                        </div>
                                    )}
                                    <FieldRadiobutton
                                        label="Не предусмотрена"
                                        value="0"
                                        name="is_forfeit_on_loan"
                                        onClick={() => setFieldValue('is_forfeit_on_loan', '0')}
                                        checked={values.is_forfeit_on_loan === '0'}
                                        touched={touched.is_forfeit_on_loan}
                                        error={errors.is_forfeit_on_loan}
                                    />
                                    {errors.is_forfeit_on_loan && touched.is_forfeit_on_loan && (
                                        <div className="invalid-feedback" style={{display: 'block'}}>Для  продолжения необходимо выбрать один из вариантов</div>
                                    )}
                                    {errors.total_debt_amount && (
                                        <div className="invalid-feedback" style={{display: 'block'}}><b>Важно!</b> Для того, чтобы воспользоваться данным продуктом, размер взыскиваемых
                                            денежных сумм не должен превышать 500 000 руб.).
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <ServiceFooter/>
                </Form>
            )}
        </Formik>
    )
}

export default Step3
