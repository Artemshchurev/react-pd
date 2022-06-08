import React, {useContext} from "react"
import {Form, Formik} from "formik"

import ServiceHeader from "../ServiceHeader"
import ServiceFooter from "../ServiceFooter"
import {ServiceContext} from "../ServiceContext"
import FieldRadiobutton from '../formFields/FieldRadiobutton'


const Step3 = props => {
    const {step, maxStep, formData, previousStep, nextStep} = useContext(ServiceContext)

    const buttonNextClick = data => {
        if (nextStep(data)) {
            props.jumpToStep(step + 1)
        }
    }

    const buttonPreviousClick = () => {
        previousStep()
        props.jumpToStep(step - 1)
    }

    return (
        <Formik
            initialValues={formData}
            validate={async values => {
                const errors = {};
                if (!values.claim_to) {
                    errors.claim_to = true
                }

                return errors;
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
                    <div className="mx-auto" style={{maxWidth: 450}}>
                        <div>Вы подаёте претензию на:</div>
                        <FieldRadiobutton
                            label="Товар"
                            name="claim_to"
                            error={errors.claim_to}
                            className="custom-control-inline"
                            checked={values.claim_to === "product"}
                            onClick={() => setFieldValue("claim_to", "product")}
                            touched={touched.claim_to}
                            value="product"
                        />
                        <FieldRadiobutton
                            label="Работу/услугу"
                            name="claim_to"
                            error={errors.claim_to}
                            labelStyle={{whiteSpace: 'nowrap'}}
                            className="custom-control-inline"
                            checked={values.claim_to === "service"}
                            onClick={() => setFieldValue("claim_to", "service")}
                            touched={touched.claim_to}
                            value="service"
                        />
                    </div>
                    <ServiceFooter buttonPreviousClick={buttonPreviousClick}/>
                </Form>
            )}
        </Formik>
    );
};
export default Step3;
