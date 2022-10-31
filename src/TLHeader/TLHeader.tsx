import { observer } from 'mobx-react-lite';
import { TLPeriod } from '../lib/TLPeriod';
import './TLHeader.css';
import * as NSEventPeriod from '../lib/EventPeriod';
import { InterfaceExTLPeriod, TLHeaderUtils } from './TLHeaderUtils';
import React, { useState } from 'react';
import { EnumPeriod } from '../lib/EnumPeriod';

const TLHeader = (
  { tl, mainLine, period, idx }:
    { tl: TLPeriod, mainLine: NSEventPeriod.Event[], period: EnumPeriod, idx: number }) => {

  const OnDragEnter = (ev: React.DragEvent<HTMLTableCellElement>) => {
    ev.preventDefault();
    ev.currentTarget.classList.add('period_cell_drop');
  }

  const OnDragLeave = (ev: React.DragEvent<HTMLTableCellElement>) => {
    ev.currentTarget.classList.remove('period_cell_drop');
  }

  const OnDragOver = (ev: React.DragEvent<HTMLTableCellElement>) => {
    ev.preventDefault();
  }

  const OnDrop = (ev: React.DragEvent<HTMLTableCellElement>) => {
    const data = ev.dataTransfer.getData('application/json');
    const tl0 = TLPeriod.CreateTLPeriod(JSON.parse(data));
    tl.Add(tl0);
    ev.preventDefault();
  }



  const head = observer(({ tl, mainLine }: { tl: TLPeriod, mainLine: NSEventPeriod.Event[] }) => {
    let tdClass = '';
    if (tl.Parent === null) {
      tdClass = 'tl_head';
    } else {
      tdClass = 'tl_head_sub';
    }
    return (<tr>
      <td className={tdClass} colSpan={mainLine.length + 1} onDragEnter={OnDragEnter}
        onDragLeave={OnDragLeave} onDragOver={OnDragOver} onDrop={OnDrop}>{tl.Name}
      </td>
      <td id="ddownTL">
        <button className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          {'>>'}
        </button>
        <ul className="dropdown-menu">
          <li><button className="dropdown-item" onClick={(e) => { }}>Добавить</button></li>
          <li><button className="dropdown-item" onClick={(e) => { }}>Сохранить</button></li>
          <li><button className="dropdown-item" onClick={(e) => { }}>В файл</button></li>
          <li><button className="dropdown-item" onClick={(e) => { }}>Показать все</button></li>
          <li><button className="dropdown-item" onClick={(e) => { }}>Закрыть</button></li>
        </ul>
      </td>
    </tr>)
  }
  );

  const body =
    ({ tl, mainLine, period, idx }:
      { tl: TLPeriod, mainLine: NSEventPeriod.Event[], period: EnumPeriod, idx: number }) => {
      const shelfs = TLHeaderUtils.DrawTL(tl, mainLine, period);
      return shelfs.map((items, shelfNumber) => {
        return <Shelf items={items} shelfNumber={shelfNumber} idx={idx}></Shelf>
      });
    };

  /**
   * 
   * @param items элементы на "полке"
   * @param shelfNumber индекс полки
   * @param idx индекс TimeLine
   * @returns 
   */
  const Shelf = ({ items, shelfNumber, idx }: { items: InterfaceExTLPeriod[], shelfNumber: number, idx: number }) => {
    let last: number = -1;
    return (
      <tr className={'row-data-' + idx}>
        <td></td>
        { 
          items.map((item, i) => {
            const shelfItem = <ShelfItem itemTLPeriod={item} last={last} idx={idx}></ShelfItem>;
            last = item.ir;
            return shelfItem;
          })
        }
        <td></td>
      </tr>
    )
  }

  const ShelfItem = ({ itemTLPeriod, last, idx }:
    { itemTLPeriod: InterfaceExTLPeriod, last: number, idx: number }) => {
    const Id = itemTLPeriod.item.Id;
    return (
      <td>
        {(itemTLPeriod.il - last !== 1) &&
          <td className='hidden_cell' colSpan={itemTLPeriod.il - last - 1}></td>
        }
        <td id={'cell-' + idx + '-' + Id} draggable colSpan={itemTLPeriod.ir - itemTLPeriod.il + 1} className="period_cell">
          
        </td>
      </td>
    )
  }
  // const body = shelfs.map((items, idx) => {
  //   let Id: number = items[idx].item.Id;
  //   <tr className={'row-data-' + idx}>
  //     <td></td>

  //     <td></td>
  //   </tr>
  // });

  return [head, body];
};

export default TLHeader;