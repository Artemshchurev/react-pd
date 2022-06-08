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

    const addInterestedFace = interested_faces => {
        interested_faces[getRandomString()] = {
            type: '',
            name: '',
            address: {
                address: '',
            },
            email: '',
            phone: '',
            birth_date: '',
            job_place: '',
            snils: '',
            inn: '',
            passport_data: '',
            driver_licence: '',
            ogrn: '',// ИП и Юридическое лицо
            // Юридическое лицо
            location: {
                address: '',
            },
        }
        return interested_faces
    }

    const selectInterestedFaceType = (values, setFieldValue, key, type) => {
        setIsOpen(false)
        const interested_face = values.interested_faces[key]
        interested_face.type = type
        setFieldValue(`interested_faces.${key}`, interested_face)
    }

    const removeInterestedFace = (interested_faces, key) => {
        delete interested_faces[key]
        return interested_faces
    }

    return (
        <Formik
            initialValues={formData}
            validate={async values => {
                const errors = {
                    interested_faces: {},
                }

                let interestedFacesError = false
                Object.entries(values.interested_faces).forEach(([key, interested_face]) => {
                    errors.interested_faces[key] = {}
                    if (!interested_face.type) {
                        interestedFacesError = true
                        errors.interested_faces[key].type = true
                        errors.interested_faces[key].typeError = 'Для  продолжения необходимо выбрать один из вариантов'
                    } else {
                        if (!interested_face.name) {
                            errors.interested_faces[key].name = true
                            interestedFacesError = true
                        } else if (['entrepreneur', 'individual'].includes(interested_face.type)) {
                            if (/((?![а-яa-z\s]).)+/i.test(interested_face.name)) {
                                errors.interested_faces[key].name = 'Укажите, используя буквы русского или латинского алфавита'
                                interestedFacesError = true
                            } else if (/^\s/.test(interested_face.name)) {
                                errors.interested_faces[key].name = 'Данное поле не может начинаться с пробела'
                                interestedFacesError = true
                            } else if (!/^[а-яa-z]+\s[а-яa-z]+([а-яa-z\s]+)?$/i.test(interested_face.name)) {
                                errors.interested_faces[key].name = 'Укажите полностью фамилию, имя и отчество (при наличии)'
                                interestedFacesError = true
                            }
                        }

                        if (!interested_face.address.address) {
                            interestedFacesError = true
                            errors.interested_faces[key].address = 'Неполный адрес. Должен содержать населенный пункт, улицу, дом.'
                        }

                        if (interested_face.type === 'entity') {
                            if (!interested_face.location.address) {
                                interestedFacesError = true
                                errors.interested_faces[key].location = 'Неполный адрес. Должен содержать населенный пункт, улицу, дом.'
                            }

                            if (!interested_face.email) {
                                errors.interested_faces[key].email = true
                                interestedFacesError = true
                            } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(interested_face.email)) {
                                interestedFacesError = true
                                errors.interested_faces[key].email = 'Адрес электронной почты введен неверно. Проверьте правильность ввода'
                            }
                        }

                        if (!interested_face.phone && interested_face.type !== 'entity') {
                            interestedFacesError = true
                            errors.interested_faces[key].phone = true
                        }
                        if (interested_face.phone) {
                            const ruPhoneNumber = interested_face.phone.replace(/\(|\)|\s+|-/g, "")
                            if (!(ruPhoneNumber.length > 9 && /^((\+7|7|8)+([0-9]){10})$/.test(ruPhoneNumber))) {
                                interestedFacesError = true
                                errors.interested_faces[key].phone = 'Укажите, используя арабские цифры'
                            }
                        }

                        if (['entrepreneur', 'individual'].includes(interested_face.type)) {
                            if (interested_face.snils && interested_face.snils.replaceAll(/\D/ig, '').length < 11) {
                                interestedFacesError = true
                                errors.interested_faces[key].snils = 'Укажите данные полностью'
                            }

                            if (interested_face.passport_data && interested_face.passport_data.replaceAll(/\D/ig, '').length < 10) {
                                interestedFacesError = true
                                errors.interested_faces[key].passport_data = 'Укажите данные полностью'
                            }

                            if (interested_face.driver_licence && interested_face.driver_licence.replaceAll(/\D/ig, '').length < 10) {
                                interestedFacesError = true
                                errors.interested_faces[key].driver_licence = 'Укажите данные полностью'
                            }
                        }

                        if (interested_face.inn) {
                            const innCount = interested_face.type === 'entity' ? 10 : 12
                            if (interested_face.inn.replaceAll(/\D/ig, '').length < innCount) {
                                interestedFacesError = true
                                errors.interested_faces[key].inn = 'Укажите данные полностью'
                            }
                        }
                        if (['entrepreneur', 'entity'].includes(interested_face.type)) {
                            if (interested_face.ogrn) {
                                const ogrnCount = interested_face.type === 'entity' ? 13 : 15
                                if (interested_face.ogrn.replaceAll(/\D/ig, '').length < ogrnCount) {
                                    interestedFacesError = true
                                    errors.interested_faces[key].ogrn = 'Укажите данные полностью'
                                }
                            }
                        }
                    }
                })

                if (!interestedFacesError) {
                    delete errors.interested_faces
                }

                return errors
            }}
            onSubmit={buttonNextClick}
        >
            {({values, errors, touched, setFieldValue, setFieldTouched, setFieldError}) => (
                <Form noValidate>
                    <ServiceHeader
                        text={props.name}
                        modalQuestion={<p style={{textAlign: "justify"}}>
                            Заинтересованные лица – лица, права и интересы которых затрагиваются
                            заявлением. Ими являются другие наследники, если они имеются, и орган местного
                            самоуправления, уполномоченный приобретать выморочное имущество (для г. Москвы это
                            Департамент городского имущества г.Москвы), если спор рассматривает в отношении
                            недвижимого имущества.
                        </p>}
                        maxSteps={maxStep}
                        currentStep={step + 1}
                        buttonPreviousClick={buttonPreviousClick}
                    />
                    {isSpinner && <Spinner/>}
                    <div className="mx-auto" style={{maxWidth: 450, filter: isSpinner ? 'blur(5px)' : null}}>
                        <React.Fragment>
                            <div className="kids">
                                {Object.entries(values.interested_faces).map(([key, interested_face]) => (
                                    <div className="card mb-3" key={key}>
                                        <div className="card-body">
                                            <FieldRadiobutton
                                                label="Физическое лицо"
                                                value="individual"
                                                name={`interested_faces.${key}.type`}
                                                onClick={() => selectInterestedFaceType(values, setFieldValue, key, 'individual')}
                                                checked={interested_face.type === 'individual'}
                                                touched={
                                                    touched.interested_faces &&
                                                    touched.interested_faces[key] &&
                                                    touched.interested_faces[key].type
                                                }
                                                error={
                                                    errors.interested_faces &&
                                                    errors.interested_faces[key] &&
                                                    errors.interested_faces[key].type
                                                }
                                            />
                                            <FieldRadiobutton
                                                label="Индивидуальный предприниматель"
                                                value="entrepreneur"
                                                name={`interested_faces.${key}.type`}
                                                onClick={() => selectInterestedFaceType(values, setFieldValue, key, 'entrepreneur')}
                                                checked={interested_face.type === 'entrepreneur'}
                                                touched={
                                                    touched.interested_faces &&
                                                    touched.interested_faces[key] &&
                                                    touched.interested_faces[key].type
                                                }
                                                error={
                                                    errors.interested_faces &&
                                                    errors.interested_faces[key] &&
                                                    errors.interested_faces[key].type
                                                }
                                            />
                                            <FieldRadiobutton
                                                label="Юридическое лицо"
                                                value="entity"
                                                name={`interested_faces.${key}.type`}
                                                onClick={() => selectInterestedFaceType(values, setFieldValue, key, 'entity')}
                                                checked={interested_face.type === 'entity'}
                                                touched={
                                                    touched.interested_faces &&
                                                    touched.interested_faces[key] &&
                                                    touched.interested_faces[key].type
                                                }
                                                error={
                                                    errors.interested_faces &&
                                                    errors.interested_faces[key] &&
                                                    errors.interested_faces[key].type
                                                }
                                            />
                                            {interested_face.type && (
                                                <React.Fragment>
                                                    {['entrepreneur', 'individual'].includes(interested_face.type) && (
                                                        <FieldName
                                                            name={`interested_faces.${key}.name`}
                                                            placeholder="ФИО"
                                                            hint="Фамилия, имя и отчество"
                                                            touched={
                                                                touched.interested_faces &&
                                                                touched.interested_faces[key] &&
                                                                touched.interested_faces[key].name
                                                            }
                                                            error={
                                                                errors.interested_faces &&
                                                                errors.interested_faces[key] &&
                                                                errors.interested_faces[key].name
                                                            }
                                                            value={interested_face.name}
                                                            onChange={value => setFieldValue(`interested_faces.${key}.name`, value)}
                                                            touchField={() => setFieldTouched(`interested_faces.${key}.name`)}
                                                        />
                                                    )}
                                                    {interested_face.type === 'entity' && (
                                                        <FieldText
                                                            name={`interested_faces.${key}.name`}
                                                            placeholder="Юр. лицо"
                                                            hint="Наименование юридического лица"
                                                            touched={
                                                                touched.interested_faces &&
                                                                touched.interested_faces[key] &&
                                                                touched.interested_faces[key].name
                                                            }
                                                            error={
                                                                errors.interested_faces &&
                                                                errors.interested_faces[key] &&
                                                                errors.interested_faces[key].name
                                                            }
                                                            value={interested_face.name}
                                                            onChange={value => setFieldValue(`interested_faces.${key}.name`, value)}
                                                            touchField={() => setFieldTouched(`interested_faces.${key}.name`)}
                                                        />
                                                    )}
                                                    <FieldAddress
                                                        touched={
                                                            touched.interested_faces &&
                                                            touched.interested_faces[key] &&
                                                            touched.interested_faces[key].address
                                                        }
                                                        error={
                                                            errors.interested_faces &&
                                                            errors.interested_faces[key] &&
                                                            errors.interested_faces[key].address
                                                        }
                                                        placeholder={interested_face.type === 'entity' ? 'Юридический адрес' : 'Адрес проживания'}
                                                        defaultValue={interested_face.address.address}
                                                        name={`interested_faces.${key}.address`}
                                                        onChange={address => setFieldValue(`interested_faces.${key}.address`, address)}
                                                        touchField={() => setFieldTouched(`interested_faces.${key}.address`)}
                                                    />
                                                    {interested_face.type === 'entity' && (
                                                        <FieldAddress
                                                            touched={
                                                                touched.interested_faces &&
                                                                touched.interested_faces[key] &&
                                                                touched.interested_faces[key].location
                                                            }
                                                            error={
                                                                errors.interested_faces &&
                                                                errors.interested_faces[key] &&
                                                                errors.interested_faces[key].location
                                                            }
                                                            placeholder="Место нахождения"
                                                            defaultValue={interested_face.location.address}
                                                            name={`interested_faces.${key}.location`}
                                                            onChange={address => setFieldValue(`interested_faces.${key}.location`, address)}
                                                            touchField={() => setFieldTouched(`interested_faces.${key}.location`)}
                                                        />
                                                    )}
                                                    <FieldEmail
                                                        name={`interested_faces.${key}.email`}
                                                        touched={
                                                            touched.interested_faces &&
                                                            touched.interested_faces[key] &&
                                                            touched.interested_faces[key].email
                                                        }
                                                        error={
                                                            errors.interested_faces &&
                                                            errors.interested_faces[key] &&
                                                            errors.interested_faces[key].email
                                                        }
                                                        value={interested_face.email}
                                                        onChange={e => setFieldValue(`interested_faces.${key}.email`, e.target.value)}
                                                        touchField={() => setFieldTouched(`interested_faces.${key}.email`)}
                                                    />
                                                    <FieldPhone
                                                        touched={
                                                            touched.interested_faces &&
                                                            touched.interested_faces[key] &&
                                                            touched.interested_faces[key].phone
                                                        }
                                                        error={
                                                            errors.interested_faces &&
                                                            errors.interested_faces[key] &&
                                                            errors.interested_faces[key].phone
                                                        }

                                                        placeholder="Телефон"
                                                        value={interested_face.phone}
                                                        name={`interested_faces.${key}.phone`}
                                                        onChange={e => setFieldValue(`interested_faces.${key}.phone`, e.target.value)}
                                                        touchField={() => setFieldTouched(`interested_faces.${key}.phone`)}
                                                    />
                                                    {['entrepreneur', 'individual'].includes(interested_face.type) && (
                                                        <React.Fragment>
                                                            <div onClick={toggle} className="form-add-info">
                                                                Информация о заинтересованном лице <img src={isOpen ? ArrowUp: ArrowDown} alt=""/>
                                                            </div>
                                                            <Collapse isOpen={isOpen}>
                                                                <FieldDate
                                                                    placeholder="Дата рождения"
                                                                    name={`interested_faces.${key}.birth_date`}
                                                                    touched={
                                                                        touched.interested_faces &&
                                                                        touched.interested_faces[key] &&
                                                                        touched.interested_faces[key].birth_date
                                                                    }
                                                                    error={
                                                                        errors.interested_faces &&
                                                                        errors.interested_faces[key] &&
                                                                        errors.interested_faces[key].birth_date
                                                                    }
                                                                    value={interested_face.birth_date}
                                                                    onChange={(date, str) => setFieldValue(`interested_faces.${key}.birth_date`, str)}
                                                                    onClose={() => setFieldTouched(`interested_faces.${key}.birth_date`)}
                                                                />
                                                                <FieldText
                                                                    error={
                                                                        errors.interested_faces &&
                                                                        errors.interested_faces[key] &&
                                                                        errors.interested_faces[key].job_place
                                                                    }
                                                                    touched={
                                                                        touched.interested_faces &&
                                                                        touched.interested_faces[key] &&
                                                                        touched.interested_faces[key].job_place
                                                                    }
                                                                    name={`interested_faces.${key}.job_place`}
                                                                    placeholder="Место работы"
                                                                    value={interested_face.job_place}
                                                                    onChange={e => setFieldValue(`interested_faces.${key}.job_place`, e.target.value)}
                                                                    touchField={() => setFieldTouched(`interested_faces.${key}.job_place`)}
                                                                />
                                                                <FieldMaskedText
                                                                    error={
                                                                        errors.interested_faces &&
                                                                        errors.interested_faces[key] &&
                                                                        errors.interested_faces[key].snils
                                                                    }
                                                                    touched={
                                                                        touched.interested_faces &&
                                                                        touched.interested_faces[key] &&
                                                                        touched.interested_faces[key].snils
                                                                    }
                                                                    name={`interested_faces.${key}.snils`}
                                                                    placeholder="СНИЛС"
                                                                    value={interested_face.snils}
                                                                    onChange={e => setFieldValue(`interested_faces.${key}.snils`, e.target.value)}
                                                                    mask={[/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, ' ', /\d/, /\d/]}
                                                                />
                                                                <FieldMaskedText
                                                                    error={
                                                                        errors.interested_faces &&
                                                                        errors.interested_faces[key] &&
                                                                        errors.interested_faces[key].inn
                                                                    }
                                                                    touched={
                                                                        touched.interested_faces &&
                                                                        touched.interested_faces[key] &&
                                                                        touched.interested_faces[key].inn
                                                                    }
                                                                    name={`interested_faces.${key}.inn`}
                                                                    placeholder="ИНН"
                                                                    value={interested_face.inn}
                                                                    onChange={e => setFieldValue(`interested_faces.${key}.inn`, e.target.value)}
                                                                    mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                                                />
                                                                <FieldMaskedText
                                                                    error={
                                                                        errors.interested_faces &&
                                                                        errors.interested_faces[key] &&
                                                                        errors.interested_faces[key].passport_data
                                                                    }
                                                                    touched={
                                                                        touched.interested_faces &&
                                                                        touched.interested_faces[key] &&
                                                                        touched.interested_faces[key].passport_data
                                                                    }
                                                                    name={`interested_faces.${key}.passport_data`}
                                                                    placeholder="Паспорт"
                                                                    hint="Серия и номер паспорта"
                                                                    value={interested_face.passport_data}
                                                                    onChange={e => setFieldValue(`interested_faces.${key}.passport_data`, e.target.value)}
                                                                    mask={[/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                                                />
                                                                {interested_face.type === 'entrepreneur' && (
                                                                    <FieldMaskedText
                                                                        error={
                                                                            errors.interested_faces &&
                                                                            errors.interested_faces[key] &&
                                                                            errors.interested_faces[key].ogrn
                                                                        }
                                                                        touched={
                                                                            touched.interested_faces &&
                                                                            touched.interested_faces[key] &&
                                                                            touched.interested_faces[key].ogrn
                                                                        }
                                                                        name={`interested_faces.${key}.ogrn`}
                                                                        placeholder="ОГРН"
                                                                        hint="ОГРН индивидуального предпринимателя"
                                                                        value={interested_face.ogrn}
                                                                        onChange={e => setFieldValue(`interested_faces.${key}.ogrn`, e.target.value)}
                                                                        mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                                                    />
                                                                )}
                                                                <FieldMaskedText
                                                                    error={
                                                                        errors.interested_faces &&
                                                                        errors.interested_faces[key] &&
                                                                        errors.interested_faces[key].driver_licence
                                                                    }
                                                                    touched={
                                                                        touched.interested_faces &&
                                                                        touched.interested_faces[key] &&
                                                                        touched.interested_faces[key].driver_licence
                                                                    }
                                                                    name={`interested_faces.${key}.driver_licence`}
                                                                    placeholder="Серия и номер в/у"
                                                                    value={interested_face.driver_licence}
                                                                    onChange={e => setFieldValue(`interested_faces.${key}.driver_licence`, e.target.value)}
                                                                    mask={[/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                                                />
                                                            </Collapse>
                                                        </React.Fragment>
                                                    )}
                                                    {interested_face.type === 'entity' && (
                                                        <React.Fragment>
                                                            <FieldMaskedText
                                                                error={
                                                                    errors.interested_faces &&
                                                                    errors.interested_faces[key] &&
                                                                    errors.interested_faces[key].inn
                                                                }
                                                                touched={
                                                                    touched.interested_faces &&
                                                                    touched.interested_faces[key] &&
                                                                    touched.interested_faces[key].inn
                                                                }
                                                                name={`interested_faces.${key}.inn`}
                                                                placeholder="ИНН"
                                                                value={interested_face.inn}
                                                                onChange={e => setFieldValue(`interested_faces.${key}.inn`, e.target.value)}
                                                                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                                            />
                                                            <FieldMaskedText
                                                                error={
                                                                    errors.interested_faces &&
                                                                    errors.interested_faces[key] &&
                                                                    errors.interested_faces[key].ogrn
                                                                }
                                                                touched={
                                                                    touched.interested_faces &&
                                                                    touched.interested_faces[key] &&
                                                                    touched.interested_faces[key].ogrn
                                                                }
                                                                name={`interested_faces.${key}.ogrn`}
                                                                placeholder="ОГРН"
                                                                value={interested_face.ogrn}
                                                                onChange={e => setFieldValue(`interested_faces.${key}.ogrn`, e.target.value)}
                                                                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                                            />
                                                        </React.Fragment>
                                                    )}
                                                </React.Fragment>
                                            )}
                                            <Button
                                                style={{
                                                    fontSize: 14,
                                                    lineHeight: "18px",
                                                    padding: "10px 20px"
                                                }}
                                                className={`float-right align-items-center ${Object.keys(values.interested_faces).length === 1 ? 'd-none' : 'd-flex'}`}
                                                outline
                                                color="primary"
                                                onClick={() => setFieldValue('interested_faces', removeInterestedFace(values.interested_faces, key))}
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
                                            {errors.interested_faces
                                                && errors.interested_faces[key]
                                                && errors.interested_faces[key].typeError
                                                && touched.interested_faces
                                                && touched.interested_faces[key]
                                                && touched.interested_faces[key].type && (
                                                <div className="invalid-feedback" style={{display: 'block'}}>{errors.interested_faces[key].typeError}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button
                                block
                                color="primary"
                                outline
                                onClick={() => setFieldValue("interested_faces", addInterestedFace(values.interested_faces))}
                                style={{marginBottom: '15px'}}
                            >
                                Добавить заинтересованное лицо
                            </Button>
                        </React.Fragment>
                    </div>
                    <ServiceFooter/>
                </Form>
            )}
        </Formik>
    )
}

export default Step2
