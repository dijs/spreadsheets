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
    const { coords, data, active, handleChange, handleFocus, handleBlur, move } = this.props;
    const id = toId(coords);
    const editingExpression = isExpression(data[active]);
    const isActive = toId(active) === id;
    return <input
      type="text"
      ref={id}
      onChange={e => handleChange(id, parseInput(e.target.value))}
      onKeyUp={e => {
        if (e.which === 13) {
          handleBlur();
          e.target.blur();
          move(0, 1);
        }
      }}
      onClick={e => {
        // If editing expression and not clicking itself
        if (editingExpression && !isActive) {
          e.preventDefault();
          handleChange(id, data[active] + id);
        } else {
          handleFocus(coords);
        }
        return false;
      }}
      value={isActive ? data[id] : getValue(data[id], data)}
    />;
  }
}
