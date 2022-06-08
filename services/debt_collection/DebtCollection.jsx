import React from 'react'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import * as AdditionalSteps from '../additional-steps/AdditionalSteps'

export const getSteps = props => [
    {
        name: 'Сведения о заявителе (физическом лице)',
        component: <Step1 name="Сведения о заявителе (физическом лице)" />
    },
    {
        name: 'Сведения о должнике',
        component: <Step2 name="Сведения о должнике" />
    },
    {
        name: 'Добавление информации о займе',
        component: <Step3 name="Добавление информации о займе" />
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
        is_contract_concluded: '',
        contract_date_conclusion: '',
        is_money_receipt: '',
        money_receipt_date_conclusion: '',
        loan: '',
        debt: '',
        is_debt_type_percent: '',
        interest_rate: '',
        interest_arrears: '',
        is_forfeit_on_loan: '',
        percent_of_penalty: '',
        amount_of_penalty: '',
        ...AdditionalSteps.getFormData()
    }
}

export const formattedData = data => {
    return  {
        fias: data.debtor_address.fias,
        house: data.debtor_address.house,
        fields: {
            ...data
        },
        react: true
    }
}
