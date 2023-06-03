import { SimpleCanvas } from "./CanvasHelper";
import { indexEquals } from "./Utility";

class Maze {
	constructor(rows = 18, cols = 50) {
		this.rows = rows;
		this.cols = cols;

		//start and end cell indexes
		this.start = { row: 1, col: 1 };
		this.end = { row: rows - 2, col: cols - 2 };
		this.onStartClick = false;
		this.onEndClick = false;

		this.cellSize = 20;
		//objects with following fields {index: {row, col}, type}
		//type can be: path, wall, start, end, explored, solution
		this.cells = null;

		this.setupCells();
	}

	getType(index) {
		return this.cells[index.row][index.col].type;
	}

	setDimensions(rows, cols) {
		this.rows = rows;
		this.cols = cols;
		//set start and end points
		this.start = { row: 1, col: 1 };
		this.end = { row: rows - 2, col: cols - 2 };
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
		const oldStart = this.start;
		this.addCell(index, "start");
		this.start = index;
		this.addCell(oldStart, "path");

		return oldStart;
	}

	setEnd(index) {
		//update start cell type
		const oldEnd = this.end;
		this.addCell(index, "end");
		this.end = index;
		this.addCell(oldEnd, "path");

		return oldEnd;
	}

	addCell(index, type) {
		//make sure to not remove start and end cells
		if (!indexEquals(index, this.start) && !indexEquals(index, this.end)) {
			this.cells[index.row][index.col].type = type;
		}
	}

	//clears cells of given type(clears all if no choice)
	//returns true if any cells were cleared
	clearCells(type) {
		let cleared = false;
		this.cells.forEach((row) => {
			row.forEach((cell) => {
				if (type == null || cell.type === type) {
					this.addCell(cell.index, "path");
					cleared = true;
				}
			});
		});
		return cleared;
	}

	//fills cells with walls
	fillCells() {
		this.cells.forEach((row) => {
			row.forEach((cell) => this.addCell(cell.index, "wall"));
		});
	}

	//returns index {row, col} of cell at given position
	getCellIndex(point) {
		//check for bounds too
		return {
			row: Math.floor(
				point.y < 0 ? 0 : point.y >= this.rows * this.cellSize ? this.rows - 1 : point.y / this.cellSize
			),
			col: Math.floor(point.x < 0 ? 0 : point.x / this.cellSize),
		};
	}

	//returns coord on canvas based on index
	getCellPos(index) {
		return { x: index.col * this.cellSize, y: index.row * this.cellSize };
	}
}

export default Maze;
