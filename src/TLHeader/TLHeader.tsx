import { TLPeriod } from '../lib/TLPeriod';
import './TLHeader.css';
import * as NSEventPeriod from '../lib/EventPeriod';
import { InterfaceExTLPeriod, TLHeaderUtils } from './TLHeaderUtils';
import React from 'react';
import { EnumPeriod } from '../lib/EnumPeriod';
import { ApiClient } from '../ApiClient';

const TLHeader = (
  { tl, mainLine, period, idx, addTL, removeTLHandler, forceRenderDateLine, 
    contextMenuHandler, showMsgBox, showAll }:
    {
      tl: TLPeriod, mainLine: NSEventPeriod.Event[], period: EnumPeriod, idx: number,
      addTL: (idx: number) => void,
      removeTLHandler: (idx: number) => void,
      forceRenderDateLine: () => void,
      contextMenuHandler: (ev: React.MouseEvent<HTMLTableCellElement, MouseEvent>, idx: number, id: number) => void,
      showMsgBox: (msg: string) => void,
      showAll: (idx: number) => void
    }) => {

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

  const OnDropHeader = (ev: React.DragEvent<HTMLTableCellElement>) => {
    const data = ev.dataTransfer.getData('application/json');
    const tl0 = TLPeriod.CreateTLPeriod(JSON.parse(data));
    tl.Add(tl0);
    ev.preventDefault();
  }

  const OnDrop = (ev: React.DragEvent<HTMLTableCellElement>, id: number) => {
    const data = ev.dataTransfer.getData('application/json');
    const tlSource = TLPeriod.CreateTLPeriod(JSON.parse(data));
    const [tlTarget] = tl.find(id);
    tlTarget?.Add(tlSource);
    ev.preventDefault();
  }

  const OnDragStart = (ev: React.DragEvent<HTMLTableCellElement>, id: number) => {
    const [period] = tl.find(id);
    if (period) {
      ev.dataTransfer.setData('application/json', JSON.stringify(period));
      ev.dataTransfer.dropEffect = 'copy';
    }
  }

  function AddTL() {
    addTL(idx);
  }

  function CloseTL() {
    removeTLHandler(idx);
  }

  async function SaveTL() {
    try {
      const r = await ApiClient.getInstance().SaveTL(tl);
      if (!r) showMsgBox('Данные сохранены.');
      else showMsgBox(r);
    } catch (err) {
      if (err instanceof Error)
        showMsgBox((err as Error).message);
      else if (err instanceof String)
        showMsgBox(err as string);
      else
        showMsgBox('Ошибка при записи.');
    }
  }

  function download(data: string, filename: string, type: string) {
    const file = new Blob([data], { type: type });
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

  function SaveTLToFile() {
    try {
      download(JSON.stringify(tl), 'tl.json', 'application/json');
      //showMsgBox('Данные сохранены.');
    } catch (err) {
      if (err instanceof Error)
        showMsgBox((err as Error).message);
      else if (err instanceof String)
        showMsgBox(err as string);
      else
        showMsgBox('Ошибка при записи.');
    }
  }

  function ShowAll(e: any) {
    showAll(idx);
  }

  const head = ({ tl, mainLine }: { tl: TLPeriod, mainLine: NSEventPeriod.Event[] }) => {
    let tdClass = '';
    if (tl.Parent === null) {
      tdClass = 'tl_head';
    } else {
      tdClass = 'tl_head_sub';
    }
    return (<tr key={-1}>
      <td className={tdClass} colSpan={mainLine.length + 1} onDragEnter={OnDragEnter}
        onDragLeave={OnDragLeave} onDragOver={OnDragOver} onDrop={OnDropHeader}>{tl.Name}
      </td>
      <td id="ddownTL">
        <button className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          {'>>'}
        </button>
        <ul className="dropdown-menu">
          <li><button className="dropdown-item" onClick={AddTL}>Добавить</button></li>
          <li><button className="dropdown-item" onClick={SaveTL}>Сохранить</button></li>
          <li><button className="dropdown-item" onClick={SaveTLToFile}>В файл</button></li>
          <li><button className="dropdown-item" onClick={ShowAll}>Показать все</button></li>
          <li><button className="dropdown-item" onClick={CloseTL}>Закрыть</button></li>
        </ul>
      </td>
    </tr>)
  };


  const body =
    ({ tl, mainLine, period, idx }:
      { tl: TLPeriod, mainLine: NSEventPeriod.Event[], period: EnumPeriod, idx: number }) => {
      const shelfs = TLHeaderUtils.DrawTL(tl, mainLine, period);
      return shelfs.map((items, shelfNumber) => {
        return <Shelf key={shelfNumber} items={items} shelfNumber={shelfNumber} idx={idx}></Shelf>
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
            const shelfItem = <ShelfItem key={i} itemTLPeriod={item} last={last} idx={idx}></ShelfItem>;
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
    const period_cell_class: string[] = ['period_cell'];
    if (itemTLPeriod.item.Count > 0) {
      period_cell_class.push('note');
    }
    const period_cell = <td id={'cell-' + idx + '-' + Id} draggable colSpan={itemTLPeriod.ir - itemTLPeriod.il + 1}
      className={period_cell_class.join(' ')} onDragStart={(e) => OnDragStart(e, Id)} onDragEnter={OnDragEnter}
      onDragLeave={OnDragLeave} onDragOver={OnDragOver} onDrop={(e) => OnDrop(e, Id)}
      onContextMenu={(e) => contextMenuHandler(e, idx, Id)}>
      {itemTLPeriod.item.Name}
    </td>
    let rt: JSX.Element;
    let hidden_cell: JSX.Element;
    if (itemTLPeriod.il - last !== 1) {
      hidden_cell = <td className='hidden_cell' colSpan={itemTLPeriod.il - last - 1}></td>;
      rt = <>{hidden_cell}{period_cell}</>;
    } else {
      rt = <>{period_cell}</>
    }
    return rt;
  }

  return <>{[head({ tl, mainLine }), ...body({ tl, mainLine, period, idx })]}</>;
};

export default TLHeader;