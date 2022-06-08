import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Collapse, Button } from 'reactstrap'

const InheritanceCollapse = () => {
    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen(!isOpen)

    return (
        <div>
            <Collapse isOpen={isOpen}>
                <div className="row inheritance-faq">
                    <a href="#" className="col-md-3 margin-bottom-10px" data-toggle="modal" data-target="#faqModal" data-q="q5">
                        <div className="card-col3 d-flex align-items-center justify-content-center">
                            <div className="card-col3-text">Сколько продлится процедура?</div>
                        </div>
                    </a>
                    <a href="#" className="col-md-3 margin-bottom-10px" data-toggle="modal" data-target="#faqModal" data-q="q6">
                        <div className="card-col3 d-flex align-items-center justify-content-center">
                            <div className="card-col3-text">Что важно знать?</div>
                        </div>
                    </a>
                </div>
            </Collapse>
            <Button outline color="" className="text-primary inheritance-hide-btn" onClick={toggle}>
                {isOpen ? "Скрыть" : " Другие вопросы"}
                <svg className={isOpen ? "divisibles-description-arrow" : ""} width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.09 17.3004L13.67 12.7104L9.09 8.12045L10.5 6.71045L16.5 12.7104L10.5 18.7104L9.09 17.3004Z" fill="#1C4FD1"/>
                </svg>
            </Button>
        </div>
    )
}

const elem = document.querySelector('.inheritance-collapse')

if (elem) {
    ReactDOM.render(<InheritanceCollapse />, elem)
}
