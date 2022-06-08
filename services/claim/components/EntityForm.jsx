import React from 'react'
import FieldText from '../../formFields/FieldText'
import FieldAddress from '../../formFields/FieldAddress'

const EntityForm = props => {
    return (
        <React.Fragment>
            <FieldText
                touched={props.touched.legal_entity_inn}
                error={props.errors.legal_entity_inn}
                name="legal_entity_inn"
                placeholder="ИНН"
                value={props.values.legal_entity_inn}
                onChange={e => props.setFieldValue('legal_entity_inn', e.target.value)}
            />
            <FieldText
                touched={props.touched.legal_entity_name}
                error={props.errors.legal_entity_name}
                name="legal_entity_name"
                placeholder="Наименование"
                value={props.values.legal_entity_name}
                onChange={e => props.setFieldValue('legal_entity_name', e.target.value)}
            />
            <FieldAddress
                touched={props.touched.legal_entity_address}
                error={props.errors.legal_entity_address}
                placeholder="Адрес"
                defaultValue={props.values.legal_entity_address.address}
                onChange={address => props.setFieldValue("legal_entity_address", address)}
                touchField={() => props.setFieldTouched("legal_entity_address")}
            />
        </React.Fragment>
    );
}

export default EntityForm
