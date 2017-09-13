import safeEval from 'notevil';
import * as excelFunctions from '@quantlab/formulajs';

export function toRow(n) {
  return String.fromCharCode('A'.charCodeAt(0) + n);
}

const formulaNames = Object.keys(excelFunctions);

export const getFormulas = text => formulaNames.filter(name => name.includes(text.replace(/^=/, '').toUpperCase()));

export function toId(coords) {
  if (!coords) {
    return undefined;
  }
  return toRow(coords.x) + coords.y;
}

export function getValue(expression, context) {
  if (!expression) {
    return '';
  }
  try {
    return safeEval(expression.replace(/^=/, ''), Object.assign({}, context, excelFunctions));
  } catch (e) {
    return expression;
  }
}

export const isExpression = v => !!(v || '').toString().match(/^=/);

export function parseInput(value) {
  const n = parseFloat(value, 10);
  if (isNaN(n)) {
    return value;
  }
  return n;
}