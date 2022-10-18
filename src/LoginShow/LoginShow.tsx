import * as bootstrap from "bootstrap";
import React, { useEffect, useState } from "react";
import { ApiClient } from "../ApiClient";

function LoginShow(props: any): JSX.Element {
    const [user, setUser] = useState({user: '', pass: ''});
    const [errtext, setErrText] = useState('');
    const [myModal, setModal] = useState(null as (bootstrap.Modal | null));

    // запускается 1 раз после 1-го рендера
    useEffect(() => {
        // ссылка на DOM элемент <div class="modal">
        const myModalEl = document.getElementById('tmLoginModal');
        // навесить обработчик события на DOM элемент show.bs.modal
        myModalEl!.addEventListener('show.bs.modal', event => {
            setUser({user: '', pass: ''});
            setErrText('');
        });
        // получить или создать объект Modal ассоциированный с DOM элементом
        const m = bootstrap.Modal.getOrCreateInstance(myModalEl!);
        setModal(m);
        
    }, [myModal]);

    const DoLocalAuthenticate = async (user: string, pass: string) => {
        try {
            // save access token to localstorage tokenTL
            const jwt = await ApiClient.getInstance().DoLogin(user, pass);
            // меняем контекст
            setErrText('');
            myModal?.hide();
            //const jwt = localStorage.getItem('tokenTL')!;
            props.onLogon(jwt);
        } catch(err: any) {
            setErrText(err.message);
            console.log(err);
        }
    }

    return (
    <div id="tmLoginModal" className="modal" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Вход</h5>
                    <button type="button" className="close closeloginmodal" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="logLogin">Имя пользователя</label>
                        <input className="form-control" id="logLogin" type="text" value={user.user} 
                            onChange={(e) => {setUser({...user, user: e.target.value})}} 
                            placeholder="Введите имя пользователя" required pattern="\w+" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="logPassword">Пароль</label>
                        <input className="form-control" id="logPassword" type="password" value={user.pass} 
                            onChange={(e) => {setUser({...user, pass: e.target.value})}} 
                            placeholder="Введите пароль" required />
                    </div>
                </div>
                <div id="log_server_error" className="alert alert-danger" role="alert" 
                    style={errtext === '' ? {display: 'none'} : {display: 'unset'}}>
                    {errtext}
                </div>
                <div className="modal-footer">
                    <button id="btnCancelLoginUser" type="button" className="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                    <button id="btnLoginUser" type="button" className="btn btn-primary" 
                        onClick={()=>DoLocalAuthenticate(user.user, user.pass)}>Вход</button>
                </div>
            </div>
        </div>
    </div>
    )
}

export default LoginShow;