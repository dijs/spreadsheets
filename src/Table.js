import React from 'react';
import classes from 'classnames';
import Cell from './Cell';
import { toId, toRow, getFormulas, isExpression } from './utils';

function renderFormulas(text) {
  const list = getFormulas(text);
  if (list.length) {
    return list.map(name => <p key={name}>{name}</p>)
  }
  return null;
}

export default function Table(props) {
  const { data, width, height, handleClear, addColumn, addRow, active, move, selected } = props;
  const rows = [];
  const activeId = toId(active);
  rows.push(
    <tr key="row0">
      <th onClick={handleClear}>↻</th>
      {
        Array(width).fill(0).map((v, x) => <th key={'col' + x}>{toRow(x)}</th>)
      }
      <th onClick={addColumn}>+</th>
    </tr>
  );
  for (let y = 1; y <= height; y++) {
    rows.push(
      <tr key={'row' + y}>
        <td className="row-label">{y}</td>
        {
          Array(width)
            .fill(0)
            .map((v, x) => {
              const id = toRow(x) + y;
              const active = activeId === id;
              const text = data[activeId];
              const filtering = active && isExpression(data[activeId]) && getFormulas(text).length;
              const classNames = {
                cell: true,
                filtering,
                active,
                selected: selected.includes(id),
              };
              const filter = filtering
                ? <div className="filter">
                  <div className="filter-inner">
                    {renderFormulas(text)}
                  </div>
                </div>
                : null;
              return <td key={id} className={classes(classNames)}>
                {filter}
                <Cell coords={{ x, y }} {...props} />
              </td>;
            })
        }
      </tr>
    );
  }
  return (
    <table onKeyUp={e => {
      switch (e.which) {
        case 40: return move(0, 1);
        case 38: return move(0, -1);
        case 37: return move(-1, 0);
        case 39: return move(1, 0);
        default: return;
      }
    }}>
      <tbody>
        {rows}
        <tr>
          <td className="row-label" onClick={addRow}>+</td>
        </tr>
      </tbody>
    </table>
  );
}