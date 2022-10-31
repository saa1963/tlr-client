/* eslint-disable react-hooks/exhaustive-deps */
import * as bootstrap from "bootstrap";
import { forwardRef, useImperativeHandle } from "react";

function MessageBox(props: any, ref: any): any {
    useImperativeHandle(ref, () => {
        return {
            openModal: (text: string) => {
                const myModalEl = document.getElementById('tmMessageBoxModal');
                const m = bootstrap.Modal.getOrCreateInstance(myModalEl!);
                const body = document.getElementById('modalbody');
                body!.textContent = text;
                m?.show();
            },
        }
    });
    return (
        <div id="tmMessageBoxModal" className="modal" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        {/* <h5 className="modal-title">Загрузить</h5> */}
                        <button type="button" className="close closeloginmodal" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div id="modalbody" className="modal-body">
                        111
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">OK</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default forwardRef(MessageBox);