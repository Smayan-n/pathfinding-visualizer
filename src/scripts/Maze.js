import { SimpleCanvas } from "./CanvasHelper";

class Maze {
	constructor() {
		this.rows = 28;
		this.cols = 60;

		this.cellSize = 20;
		this.cells = null;
	}

	setupCells() {
		const newCells = new Array(this.rows);
		for (let i = 0; i < this.rows; i++) {
			newCells[i] = new Array(this.cols);
		}

		//store top-left positions of cellsRef.current in array
		for (let row = 0; row < this.rows; row += 1) {
			for (let col = 0; col < this.cols; col += 1) {
				newCells[row][col] = {
					x: col * this.cellSize,
					y: row * this.cellSize,
					color: this.cells ? this.cells[row][col].color : "white",
				};
			}
		}
		this.cells = newCells;
		//init canvas
	}

	addWall(cell) {
		this.cells = this.cells.map((row) => {
			return row.map((c) => {
				if (c === cell) {
					c.color = `rgba(${50}, ${240}, ${240}, 1)`;
				}
				return c;
			});
		});
	}

	clearCells() {
		this.cells = this.cells.map((row) => row.map((cell) => ({ ...cell, color: "white" })));
	}

	clearCell(cell) {
		this.cells = this.cells.map((row) => {
			return row.map((c) => {
				if (c == cell) {
					c.color = "white";
				}
				return c;
			});
		});
	}
}

export default Maze;
