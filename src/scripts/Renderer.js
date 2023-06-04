import { lerp } from "../scripts/Utility.js";
import { SimpleCanvas } from "./CanvasHelper";

class CanvasRenderer {
	constructor(maze) {
		this.maze = maze;
		this.ctx = null;

		this.animationQueue = [];
		this.animationRunning = false;
		this.visualizationRunning = false; //visualization for generation/pathfinding - used by client
		this.animSpeed = 10; //speed for one cell animation in milliseconds - lower is faster

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

	setAnimSpeed(newSpeed) {
		this.animSpeed = newSpeed;
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

	drawCell(index) {
		const cell = this.maze.cells[index.row][index.col];
		const pos = this.maze.getCellPos(index);
		this.simpleCanvas.rect(
			pos.x,
			pos.y,
			this.maze.cellSize - 1,
			this.maze.cellSize - 1,
			"",
			this.typeColorMap[cell.type],
			true, //fill?
			false
		);
	}

	//animates a given array of states to given type
	queueStatesAnimation(states, type, animSpeed, onNumStatesChange) {
		//NOTE: animSpeed custom parameter is not used rn
		//make sure states is not empty
		if (states.length === 0)
			return new Promise((resolve) => {
				resolve(true);
			});

		return new Promise((resolve) => {
			//loop through states and animate the to given type
			let i = 0;
			const interval = setInterval(() => {
				const index = { row: states[i].row, col: states[i].col };
				this.maze.addCell(index, type);
				this.queueAnimation(index);

				if (type === "explored") {
					onNumStatesChange({ explored: i + 1, solution: 0 });
				} else if (type === "solution") {
					onNumStatesChange({ explored: -1, solution: i + 1 });
				}

				i++;
				if (i >= states.length) {
					clearInterval(interval);
					resolve(true);
				}
			}, this.animSpeed * 2);
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
	queueAnimation(index, startOffSet = 0) {
		const cell = this.maze.cells[index.row][index.col];
		//i is animation counter
		const animation = { cell: cell, i: this.maze.cellSize - startOffSet };
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
					const from = { red: 255, green: 255, blue: 255 };
					const to = { red: 219, green: 169, blue: 51 };
					const red = lerp(from.red, to.red, animation.i / this.maze.cellSize);
					const green = lerp(from.green, to.green, animation.i / this.maze.cellSize);
					const blue = lerp(from.blue, to.blue, animation.i / this.maze.cellSize);

					this.simpleCanvas.rect(
						pos.x + animation.i / 2,
						pos.y + animation.i / 2,
						this.maze.cellSize - animation.i - 1,
						this.maze.cellSize - animation.i - 1,
						"",
						this.typeColorMap[animation.cell.type],
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
