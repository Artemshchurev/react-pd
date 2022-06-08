import React, {useContext, useState} from 'react'
import {Form, Formik} from 'formik'

import ServiceHeader from '../ServiceHeader'
import ServiceFooter from '../ServiceFooter'
import {ServiceContext} from '../ServiceContext'
import Spinner from '../formFields/Spinner'
import FieldRadiobutton from '../formFields/FieldRadiobutton'
import FieldDate from '../formFields/FieldDate'
import FieldName from '../formFields/FieldName'
import FieldText from '../formFields/FieldText'
import FieldAddress from "../formFields/FieldAddress";

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
                if (!values.testator_name) {
                    errors.testator_name = true
                } else if (/((?![а-яa-z\s]).)+/i.test(values.testator_name)) {
                    errors.testator_name = 'Укажите, используя буквы русского или латинского алфавита'
                } else if (/^\s/.test(values.testator_name)) {
                    errors.testator_name = 'Данное поле не может начинаться с пробела'
                } else if (!/^[а-яa-z]+\s[а-яa-z]+([а-яa-z\s]+)?$/i.test(values.testator_name)) {
                    errors.testator_name = 'Укажите полностью фамилию, имя и отчество (при наличии)'
                }
                if (!values.testator_death_date) {
                    errors.testator_death_date = true
                }
                if (!values.inheritance_place.address) {
                    errors.inheritance_place = 'Неполный адрес. Должен содержать населенный пункт, улицу, дом.'
                }
                if (!values.presence_of_will) {
                    errors.presence_of_will = true
                    errors.presence_of_will_error = 'Для  продолжения необходимо выбрать один из вариантов'
                } else if (values.presence_of_will === '1' && !values.will_preparation_date) {
                    errors.will_preparation_date = 'Укажите, используя календарь'
                } else if (values.presence_of_will === '0' && !values.your_relation_with_testator) {
                    errors.your_relation_with_testator = true
                }

                if (!values.is_missed_six_months) {
                    errors.is_missed_six_months = true
                    errors.is_missed_six_months_error = 'Для  продолжения необходимо выбрать один из вариантов'
                } else if (values.is_missed_six_months !== '1') {
                    errors.is_missed_six_months = true
                    errors.is_missed_six_months_error = 'Для  использования  данного продукта необходим пропуск 6 месячного срока для обращения к нотариусу'
                }

                if (!values.right_dispute) {
                    errors.right_dispute = true
                    errors.right_dispute_error = 'Для  продолжения необходимо выбрать один из вариантов'
                } else if (values.right_dispute !== '0') {
                    errors.right_dispute = true
                    errors.right_dispute_error = 'Для использования данного продукта необходимо отсутствие наличия спора о праве'
                }

                return errors
            }}
            onSubmit={buttonNextClick}
        >
            {({values, errors, touched, setFieldValue, setFieldTouched}) => (
                <Form noValidate>
                    <ServiceHeader
                        text={props.name}
                        modalQuestion={<div>
                            <p style={{textAlign: "justify"}}>Заявление об установлении факта принятия наследства рассматривается судом в порядке
                                особого производства (ст. 264 Гражданского процессуального кодекса РФ).</p>
                            <p style={{textAlign: "justify"}}>Однако, если  заинтересованные  лица  по  делу  (в  том  числе  другие  наследники)  будут
                                возражать против  установления  данного  юридического  факта, суд  обязан  оставить  заявление
                                без рассмотрения, поскольку между заинтересованными лицами имеется <b>спор о праве</b>.</p>
                            <p style={{textAlign: "justify"}}>В таком случае, суд разъясняет заявителю его право обращения в суд в порядке искового
                                производства.</p>
                        </div>}
                        maxSteps={maxStep}
                        currentStep={step + 1}
                        buttonPreviousClick={buttonPreviousClick}
                    />
                    {isSpinner && <Spinner/>}
                    <div className="mx-auto" style={{maxWidth: 450, filter: isSpinner ? 'blur(5px)' : null, color: 'black'}}>
                        <FieldName
                            placeholder="ФИО наследодателя"
                            hint="Фамилия, имя и отчество наследодателя"
                            touchField={() => setFieldTouched('testator_name')}
                            error={errors.testator_name}
                            touched={touched.testator_name}
                            name="testator_name"
                            value={values.testator_name}
                            onChange={value => setFieldValue('testator_name', value)}
                        />
                        <FieldDate
                            placeholder="Дата смерти"
                            hint="Дата смерти наследодателя"
                            name={'testator_death_date'}
                            touched={touched.testator_death_date}
                            error={errors.testator_death_date }
                            value={values.testator_death_date}
                            onChange={(date, str) => setFieldValue('testator_death_date', str)}
                            onClose={() => setFieldTouched('testator_death_date')}
                        />
                        <FieldAddress
                            touched={touched.inheritance_place}
                            error={errors.inheritance_place}
                            placeholder="Место открытия"
                            defaultValue={values.inheritance_place.address}
                            name="inheritance_place"
                            onChange={address => setFieldValue('inheritance_place', address)}
                            touchField={() => setFieldTouched('inheritance_place')}
                            hint="Место открытия наследства"
                            modalQuestion={<div>
                                <p style={{textAlign: "justify"}}>Местом открытия наследства является последнее место жительства наследодателя.</p>
                                <p style={{textAlign: "justify"}}>Если  последнее  место  жительства  наследодателя,  обладавшего  имуществом  на
                                    территории  Российской  Федерации,  неизвестно  или  находится  за  ее  пределами,  местом
                                    открытия  наследства  в  Российской  Федерации  признается  место  нахождения  такого
                                    наследственного имущества. Если такое наследственное имущество находится в разных местах,
                                    местом открытия наследства является место нахождения входящих в его состав недвижимого
                                    имущества или наиболее ценной части недвижимого имущества, а при отсутствии недвижимого
                                    имущества - место нахождения движимого имущества или его наиболее ценной части. Ценность
                                    имущества определяется исходя из его рыночной стоимости.</p>
                            </div>}
                        />
                        <p>Наличие завещания</p>
                        <FieldRadiobutton
                            label="Есть"
                            value="1"
                            name="presence_of_will"
                            onClick={() => setFieldValue('presence_of_will', '1')}
                            checked={values.presence_of_will === '1'}
                            touched={touched.presence_of_will}
                            error={errors.presence_of_will}
                        />
                        {values.presence_of_will === '1' && (
                            <FieldDate
                                style={{ marginLeft: '1.5rem' }}
                                placeholder="Дата составления"
                                name="will_preparation_date"
                                touched={touched.will_preparation_date}
                                error={errors.will_preparation_date }
                                value={values.will_preparation_date}
                                onChange={(date, str) => setFieldValue('will_preparation_date', str)}
                                onClose={() => setFieldTouched('will_preparation_date')}
                            />
                        )}
                        <FieldRadiobutton
                            label="Нет"
                            value="0"
                            name="presence_of_will"
                            onClick={() => setFieldValue('presence_of_will', '0')}
                            checked={values.presence_of_will === '0'}
                            touched={touched.presence_of_will}
                            error={errors.presence_of_will}
                        />
                        {values.presence_of_will === '0' && (
                            <FieldText
                                touched={touched.your_relation_with_testator}
                                error={errors.your_relation_with_testator}
                                name="your_relation_with_testator"
                                placeholder="Наследодатель"
                                hint="Кем Вам приходится наследодатель"
                                value={values.your_relation_with_testator}
                                onChange={e => setFieldValue('your_relation_with_testator', e.target.value)}
                                secondHint="Пример заполнения: Отцом"
                            />
                        )}
                        {(touched.presence_of_will && errors.presence_of_will_error) && <div className="invalid-feedback" style={{display: 'block'}}>{errors.presence_of_will_error}</div>}
                        <p>Вы пропустили 6 месячный срок со дня открытия наследства для обращения к нотариусу?</p>
                        <FieldRadiobutton
                            label="Да"
                            value="1"
                            name="is_missed_six_months"
                            onClick={() => setFieldValue('is_missed_six_months', '1')}
                            checked={values.is_missed_six_months === '1'}
                            touched={touched.is_missed_six_months}
                            error={errors.is_missed_six_months}
                        />
                        <FieldRadiobutton
                            label="Нет"
                            value="0"
                            name="is_missed_six_months"
                            onClick={() => setFieldValue('is_missed_six_months', '0')}
                            checked={values.is_missed_six_months === '0'}
                            touched={touched.is_missed_six_months}
                            error={errors.is_missed_six_months}
                        />
                        {(touched.is_missed_six_months && errors.is_missed_six_months_error) && <div className="invalid-feedback" style={{display: 'block'}}>{errors.is_missed_six_months_error}</div>}
                        <p>Наличие спора о праве</p>
                        <FieldRadiobutton
                            label="Есть"
                            value="1"
                            name="right_dispute"
                            onClick={() => setFieldValue('right_dispute', '1')}
                            checked={values.right_dispute === '1'}
                            touched={touched.right_dispute}
                            error={errors.right_dispute}
                        />
                        <FieldRadiobutton
                            label="Нет"
                            value="0"
                            name="right_dispute"
                            onClick={() => setFieldValue('right_dispute', '0')}
                            checked={values.right_dispute === '0'}
                            touched={touched.right_dispute}
                            error={errors.right_dispute}
                        />
                        {(touched.right_dispute && errors.right_dispute_error) && <div className="invalid-feedback" style={{display: 'block'}}>{errors.right_dispute_error}</div>}
                    </div>
                    <ServiceFooter/>
                </Form>
            )}
        </Formik>
    )
}

export default Step3
