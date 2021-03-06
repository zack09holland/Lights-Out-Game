import React, { Component } from "react";
import Cell from "../Cell/Cell";
import "./Board.css";

/** Lights Out Game
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *
 *
 **/

class Board extends Component {
	static defaultProps = {
		nrows: 4,
		ncols: 4,
		chanceLightStartsOn: 0.25,
	};
	constructor(props) {
		super(props);

		// TODO: set initial state
		this.state = {
			hasWon: false,
			boardClicks: 0,
			board: this.createBoard(),
		};
	}

	/** create a board nrows high/ncols wide, each cell randomly lit or unlit */

	createBoard() {
		let board = [];
		for (let x = 0; x < this.props.nrows; x++) {
			let row = [];
			for (let y = 0; y < this.props.ncols; y++) {
				row.push(Math.random() < this.props.chanceLightStartsOn);
			}
			board.push(row);
		}
		return board;
	}

	/** handle changing a cell: update board & determine if winner */

	flipCellsAround(coord) {
		let { ncols, nrows } = this.props;
		let board = this.state.board;
		let [y, x] = coord.split("-").map(Number);

		function flipCell(y, x) {
			// if this coord is actually on board, flip it
			if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
				board[y][x] = !board[y][x];
			}
		}
		//Flip the cells
		flipCell(y, x);
		flipCell(y, x - 1);
		flipCell(y, x + 1);
		flipCell(y - 1, x);
		flipCell(y + 1, x);

		// win when every cell is turned off
		let hasWon = board.every((row) => row.every((cell) => !cell));

		this.setState({ board, hasWon });
		this.setState((prevState) => {
			return { boardClicks: prevState.boardClicks + 1 };
		});
	}

	/** Render game board or winning message. */

	render() {
        // If the user has won circumnavigate the gameboard and just display you won
		if (this.state.hasWon) {
			return <h1 className='winner'>You won!!!</h1>;
        }
        
		let gameBoard = [];

		for (let y = 0; y < this.props.nrows; y++) {
			let row = [];
			for (let x = 0; x < this.props.ncols; x++) {
				let coord = `${y}-${x}`;
				row.push(
					<Cell
						key={coord}
						isLit={this.state.board[y][x]}
						flipCellsAroundMe={() => this.flipCellsAround(coord)}
					/>
				);
			}
			gameBoard.push(<tr key={y}>{row}</tr>);
		}

		return (
			<div>
				<h1 className="glow">LIGHTS OUT</h1>
				<table className="Board">
					<tbody>{gameBoard}</tbody>
				</table>
				<p>Number of moves: {this.state.boardClicks}</p>
			</div>
		);
	}
}

export default Board;
