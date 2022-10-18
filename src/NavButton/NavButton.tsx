import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, MouseEventHandler } from 'react';
import './NavButton.css'

function NavButton(props: {
    onClick: MouseEventHandler<HTMLButtonElement> | undefined; children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; 
}) {
    return (
        <button className='nbutton' onClick={props.onClick}>
            {props.children}
        </button>
    );
  }
  
  export default NavButton;