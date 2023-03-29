import { SimpleCanvas } from "./CanvasHelper";

class Maze {
	constructor() {
		this.rows = 28;
		this.cols = 60;

		this.cellSize = 20;
		//objects with following fields {x, y, color, type}
		//type can be: path, wall, ...
		this.cells = null;

		this.wallColor = `rgba(${50}, ${240}, ${240}, 1)`;
	}

	setupCells(generated) {
		const newCells = new Array(this.rows);
		for (let i = 0; i < this.rows; i++) {
			newCells[i] = new Array(this.cols);
		}

		//store top-left positions of cellsRef.current in array
		for (let row = 0; row < this.rows; row += 1) {
			for (let col = 0; col < this.cols; col += 1) {
				let color = null;
				if (generated) {
					color = generated[row][col] === 1 ? "green" : "white";
				}
				newCells[row][col] = {
					x: col * this.cellSize,
					y: row * this.cellSize,
					color: this.cells ? this.cells[row][col].color : "white",
					// color: color ? color : "white",
					type: this.cells ? this.cells[row][col].type : "path",
				};
			}
		}
		this.cells = newCells;
		//init canvas
	}

	addWall(cell) {
		const { ridx, cidx } = this.getCellIndices(cell);
		this.cells[ridx][cidx].color = this.wallColor;
		this.cells[ridx][cidx].type = "wall";
	}

	clearCells() {
		this.cells = this.cells.map((row) => row.map((cell) => ({ ...cell, color: "white", type: "path" })));
	}

	fillCells() {
		this.cells = this.cells.map((row) => row.map((cell) => ({ ...cell, color: this.wallColor, type: "wall" })));
	}

	clearCell(cell) {
		const { ridx, cidx } = this.getCellIndices(cell);
		this.cells[ridx][cidx].color = "white";
		this.cells[ridx][cidx].type = "path";
	}

	//returns a cell at given x, y coord
	getCellAtPos(point) {
		const indices = this.getCellIndices(point);
		return this.cells[indices.ridx][indices.cidx];
	}

	getCellIndices(cell) {
		return {
			ridx: Math.floor(cell.y < 0 ? 0 : cell.y / this.cellSize),
			cidx: Math.floor(cell.x < 0 ? 0 : cell.x / this.cellSize),
		};
	}
}

export default Maze;
