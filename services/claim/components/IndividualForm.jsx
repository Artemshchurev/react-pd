import React from 'react'
import FieldName from '../../formFields/FieldName'
import FieldAddress from '../../formFields/FieldAddress'
import FieldPhone from '../../formFields/FieldPhone'

const IndividualForm = props => {
    return (
        <React.Fragment>
            <FieldName
                placeholder="ФИО"
                touched={props.touched.individual_entrepreneur_fio}
                error={props.errors.individual_entrepreneur_fio}
                value={props.values.individual_entrepreneur_fio}
                onChange={value => props.setFieldValue('individual_entrepreneur_fio', value)}
                touchField={() => props.setFieldTouched('individual_entrepreneur_fio')}
            />
            <FieldAddress
                touched={props.touched.individual_entrepreneur_address}
                error={props.errors.individual_entrepreneur_address}
                placeholder="Адрес"
                defaultValue={props.values.individual_entrepreneur_address.address}
                onChange={address => props.setFieldValue('individual_entrepreneur_address', address)}
                touchField={() => props.setFieldTouched('individual_entrepreneur_address')}
            />
            <FieldPhone
                touched={props.touched.individual_entrepreneur_phone}
                error={props.errors.individual_entrepreneur_phone}
                value={props.values.individual_entrepreneur_phone}
                onChange={e => props.setFieldValue('individual_entrepreneur_phone', e.target.value)}
                name="individual_entrepreneur_phone"
            />
        </React.Fragment>
    )
}

export default IndividualForm
