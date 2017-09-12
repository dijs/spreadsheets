import React from 'react';
import safeEval from 'notevil';
import classes from 'classnames';

function toRow(n) {
  return String.fromCharCode('A'.charCodeAt(0) + n);
}

function getValue(expression, context) {
  if (!expression) {
    return '';
  }
  try {
    return safeEval(expression.replace(/^=/, ''), context);
  } catch (e) {
    return expression;
  }
}

const isExpression = v => !!(v || '').toString().match(/^=/);

function parseInput(value) {
  const n = parseFloat(value, 10);
  if (isNaN(n)) {
    return value;
  }
  return n;
}

// TODO: Move into own file
function Cell({ id, data, editing, handleChange, handleFocus, handleBlur }) {
  const editingExpression = isExpression(data[editing]);
  return <input
    type="text"
    className={classes('cell', { editing: editing === id })}
    onChange={e => handleChange(id, parseInput(e.target.value))}
    onKeyUp={e => {
      if (e.which === 13) {
        handleBlur();
        e.target.blur();
      }
    }}
    onClick={e => {
      // If editing expression and not clicking itself
      if (editingExpression && editing !== id) {
        e.preventDefault();
        console.log('Adding reference to current expression', editing, id);
        handleChange(editing, data[editing] + id);
      } else {
        handleFocus(id);
      }
      return false;
    }}
    value={editing === id ? data[id] : getValue(data[id], data)}
  />;
}

export default function Table(props) {
  const { width, height, handleClear, addColumn, addRow } = props;
  const rows = [];
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
            .map((v, x) => toRow(x) + y)
            .map(id => {
              return <td key={id}>
                <Cell id={id} {...props} />
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
        <tr>
          <td className="row-label" onClick={addRow}>+</td>
        </tr>
      </tbody>
    </table>
  );
}