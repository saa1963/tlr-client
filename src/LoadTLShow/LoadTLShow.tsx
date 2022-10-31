/* eslint-disable react-hooks/exhaustive-deps */
import * as bootstrap from "bootstrap";
import React, { ChangeEvent, forwardRef, useImperativeHandle, useState } from "react";
import { ApiClient } from "../ApiClient";

function LoadTLShow(props: any, ref: any): any {
    const [selected, setSelected] = useState<string>('');
    const [errtext, setErrText] = useState('');
    const [list, setList] = useState<string[]>([]);

    useImperativeHandle(ref, () => {
        return {
            openModal: () => {
                const myModalEl = document.getElementById('tmLoadModal');
                const m = bootstrap.Modal.getOrCreateInstance(myModalEl!);
                setSelected('');
                setErrText('');
                ApiClient.getInstance().GetUsersList()
                    .then((value: string[]) => {
                        if (value.length > 0) {
                            setSelected(value[0]);
                            setList(value);
                        }
                    });
                m?.show();
            },
            closeModal: () => {
                const myModalEl = document.getElementById('tmLoadModal');
                const m = bootstrap.Modal.getOrCreateInstance(myModalEl!);
                m.hide();
            }
        }
    });
    return (
        <div id="tmLoadModal" className="modal" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Загрузить</h5>
                        <button type="button" className="close closeloginmodal" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="listTL">Имя пользователя</label>
                            <select id="listTL" onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelected(e.target.value)}>
                                {list.map((name, idx) => {
                                    return <option key={idx} value={name}>{name}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <div id="log_server_error" className="alert alert-danger" role="alert"
                        style={errtext === '' ? { display: 'none' } : { display: 'unset' }}>
                        {errtext}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                            onClick={() => { props.onSubmit(selected); }}>OK</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default forwardRef(LoadTLShow);