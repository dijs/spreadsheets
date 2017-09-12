import React from 'react';

function toRow(n) {
  return String.fromCharCode('A'.charCodeAt(0) + n);
}

export default function Table({ width, height, handleChange, data }) {
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
            const value = data[id] || 0;
            return <td key={id}>
              <input type="text" className="cell" onChange={e => handleChange(id, e.target.value)} value={value || ''} />
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