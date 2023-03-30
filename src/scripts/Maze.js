import { SimpleCanvas } from "./CanvasHelper";
import { indexEquals } from "./Utility";

class Maze {
	constructor() {
		this.rows = 28;
		this.cols = 60;

		//start and end cell indexes
		this.start = { row: 10, col: 10 };
		this.end = { row: 10, col: 50 };
		this.onStart = null;

		this.cellSize = 20;
		//objects with following fields {index: {row, col}, type}
		//type can be: path, wall, start, end
		this.cells = null;

		this.setupCells();
	}

	setupCells() {
		const newCells = new Array(this.rows);
		for (let i = 0; i < this.rows; i++) {
			newCells[i] = new Array(this.cols);
		}

		//store indexes of cells in array
		for (let row = 0; row < this.rows; row += 1) {
			for (let col = 0; col < this.cols; col += 1) {
				const index = { row: row, col: col };
				newCells[row][col] = {
					index: index,
					type: indexEquals(index, this.start) ? "start" : indexEquals(index, this.end) ? "end" : "path",
				};
			}
		}
		this.cells = newCells;
	}

	setStart(index) {
		//update start cell type
		this.cells[this.start.row][this.start.col].type = "path";
		this.start = index;
		this.cells[index.row][index.col].type = "start";
	}

	addWall(index) {
		this.cells[index.row][index.col].type = "wall";
	}

	addPath(index) {
		this.cells[index.row][index.col].type = "path";
	}

	clearCells() {
		this.cells = this.cells.map((row) => row.map((cell) => ({ ...cell, type: "path" })));
	}

	fillCells() {
		this.cells = this.cells.map((row) => row.map((cell) => ({ ...cell, type: "wall" })));
	}

	//returns index {row, col} of cell at given position
	getCellIndex(point) {
		return {
			row: Math.floor(point.y < 0 ? 0 : point.y / this.cellSize),
			col: Math.floor(point.x < 0 ? 0 : point.x / this.cellSize),
		};
	}

	//returns coord on canvas based on index
	getCellPos(index) {
		return { x: index.col * this.cellSize, y: index.row * this.cellSize };
	}
}

export default Maze;
