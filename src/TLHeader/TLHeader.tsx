import { observer } from 'mobx-react-lite';
import { TLPeriod } from '../lib/TLPeriod';
import './TLHeader.css'

const TLHeader = observer(({tl, mainLineCount}: {tl: TLPeriod, mainLineCount: number}) => {
  let tdClass = '';
  if (tl.Parent === null) {
    tdClass = 'tl_head';
  } else {
    tdClass = 'tl_head_sub';
  }
  return (
    <tr>
      <td className={tdClass} colSpan={mainLineCount - 1}>{tl.Name}</td>
    </tr>
  );
});

export default TLHeader;