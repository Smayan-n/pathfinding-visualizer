import { SimpleCanvas } from "./CanvasHelper";
import { indexEquals } from "./Utility";

class Maze {
	constructor() {
		this.rows = 20;
		this.cols = 50;

		//start and end cell indexes
		this.start = { row: 5, col: 5 };
		this.end = { row: 5, col: 20 };
		this.onStart = false;

		this.cellSize = 20;
		//objects with following fields {index: {row, col}, type}
		//type can be: path, wall, start, end, explored, solution
		this.cells = null;

		this.setupCells();
	}

	getType(index) {
		return this.cells[index.row][index.col].type;
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

	addCell(index, type) {
		//make sure to not remove start and end cells
		if (!indexEquals(index, this.start) && !indexEquals(index, this.end)) {
			this.cells[index.row][index.col].type = type;
		}
	}

	//clears cells of given type(clears all if no choice)
	clearCells(type) {
		this.cells.forEach((row) => {
			row.forEach((cell) => {
				if (type == null || cell.type === type) {
					this.addCell(cell.index, "path");
				}
			});
		});
	}

	//fills cells with walls
	fillCells() {
		this.cells.forEach((row) => {
			row.forEach((cell) => this.addCell(cell.index, "wall"));
		});
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
