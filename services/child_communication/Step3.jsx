import React, {useContext, useState} from 'react'
import {Form, Formik} from 'formik'

import ServiceHeader from '../ServiceHeader'
import ServiceFooter from '../ServiceFooter'
import {ServiceContext} from '../ServiceContext'
import Spinner from '../formFields/Spinner'
import FieldRadiobutton from '../formFields/FieldRadiobutton'
import FieldDate from '../formFields/FieldDate'
import FieldName from '../formFields/FieldName'
import { Button } from 'reactstrap'
import getRandomString from './../../helper/random-string'

const Step3 = props => {
    const {step, maxStep, previousStep, formData, nextStep} = useContext(ServiceContext)
    const [isSpinner, setIsSpinner] = useState(false)

    const addNewChild = kids => {
        kids.push({
            name: "",
            birth_date: "",
            key: getRandomString(),
        })
        return kids
    }

    const removeChild = (kids, index) => {
        kids.splice(index, 1)
        return kids
    }

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
                const errors = {
                    kids: [],
                }
                if (!values.marriage) {
                    errors.marriage = true
                } else if (values.marriage === 'dissolved' && !values.divorce_document) {
                    if (!values.divorce_document) {
                        errors.divorce_document = true
                    }
                    if (!values.divorce_date) {
                        errors.divorce_date = 'Укажите, используя календарь'
                    }
                } else if (values.marriage === "not_dissolved" && !values.marriage_date) {
                    errors.marriage_date = 'Укажите, используя календарь'
                }
                if (!values.your_relation_with_child) {
                    errors.your_relation_with_child = true
                }
                if (values.is_child_lives_separately !== '1') {
                    errors.is_child_lives_separately = true
                    errors.child_lives_separately_text = 'Продолжение формирования заявления возможно только при раздельном проживании заявителя с ребенком (детьми)'
                }
                if (!values.is_child_communication_contract_concluded) {
                    errors.is_child_communication_contract_concluded = true
                } else if (values.is_child_communication_contract_concluded === '1' && !values.child_communication_contract_date) {
                    errors.child_communication_contract_date = 'Укажите, используя календарь'
                }

                let kidsHasError = false
                if (values.kids.length) {
                    values.kids.map((kid, index) => {
                        errors.kids[index] = {}
                        if (!kid.birth_date) {
                            errors.kids[index].birth_date = true
                            kidsHasError = true
                        }

                        if (!kid.name) {
                            errors.kids[index].name = true
                            kidsHasError = true
                        } else if (/((?![а-яa-z\s]).)+/i.test(kid.name)) {
                            errors.kids[index].name = 'Укажите, используя буквы русского или латинского алфавита'
                            kidsHasError = true
                        } else if (/^\s/.test(kid.name)) {
                            errors.kids[index].name = 'Данное поле не может начинаться с пробела'
                            kidsHasError = true
                        } else if (!/^[а-яa-z]+\s[а-яa-z]+([а-яa-z\s]+)?$/i.test(kid.name)) {
                            errors.kids[index].name = 'Укажите полностью фамилию, имя и отчество (при наличии)'
                            kidsHasError = true
                        }
                    })
                }

                if (!kidsHasError) {
                    delete errors.kids;
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
                    <div className="mx-auto" style={{maxWidth: 450, filter: isSpinner ? 'blur(5px)' : null, color: 'black'}}>
                        <p>Данные о браке<sup>*</sup></p>
                        <FieldRadiobutton
                            error={errors.marriage}
                            touched={touched.marriage}
                            label="Брак расторгнут"
                            name="marriage"
                            checked={values.marriage === "dissolved"}
                            onClick={() => setFieldValue("marriage", "dissolved")}
                            value="dissolved"
                        />
                        {values.marriage === "dissolved" && (
                            <div style={{ marginLeft: '1.5rem' }}>
                                <FieldDate
                                    placeholder="Дата расторжения брака"
                                    name="divorce_date"
                                    touched={touched.divorce_date}
                                    error={errors.divorce_date}
                                    value={values.divorce_date}
                                    onChange={(date, str) => setFieldValue("divorce_date", str)}
                                    onClose={() => setFieldTouched("divorce_date")}
                                />
                                <p>Подтверждающий документ<sup>*</sup></p>
                                <FieldRadiobutton
                                    error={errors.divorce_document}
                                    touched={touched.divorce_document}
                                    label="Свидетельство о расторжении брака"
                                    name="divorce_document"
                                    checked={values.divorce_document === "certificate"}
                                    onClick={() => setFieldValue("divorce_document", "certificate")}
                                    value="certificate"
                                />
                                <FieldRadiobutton
                                    error={errors.divorce_document}
                                    touched={touched.divorce_document}
                                    label="Решение суда о расторжении брака"
                                    name="divorce_document"
                                    checked={values.divorce_document === "court_decision"}
                                    onClick={() => setFieldValue("divorce_document", "court_decision")}
                                    value="court_decision"
                                />
                            </div>
                        )}

                        <FieldRadiobutton
                            error={errors.marriage}
                            touched={touched.marriage}
                            label="Брак не расторгнут"
                            name="marriage"
                            checked={values.marriage === "not_dissolved"}
                            onClick={() => setFieldValue("marriage", "not_dissolved")}
                            value="not_dissolved"
                        />
                        {values.marriage === "not_dissolved" && (
                            <div style={{ marginLeft: '1.5rem' }}>
                                <FieldDate
                                    placeholder="Дата заключения брака"
                                    name="marriage_date"
                                    touched={touched.marriage_date}
                                    error={errors.marriage_date}
                                    value={values.marriage_date}
                                    onChange={(date, str) => setFieldValue("marriage_date", str)}
                                    onClose={() => setFieldTouched("marriage_date")}
                                />
                            </div>
                        )}
                        <FieldRadiobutton
                            error={errors.marriage}
                            touched={touched.marriage}
                            label="Брак не заключался"
                            name="marriage"
                            checked={values.marriage === "was_not_concluded"}
                            onClick={() => setFieldValue("marriage", "was_not_concluded")}
                            value="was_not_concluded"
                        />
                        <p>Наличие общих несовершеннолетних детей<sup>*</sup></p>
                        {values.kids.length ? (
                            <React.Fragment>
                                <div className="kids">
                                    {values.kids.map((kid, index) => (
                                        <div className="card mb-3" key={kid.key}>
                                            <div className="card-body">
                                                <FieldName
                                                    placeholder="Полное имя ребенка"
                                                    name={`kids.${index}.name`}
                                                    touched={
                                                        touched.kids &&
                                                        touched.kids[index] &&
                                                        touched.kids[index].name
                                                    }
                                                    error={
                                                        errors.kids &&
                                                        errors.kids[index] &&
                                                        errors.kids[index].name
                                                    }
                                                    value={kid.name}
                                                    onChange={value => setFieldValue(`kids.${index}.name`, value)}
                                                    touchField={() => setFieldTouched(`kids.${index}.name`)}
                                                />
                                                <FieldDate
                                                    name={`kids.${index}.birth_date`}
                                                    placeholder="Дата рождения"
                                                    touched={
                                                        touched.kids &&
                                                        touched.kids[index] &&
                                                        touched.kids[index]
                                                            .birth_date
                                                    }
                                                    error={
                                                        errors.kids &&
                                                        errors.kids[index] &&
                                                        errors.kids[index]
                                                            .birth_date
                                                    }
                                                    value={kid.birth_date}
                                                    onChange={(date, str) => setFieldValue(`kids.${index}.birth_date`, str)}
                                                    onClose={() => setFieldTouched(`kids.${index}.birth_date`)}
                                                />
                                                <Button
                                                    style={{
                                                        fontSize: 14,
                                                        lineHeight: "18px",
                                                        padding: "10px 20px"
                                                    }}
                                                    className={`float-right align-items-center ${values.kids.length === 1 ? 'd-none' : 'd-flex'}`}
                                                    outline
                                                    color="primary"
                                                    onClick={() => setFieldValue("kids", removeChild(values.kids, index))}
                                                >
                                                    Удалить&nbsp;
                                                    <svg
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 18 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M4.5 15.0779C4.5 15.9029 5.175 16.5779 6 16.5779H12C12.825 16.5779 13.5 15.9029 13.5 15.0779V6.07788H4.5V15.0779ZM6 7.57788H12V15.0779H6V7.57788ZM11.625 3.82788L10.875 3.07788H7.125L6.375 3.82788H3.75V5.32788H14.25V3.82788H11.625Z"
                                                            fill="currentColor"
                                                        />
                                                    </svg>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    block
                                    color="primary"
                                    outline
                                    onClick={() => setFieldValue("kids", addNewChild(values.kids))}
                                    style={{marginBottom: '15px'}}
                                >
                                    Добавить еще ребенка
                                </Button>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <div className="text-center mb-3">
                                    Есть дети до 18 лет?
                                </div>
                                <div className="text-center mb-3 kids-text">
                                    <Button
                                        color="primary"
                                        className="mr-3"
                                        onClick={() => setFieldValue("kids", addNewChild(values.kids))}
                                    >
                                        Да
                                    </Button>
                                    <Button
                                        color="primary"
                                        outline
                                        onClick={() => buttonNextClick(values)}
                                    >
                                        Нет
                                    </Button>
                                </div>
                            </React.Fragment>
                        )}
                        <p>Кем Вы являетесь ребёнку (детям)?<sup>*</sup></p>
                        <FieldRadiobutton
                            error={errors.your_relation_with_child}
                            touched={touched.your_relation_with_child}
                            label="Матерью"
                            name="your_relation_with_child"
                            checked={values.your_relation_with_child === "mother"}
                            onClick={() => setFieldValue("your_relation_with_child", "mother")}
                            value="mother"
                        />
                        <FieldRadiobutton
                            error={errors.your_relation_with_child}
                            touched={touched.your_relation_with_child}
                            label="Отцом"
                            name="your_relation_with_child"
                            checked={values.your_relation_with_child === "father"}
                            onClick={() => setFieldValue("your_relation_with_child", "father")}
                            value="father"
                        />
                        <p>Ребёнок (дети) проживает(ют) отдельно Вас?<sup>*</sup></p>
                        <FieldRadiobutton
                            error={errors.is_child_lives_separately}
                            touched={touched.is_child_lives_separately}
                            label="Да"
                            name="is_child_lives_separately"
                            checked={values.is_child_lives_separately === "1"}
                            onClick={() => setFieldValue("is_child_lives_separately", "1")}
                            value="1"
                        />
                        <FieldRadiobutton
                            error={errors.is_child_lives_separately}
                            touched={touched.is_child_lives_separately}
                            label="Нет"
                            name="is_child_lives_separately"
                            checked={values.is_child_lives_separately === "0"}
                            onClick={() => setFieldValue("is_child_lives_separately", "0")}
                            value="0"
                        />
                        {touched.is_child_lives_separately && errors.child_lives_separately_text && (
                            <div
                                className="invalid-feedback"
                                style={{display: 'block', marginTop: '-1rem', marginBottom: '1rem'}}
                            >
                                {errors.child_lives_separately_text}
                            </div>
                        )}
                        <p>Вы заключали соглашение со вторым родителем о порядке общения с ребёнком (детьми)?<sup>*</sup></p>
                        <FieldRadiobutton
                            error={errors.is_child_communication_contract_concluded}
                            touched={touched.is_child_communication_contract_concluded}
                            label="Да"
                            name="is_child_communication_contract_concluded"
                            checked={values.is_child_communication_contract_concluded === "1"}
                            onClick={() => setFieldValue("is_child_communication_contract_concluded", "1")}
                            value="1"
                        />
                        {values.is_child_communication_contract_concluded === "1" && (
                            <div style={{ marginLeft: '1.5rem' }}>
                                <FieldDate
                                    placeholder="Дата заключения соглашения"
                                    name="child_communication_contract_date"
                                    touched={touched.child_communication_contract_date}
                                    error={errors.child_communication_contract_date}
                                    value={values.child_communication_contract_date}
                                    onChange={(date, str) => setFieldValue("child_communication_contract_date", str)}
                                    onClose={() => setFieldTouched("child_communication_contract_date")}
                                />
                            </div>
                        )}
                        <FieldRadiobutton
                            error={errors.is_child_communication_contract_concluded}
                            touched={touched.is_child_communication_contract_concluded}
                            label="Нет"
                            name="is_child_communication_contract_concluded"
                            checked={values.is_child_communication_contract_concluded === "0"}
                            onClick={() => setFieldValue("is_child_communication_contract_concluded", "0")}
                            value="0"
                        />
                    </div>
                    <ServiceFooter/>
                </Form>
            )}
        </Formik>
    )
}

export default Step3
