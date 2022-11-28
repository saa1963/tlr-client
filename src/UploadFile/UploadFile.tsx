import * as bootstrap from "bootstrap";
import { ChangeEvent, forwardRef, useImperativeHandle, useState } from "react"

function UploadFile({ OnSubmit }: { OnSubmit: (file: Nullable<File>) => void }, ref: any) {
    const [filePath, setFilePath] = useState('')
    const [file, setFile] = useState(null as Nullable<File>)

    useImperativeHandle(ref, () => {
        return {
            openModal: () => {
                const myModalEl = document.getElementById('tmUploadFile');
                const m = bootstrap.Modal.getOrCreateInstance(myModalEl!);
                m?.show();
            },
        }
    });

    function OnChange(e: ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (files && files.length > 0) setFile(files[0]);
        setFilePath(e.target.value);
    }

    return (
        <div id="tmUploadFile" className="modal" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Загрузить файл</h5>
                        <button type="button" className="close closenamemodal" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <input className="form-control" type="file" value={filePath} placeholder="Имя файла" required
                            onChange={OnChange} />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary"
                            data-bs-dismiss="modal">Закрыть</button>
                        <button type="button" className="btn btn-primary"
                            data-bs-dismiss="modal"
                            onClick={(e) => OnSubmit(file)}>Загрузить</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default forwardRef(UploadFile)