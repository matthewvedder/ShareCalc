import '../assets/stylesheets/base.scss';
import React from 'react';
import update from 'react-addons-update';
import math from 'mathjs';
import io from 'socket.io-client'
const socket = io(process.env.PORT)


const App = React.createClass({
  getInitialState: function() {
    return ({
      operations: [],
      calculations: []
    });
  },
  componentDidMount() {
    socket.on('calculation', (calculation) => {
      this.setState({ calculations: [...this.state.calculations, calculation] })
      console.log(this.state.calculations)
    })
  },
  mapList(array) {
    return (
      array.map((message, i) => {
        return <p key={i}>{message}</p>
      })
    )
  },
  calculateOperations: function() {
    const operation = this.state.operations.join('');

    if (operation) {
      const result = String(math.eval(operation));
      this.setState({ operations : [result] });
      socket.emit('calculation', `${operation} = ${result}`)
    }
  },
  handleClick: function(e) {
    let value = e.target.getAttribute('data-value');
    switch (value) {
      case 'clear':
        this.setState({ operations: [] });
        break;
      case 'equal':
        this.calculateOperations();
        break;
      default:
        let newOperations = update(this.state.operations, { $push: [value] });
        this.setState({ operations: newOperations });
        break;
    }
  },
  render: function() {
    return (
      <div>
        <div className="App">
          <Display data={this.state.operations} />
          <Buttons>
            <Button onClick={this.handleClick} label="C" value="clear" />
            <Button onClick={this.handleClick} label="7" value="7" />
            <Button onClick={this.handleClick} label="4" value="4" />
            <Button onClick={this.handleClick} label="1" value="1" />
            <Button onClick={this.handleClick} label="0" value="0" />

            <Button onClick={this.handleClick} label="/" value="/" />
            <Button onClick={this.handleClick} label="8" value="8" />
            <Button onClick={this.handleClick} label="5" value="5" />
            <Button onClick={this.handleClick} label="2" value="2" />
            <Button onClick={this.handleClick} label="." value="." />

            <Button onClick={this.handleClick} label="x" value="*" />
            <Button onClick={this.handleClick} label="9" value="9" />
            <Button onClick={this.handleClick} label="6" value="6" />
            <Button onClick={this.handleClick} label="3" value="3" />
            <Button label="" value="null" />

            <Button onClick={this.handleClick} label="-" value="-" />
            <Button onClick={this.handleClick} label="+" size="2" value="+" />
            <Button onClick={this.handleClick} label="=" size="2" value="equal" />
          </Buttons>
        </div>
      <Calculations mapList={this.mapList} calculations={this.state.calculations} />
    </div>
    );
  }
});

function Display (props) {
  let string = props.data.join('');
  return (
    <div className="Display">
     {string}
    </div>
  );
}

function Buttons (props) {
  return (
    <div className="Buttons">
      {props.children}
    </div>
  )
}

function Button (props) {
  return (
    <div onClick={props.onClick} className="Button" data-size={props.size} data-value={props.value}>
      {props.label}
    </div>
  )
}

function Calculations ({ mapList, calculations }) {
  return (
    <ul>
      { mapList(calculations) }
    </ul>
  )
}

module.exports = App;
