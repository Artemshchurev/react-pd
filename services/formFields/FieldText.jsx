import React, {useState} from "react";
import PropTypes from "prop-types";
import {Field} from "formik";
import {Button, FormGroup, FormText, Label, Modal, ModalBody, ModalFooter} from "reactstrap";

const FieldText = props => {
    const id = props.id ?? props.name;

    const formProps = {
        placeholder: props.placeholder,
        name: props.name,
        readOnly: props.readOnly,
        value: props.value
    };

    const [modalText, setModalText] = useState(false);
    const [modalShown, setModalShown] = useState(false);

    const showModal = (text) => {
        setModalText(text);
        setModalShown(true);
    };

    return (
        <FormGroup className="form-label-group">
            <Field
                type="text"
                className={`form-control form-control-lg ${
                    props.error && props.touched ? "is-invalid" : ""
                }`}
                {...formProps}
                id={id}
            />
            <Label htmlFor={id}>
                <span>{props.placeholder}</span>
            </Label>
            {props.hint && (
                <FormText color="muted">
                    {props.hint} {props.modalQuestion && (
                        <button style={{marginLeft: '5px'}} type="button" className="btn btn-link p-0 btn-sm"
                            onClick={() => showModal(props.modalQuestion)}
                        ><i className="far fa-question-circle fa-lg" style={{fontSize: "unset"}} /></button>
                    )}
                </FormText>
            )}
            {props.secondHint && <FormText color="muted">{props.secondHint}</FormText>}
            <div className="invalid-feedback">
                {props.touched && props.error}
            </div>
            <Modal isOpen={modalShown} toggle={() => setModalShown(!modalShown)}>
                <ModalBody>{modalText}</ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setModalShown(!modalShown)}>
                        Закрыть
                    </Button>
                </ModalFooter>
            </Modal>
        </FormGroup>
    );
};

FieldText.propTypes = {
    placeholder: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.string,
    readOnly: PropTypes.bool,

    touched: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    hint: PropTypes.string,
    secondHint: PropTypes.string,
    modalQuestion: PropTypes.element,

    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

FieldText.defaultProps = {
    readOnly: false
};

export default FieldText;
