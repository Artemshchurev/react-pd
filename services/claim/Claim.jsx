import React from 'react'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

import * as AdditionalSteps from '../additional-steps/AdditionalSteps'

export const getSteps = props => [
    {
        name: 'Данные о заявителе',
        component: <Step1 name="Данные о заявителе"/>,
    },
    {
        name: 'Данные о получателе претензии',
        component: <Step2 name="Данные о получателе претензии" />,
    },
    {
        name: 'Претензия',
        component: <Step3 name="Претензия" />,
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
        claim_recipient: 'entity',
        legal_entity_inn: '',
        legal_entity_name: '',
        legal_entity_address: {
            address: '',
        },
        individual_entrepreneur_fio: '',
        individual_entrepreneur_address: {
            address: '',
        },
        individual_entrepreneur_phone: '',
        claim_to: '',
        ...AdditionalSteps.getFormData(),
    }
}

export const formattedData = data => {
    const fields = {
        plaintiff_fias: data.address.fias,
        plaintiff_house: data.address.house,
        fields: {
            receiver: {},
            reason: {
                reason: data.claim_to,
            }
        },
        react: true
    }
    if (data.claim_recipient === 'entity') {
        fields.fields.receiver = {
            type: 'entity',
            inn: data.legal_entity_inn,
            name: data.legal_entity_name,
            address: data.legal_entity_address,
        }
    } else if (data.claim_recipient === 'individual') {
        fields.fields.receiver = {
            type: 'individual',
            name: data.individual_entrepreneur_fio,
            address: data.individual_entrepreneur_address,
            phone: data.individual_entrepreneur_phone,
        }
    }

    fields.fias = fields.fields.receiver.address.fias
    fields.house = fields.fields.receiver.address.house
    fields.fields.receiver.address = fields.fields.receiver.address.address

    return fields
}
