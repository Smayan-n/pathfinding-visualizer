import { lerp } from "../scripts/Utility.js";
import { SimpleCanvas } from "./CanvasHelper";

class CanvasRenderer {
	constructor(maze) {
		this.maze = maze;
		this.ctx = null;

		this.animationQueue = [];
		this.animationRunning = false;
	}

	setCanvasContext(ctx) {
		this.ctx = ctx;
		this.simpleCanvas = new SimpleCanvas(this.ctx);
	}

	//draws grid and fills cells with their respective colors
	renderMaze() {
		if (this.maze.cells) {
			this.maze.cells.forEach((row) => {
				row.forEach((cell) => {
					const cellSize = this.maze.cellSize;
					//grid
					this.simpleCanvas.rect(cell.x, cell.y, cellSize, cellSize, "", "black", false);
					//color cells
					this.simpleCanvas.rect(cell.x, cell.y, cellSize, cellSize, "", cell.color, true);
				});
			});
		}
	}

	clear() {
		if (this.ctx) {
			this.ctx.clearRect(0, 0, this.maze.cols * this.maze.cellSize, this.maze.rows * this.maze.cellSize);
		}
	}

	clearCell(cell) {
		if (this.ctx) {
			this.simpleCanvas.rect(cell.x, cell.y, this.maze.cellSize - 1, this.maze.cellSize - 1, "", "white", true);
		}
	}

	queueAnimation(cell) {
		//i is animation counter
		const animation = { cell: cell, i: this.maze.cellSize };
		//only add new animation to queue if cell is not already being animated and is not already drawn
		if (
			!this.animationQueue.some((anim) => {
				return anim.cell === animation.cell;
			}) &&
			cell.color === "white"
		) {
			this.animationQueue.push(animation);
		}

		const animSpeed = 10; //speed for one cell animation in milliseconds

		//add ctx null check
		if (!this.animationRunning) {
			this.animationRunning = true;

			const interval = setInterval(() => {
				for (let j = 0; j < this.animationQueue.length; j++) {
					const animation = this.animationQueue[j];
					const color = lerp(240, 150, animation.i / this.maze.cellSize);
					this.simpleCanvas.rect(
						animation.cell.x + animation.i / 2,
						animation.cell.y + animation.i / 2,
						this.maze.cellSize - animation.i - 1,
						this.maze.cellSize - animation.i - 1,
						"",
						animation.i > 0 ? `rgba(${50}, ${color}, ${color - 40}, 1)` : `rgba(${50}, ${240}, ${240}, 1)`,
						true, //fill?
						animation.i > 0 //round?
					);
					//decrease animation counter
					animation.i = animation.i - 1;
					this.animationQueue[j] = animation;
					//if animation is done, remove it from queue
					if (animation.i < 0) {
						this.animationQueue = this.animationQueue.filter((a) => a !== animation);
					}
				}

				//if animation queue is empty, stop animation interval
				if (this.animationQueue.length === 0) {
					this.animationRunning = false;
					clearInterval(interval);
				}
			}, animSpeed);
		}
	}

	getCellAtPos(point) {
		const indices = getCellIndices(point);
		return maze.cells[indices.rowIndex][indices.colIndex];
	}

	getCellIndices(point) {
		return {
			rowIndex: Math.floor(point.y < 0 ? 0 : point.y / maze.cellSize),
			colIndex: Math.floor(point.x < 0 ? 0 : point.x / maze.cellSize),
		};
	}
}

export default CanvasRenderer;
