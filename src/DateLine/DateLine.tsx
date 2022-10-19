import './DateLine.css'
import ZoomIn from './icons8-zoom-in-50.png';
import ZoomOut from './icons8-zoom-out-50.png';

function DateLine(props: any) {
    return (
        <table id="MainTable">
            <tr className="date">
                {props.dates[0].map((a: string, idx: number) => {
                    return (
                        <td className="date_cell" id={idx.toString()} onDoubleClick={(e) => {props.OnShowSlice(props.dates[1][idx])}}>
                            <div className='d-flex justify-content-between'>
                                <button className='btn border-0 m-0 p-0' onClick={() => {props.onScaleBack(idx)}}>
                                    <img src={ZoomOut} alt="ZoomOut" width="20" height="20" />
                                </button>
                                {a}
                                <button className='btn border-0 m-0 p-0' onClick={() => {props.onScaleForward(idx)}}>
                                    <img src={ZoomIn} alt="ZoomIn" width="20" height="20" />
                                </button>
                            </div>
                        </td>
                    );
                })}
            </tr>
            {props.children}
        </table>
    );
}

export default DateLine;