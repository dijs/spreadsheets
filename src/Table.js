import React from 'react';
import safeEval from 'notevil';

function toRow(n) {
  return String.fromCharCode('A'.charCodeAt(0) + n);
}

function getValue(expression, context) {
  try {
    return safeEval(expression.replace(/^=/, ''), context);
  } catch (e) {
    return expression;
  }
}

function parseInput(value) {
  const n = parseFloat(value, 10);
  if (isNaN(n)) {
    return value;
  }
  return n;
}

function Cell({ id, data, editing, handleChange, handleFocus, handleBlur }) {
  return <input
    type="text"
    className="cell"
    onFocus={() => handleFocus(id)}
    onBlur={handleBlur}
    onChange={e => handleChange(id, parseInput(e.target.value))}
    value={editing ? data[id] : getValue(data[id], data)}
  />;
}

export default function Table({ width, height, handleChange, data, editing, handleFocus, handleBlur }) {
  const rows = [];
  rows.push(
    <tr key="row0">
      <th/>
      {
        Array(width).fill(0).map((v, x) => <th key={'col' + x}>{toRow(x)}</th>)
      }
    </tr>
  );
  for (let y = 1; y <= height; y++) {
    rows.push(
      <tr key={'row' + y}>
        <td className="row-label">{y}</td>
        {
          Array(width).fill(0).map((v, x) => {
            const id = toRow(x) + y;
            return <td key={id}>
              <Cell
                id={id}
                data={data}
                editing={editing === id}
                handleChange={handleChange}
                handleFocus={handleFocus}
                handleBlur={handleBlur}
              />
            </td>;
          })
        }
      </tr>
    );
  }
  return (
    <table>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}