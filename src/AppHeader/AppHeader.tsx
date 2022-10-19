/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext } from 'react';
import { AuthContext } from '../Contexts';
import LoginShow from '../LoginShow/LoginShow';
import NavButton from '../NavButton/NavButton';

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
        <div>
            <nav className="navbar navbar-expand-lg bg-light">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav align-items-center">
                            <ul className="navbar-nav">
                                <li className="nav-item me-1">
                                    <NavButton onClick={props.onPrevPage}>&lt;&lt;</NavButton>
                                </li>
                                <li className="nav-item me-1">
                                    <NavButton onClick={props.onPrevPeriod}>&lt;</NavButton>
                                </li>
                                <li className="nav-item me-1">
                                    <NavButton onClick={props.onNextPeriod}>&gt;</NavButton>
                                </li>
                                <li className="nav-item">
                                    <NavButton onClick={props.onNextPage}>&gt;&gt;</NavButton>
                                </li>
                            </ul>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Линии времени
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Создать</a></li>
                                    <li><a className="dropdown-item" href="#">Загрузить</a></li>
                                    <li><a className="dropdown-item" href="#">Загрузить из файла</a></li>
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
            {props.children}
        </div>
    )
}

export default AppHeader;
