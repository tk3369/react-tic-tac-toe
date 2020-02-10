import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {

  render() {
    return (
      <button 
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  // Memento pattern
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      currentIndex: 0,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.currentIndex+1);
    const current = history[this.state.currentIndex];
    const squares = current.squares.slice(); // create copy!
    if (calculateWinner(squares) != null || squares[i] != null) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      currentIndex: this.state.currentIndex + 1,
    });
  }

  jumpTo(i) {
    const newState = {
      history: this.state.history,
      xIsNext: i % 2 === 0,
      currentIndex: i,
    }
    this.setState(newState);
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.currentIndex];
    const winner = calculateWinner(current.squares);

    const moves = history.map((squares, i) => {
      const desc = i > 0 ? 
        'Go to move #' + i :
        'Go to game start';
      return (
        <li key={'move' + i}>
          <button onClick={() => this.jumpTo(i)}>{desc}</button>
        </li>
      )
    });

    const status = winner ? 
      ('Winner: ' + winner) : 
      ('Next Player: ' + (this.state.xIsNext ? 'X' : 'O'));

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares} 
            onClick={(i) => this.handleClick(i)} 
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// ========================================

function calculateWinner(squares) {

  // winning patterns
  const patterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // find the first element that matches a winning pattern
  const element = patterns.find(x => 
    squares[x[0]] === squares[x[1]] && 
    squares[x[1]] === squares[x[2]] && 
    squares[x[0]] !== null)

  // if winner is found, return 'X' or 'O'
  return element !== undefined ? squares[element[0]] : null;
}