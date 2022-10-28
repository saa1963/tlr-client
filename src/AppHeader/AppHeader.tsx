/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext } from 'react';
import { AuthContext } from '../Contexts';
import DateLine from '../DateLine/DateLine';
import { publish } from '../lib/events';
import LoginShow from '../LoginShow/LoginShow';

const MyComponents = {
    Logon: (props: any) => {
        const [, setAuthContext]: any = useContext(AuthContext);
        if (props.user) {
            return <><button type="button" className="btn btn-link"
                onClick={(e) => {
                    localStorage.removeItem('tokenTL');
                    localStorage.removeItem('userTL');
                    setAuthContext({})
                }}>Выход</button>
            </>
        } else {
            return <><button type="button" className="btn btn-link" data-bs-toggle="modal"
                data-bs-target="#tmLoginModal">Вход</button>
                <LoginShow onLogon={(contextValue: any) => {
                    localStorage.setItem('tokenTL', contextValue.jwtToken);
                    localStorage.setItem('userTL', contextValue.user);
                    setAuthContext(contextValue);
                }} />
            </>
        }
    }
}

function AppHeader(props: any) {
    const [authContext]: any = useContext(AuthContext);
    return (
        <div id="appheader">
            <nav className="navbar navbar-expand-lg bg-light">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav align-items-center">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Линии времени
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a type="button" className="dropdown-item" onClick={(e) => publish('createTL')}>Создать</a></li>
                                    <li><a type="button" className="dropdown-item" onClick={(e) => publish('loadTL')}>Загрузить</a></li>
                                    <li><a type="button" className="dropdown-item" onClick={(e) => publish('loadfromfileTL')}>Загрузить из файла</a></li>
                                </ul>
                            </li>
                            <li className="nav-item ms-2">
                                <MyComponents.Logon user={authContext.user} />
                            </li>
                            <li className="nav-item ms-2">
                                <div className="d-inline-flex p-2">{authContext.user}</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <DateLine />
        </div>
    )
}

export default AppHeader;
