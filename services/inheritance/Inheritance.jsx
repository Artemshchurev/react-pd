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
        name: 'Данные о заинтересованных лицах',
        component: <Step2 name="Данные о заинтересованных лицах" />
    },
    {
        name: 'Дополнительные сведения',
        component: <Step3 name="Дополнительные сведения" />
    },
    ...AdditionalSteps.getSteps(props)
]

export const getFormData = () => {
    const key = getRandomString()
    const data = {
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
        interested_faces: {},
        testator_name: '',
        testator_death_date: '',
        inheritance_place: {
            address: '',
        },
        presence_of_will: '',
        will_preparation_date: '',
        your_relation_with_testator: '',
        is_missed_six_months: '',
        right_dispute: '',
        ...AdditionalSteps.getFormData()
    }
    data.interested_faces[key] = {
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

    return data
}

export const formattedData = data => {
    data.interested_faces = Object.entries(data.interested_faces).map(([key, interested_face]) => {
        interested_face.location = interested_face.location.address
        interested_face.address = interested_face.address.address
        return interested_face
    })
    data.inheritance_place = data.inheritance_place.address

    return  {
        fias: data.address.fias,
        house: data.address.house,
        fields: {
            ...data
        },
        react: true
    }
}
