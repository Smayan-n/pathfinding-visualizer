import { randInt } from "../Utility";
function dfsGenerator(maze, empty) {
	const randC = randInt(0, maze[0].length - 1);
	const randR = randInt(0, maze.length - 1);
	maze[randR][randC] = 0;
	return dfsGeneratorRecursive(maze, empty, randR, randC);
}

function dfsGeneratorRecursive(maze, empty, row, col) {
	const choices = shuffle([1, 2, 3, 4]); // shuffle the choices randomly
	const rows = maze.length;
	const cols = maze[0].length;

	for (let i = 0; i < choices.length; i++) {
		const choice = choices[i];
		switch (choice) {
			case 1: // up
				if (row - 2 >= 0) {
					if (maze[row - 2][col] !== 0) {
						maze[row - 2][col] = 0;
						maze[row - 1][col] = 0;
						empty.push([row - 1, col], [row - 2, col]);
						dfsGeneratorRecursive(maze, empty, row - 2, col);
					}
				}
				break;

			case 2: // right
				if (col + 2 < cols) {
					if (maze[row][col + 2] !== 0) {
						maze[row][col + 2] = 0;
						maze[row][col + 1] = 0;
						empty.push([row, col + 1], [row, col + 2]);
						dfsGeneratorRecursive(maze, empty, row, col + 2);
					}
				}
				break;

			case 3: // down
				if (row + 2 < rows) {
					if (maze[row + 2][col] !== 0) {
						maze[row + 2][col] = 0;
						maze[row + 1][col] = 0;
						empty.push([row + 1, col], [row + 2, col]);
						dfsGeneratorRecursive(maze, empty, row + 2, col);
					}
				}
				break;

			case 4: // left
				if (col - 2 >= 0) {
					if (maze[row][col - 2] !== 0) {
						maze[row][col - 2] = 0;
						maze[row][col - 1] = 0;
						empty.push([row, col - 1], [row, col - 2]);
						dfsGeneratorRecursive(maze, empty, row, col - 2);
					}
				}
				break;

			default:
				break;
		}
	}

	return maze;
}

// function to shuffle an array
function shuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

export default dfsGenerator;
