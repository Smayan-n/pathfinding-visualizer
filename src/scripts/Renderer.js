import { lerp } from "../scripts/Utility.js";
import { SimpleCanvas } from "./CanvasHelper";

class CanvasRenderer {
	constructor(maze) {
		this.maze = maze;
		this.ctx = null;

		this.animationQueue = [];
		this.animationRunning = false;
		this.animSpeed = 8; //speed for one cell animation in milliseconds

		this.wallColor = "rgb(34, 61, 112)";
		this.pathColor = "white";
		this.startColor = "green";
		this.endColor = "red";
		this.exploredColor = "rgb(219, 160, 51)";
		this.solutionColor = "rgb(237, 237, 24)";
		this.typeColorMap = {
			wall: this.wallColor,
			path: this.pathColor,
			start: this.startColor,
			end: this.endColor,
			explored: this.exploredColor,
			solution: this.solutionColor,
		};
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
					const pos = this.maze.getCellPos(cell.index);
					//grid
					this.simpleCanvas.rect(pos.x, pos.y, cellSize, cellSize, "", "black", false);
					//color cells
					this.simpleCanvas.rect(
						pos.x,
						pos.y,
						cellSize - 1,
						cellSize - 1,
						"",
						this.typeColorMap[cell.type],
						true
					);
				});
			});
		}
	}

	//animates a given array of states based on type
	queueStatesAnimation(states, type, animSpeed) {
		return new Promise((resolve) => {
			let i = 0;
			const interval = setInterval(() => {
				const index = { row: states[i].row, col: states[i].col };
				this.maze.addCell(index, type);
				this.queueAnimation(index);

				i++;
				if (i >= states.length) {
					clearInterval(interval);
					resolve(true);
				}
			}, animSpeed);
		});
	}

	//animation for complete board fill / clear
	queueFullAnimation(flag) {
		return new Promise((resolve) => {
			let r = 0;
			const interval = setInterval(
				() => {
					const rows = this.maze.cells[r];
					rows.forEach((cell) => {
						this.queueAnimation(cell.index);
					});
					r++;
					if (r >= this.maze.rows) {
						clearInterval(interval);
						resolve(true);
					}
				},
				flag === "fill" ? 30 : 10
			);
		});
	}

	//will animate cell at given index based on its type(wall or path)
	queueAnimation(index) {
		const cell = this.maze.cells[index.row][index.col];
		//i is animation counter
		const animation = { cell: cell, i: this.maze.cellSize };
		//only add new animation to queue if cell is not already being animated
		//*and is not already drawn
		if (
			!this.animationQueue.some((anim) => {
				return anim.cell === animation.cell;
			})
		) {
			this.animationQueue.push(animation);
		}

		this.startAnimation();
	}

	startAnimation() {
		//add ctx null check
		if (!this.animationRunning) {
			this.animationRunning = true;

			const interval = setInterval(() => {
				for (let j = 0; j < this.animationQueue.length; j++) {
					const animation = this.animationQueue[j];
					const pos = this.maze.getCellPos(animation.cell.index);

					//colors
					const from = { red: 255, green: 0, blue: 0 };
					const red = lerp(34, from.red, animation.i / this.maze.cellSize);
					const green = lerp(61, from.green, animation.i / this.maze.cellSize);
					const blue = lerp(112, from.blue, animation.i / this.maze.cellSize);

					this.simpleCanvas.rect(
						pos.x + animation.i / 2,
						pos.y + animation.i / 2,
						this.maze.cellSize - animation.i - 1,
						this.maze.cellSize - animation.i - 1,
						"",
						`rgb(${red}, ${green}, ${blue})`,
						// animation.i > 0 ? `rgba(${50}, ${color}, ${color - 40}, 1)` : `rgba(${50}, ${240}, ${240}, 1)`,
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
			}, this.animSpeed);
		}
	}
}

export default CanvasRenderer;
