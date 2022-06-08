import React from 'react'
import * as AdditionalSteps from '../additional-steps/AdditionalSteps'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

export const getSteps = props => [
    {
        name: 'Сведения о заявителе (работнике)',
        component: <Step1 name="Сведения о заявителе (работнике)" />
    },
    {
        name: 'Сведения о должнике',
        component: <Step2 name="Сведения о должнике" />
    },
    {
        name: 'Добавление сведений о трудовых отношениях',
        component: <Step3 name="Добавление сведений о трудовых отношениях" />
    },
    ...AdditionalSteps.getSteps(props)
]

export const getFormData = () => {
    return {
        name: window.user ? window.user.name : '',
        address: {
            address: window.user ? window.user.address : ''
        },
        email: window.user ? window.user.email : '',
        job_place: '',
        snils: '',
        passport_data: '',
        inn: '',
        driver_licence: '',
        debtor_type: '',
        debtor_name: '',
        debtor_address: {
            address: ''
        },
        debtor_email: '',
        debtor_phone: '',
        debtor_birth_date: '',
        debtor_job_place: '',
        debtor_snils: '',
        debtor_inn: '',
        debtor_passport_data: '',
        debtor_ogrn: '',
        debtor_driver_licence: '',
        is_employment_contract_terminated: '',
        employment_contract_date_conclusion: '',
        employment_contract_number: '',
        employee_position: '',
        presence_of_order_to_work: '',
        employment_contract_date_dissolution: '',
        presence_of_dismissal_order: '',
        ...AdditionalSteps.getFormData()
    }
}

export const formattedData = data => {
    const fields = {
        fias: data.debtor_address.fias,
        house: data.debtor_address.house,
        fields: {
            ...data
        },
        react: true
    }
    fields.fields.address = fields.fields.address.address
    fields.fields.debtor_address = fields.fields.debtor_address.address

    return  fields
}
