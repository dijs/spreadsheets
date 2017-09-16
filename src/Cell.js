import React, { Component } from 'react';
import { toId, isExpression, parseInput, getValue } from './utils';

export default class Cell extends Component {
  componentDidUpdate(props) {
    const id = toId(this.props.coords);
    const isActive = toId(this.props.active) === toId(this.props.coords);
    if (isActive) {
      this.refs[id].focus();
    }
  }
  render() {
    const { coords, data, active, selected, handleChange, handleFocus, handleBlur, handleSelect, move } = this.props;
    const id = toId(coords);
    const activeId = toId(active);
    const editingExpression = isExpression(data[activeId]);
    const isActive = activeId === id;
    const expressionString = (data[activeId] || '') + (selected[0] || '');
    return <input
      type="text"
      ref={id}
      onChange={e => handleChange(id, parseInput(e.target.value))}
      onKeyUp={e => {
        if (e.which === 13) {
          handleChange(activeId, expressionString);
          handleBlur();
          e.target.blur();
          move(0, 1);
        }
      }}
      onClick={e => {
        // If editing expression and not clicking itself
        if (editingExpression && !isActive) {
          e.preventDefault();
          handleSelect(id);
          // handleChange(activeId, data[activeId] + id);
        } else {
          handleFocus(coords);
        }
        return false;
      }}
      value={isActive ? expressionString : getValue(data[id], data)}
    />;
  }
}
