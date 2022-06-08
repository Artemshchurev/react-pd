import React from 'react'
import * as AdditionalSteps from '../additional-steps/AdditionalSteps'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import getRandomString from './../../helper/random-string'

export const getSteps = props => [
    {
        name: 'Данные о заявителе',
        component: <Step1 name="Данные о заявителе" />
    },
    {
        name: 'Данные о втором родителе ребёнка (детей)',
        component: <Step2 name="Данные о втором родителе ребёнка (детей)" />
    },
    {
        name: 'Дополнительные сведения',
        component: <Step3 name="Дополнительные сведения" />
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
        spouse_name: '',
        spouse_address: {
            address: '',
        },
        spouse_phone: '',
        spouse_email: '',
        spouse_job_place: '',
        spouse_snils: '',
        spouse_inn: '',
        spouse_passport_data: '',
        spouse_driver_licence: '',
        kids: [
            {
                name: "",
                birth_date: "",
                key: getRandomString(),
            },
        ],
        marriage: '',
        divorce_date: '',
        divorce_document: '',
        marriage_date: '',
        your_relation_with_child: '',
        is_child_lives_separately: '',
        is_child_communication_contract_concluded: '',
        child_communication_contract_date: '',
        ...AdditionalSteps.getFormData()
    }
}

export const formattedData = data => {
    return  {
        fias: data.spouse_address.fias,
        house: data.spouse_address.house,
        fields: {
            ...data
        },
        react: true
    }
}
