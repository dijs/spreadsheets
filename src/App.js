import React, { Component } from 'react';
import Table from './Table';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      editing: undefined,
      width: 5,
      height: 10,
    };
  }
  handleChange(id, value) {
    this.setState({
      data: Object.assign({}, this.state.data, { [id]: value }),
    });
  }
  render() {
    return <Table
      width={this.state.width}
      height={this.state.height}
      editing={this.state.editing}
      handleChange={this.handleChange.bind(this)}
      handleFocus={id => this.setState({ editing: id })}
      handleBlur={() => this.setState({ editing: undefined })}
      handleClear={() => this.setState({ data: {}, editing: undefined })}
      addColumn={() => this.setState({ width: this.state.width + 1 })}
      addRow={() => this.setState({ height: this.state.height + 1 })}
      data={this.state.data}
    />;
  }
}

export default App;
