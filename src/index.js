import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
          {props.value}
      </button>
    );
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
        let columns = [];
        for(let y = 0; y < 3; y++){
          let row = [];
          for(let x = 0; x < 3; x++){
            row.push(this.renderSquare((y * 3) + x));
          }
          columns.push(<div key={y} className="board-row">{row}</div>);
        }
        return (
          <div>{columns}</div>
        );
  }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastMove: null
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length -1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = (this.state.xIsNext ? "X" : "O");
        this.setState(
            {
                history: history.concat([{
                    squares: squares,
                    lastMove: i
                }]),
                stepNumber: history.length,
                xIsNext: !this.state.xIsNext,
            }
        );
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
        const desc = move ?
            "Go to move #" + move + " position " + index[step.lastMove]:
            "Go to game start";
        const buttonFont = (step === current) ? "400 15px system-ui" : "400 11px system-ui";
        return (
            <li key={move} >
                <button
                    style={{ font: buttonFont}}
                    onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    let status;
    if(winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }


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

const index = {
    0: "[1,1]",
    1: "[1,2]",
    2: "[1,3]",
    3: "[2,1]",
    4: "[2,2]",
    5: "[2,3]",
    6: "[3,1]",
    7: "[3,2]",
    8: "[3,3]",
};

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

