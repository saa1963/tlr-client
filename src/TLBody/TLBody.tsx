import { observer } from 'mobx-react-lite';
import React from 'react';
import { TLPeriod } from '../lib/TLPeriod';
import './TLBody.css'

const TLBody = observer(({ tl, mainLineCount }: { tl: TLPeriod, mainLineCount: number }) => {

  let tdClass = '';
  if (tl.Parent === null) {
    tdClass = 'tl_head';
  } else {
    tdClass = 'tl_head_sub';
  }
  return (
    <tr>
      <td className={tdClass} colSpan={mainLineCount - 1}
        >{tl.Name}</td>
    </tr>
  );
});

export default TLBody;