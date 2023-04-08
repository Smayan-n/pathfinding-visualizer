import { QueueFrontier, StackFrontier } from "../pathfindingAlgorithms/Frontiers";
import { randInt, shuffle } from "../Utility";

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
						empty.push({ row: row - 1, col: col }, { row: row - 2, col: col });
						dfsGeneratorRecursive(maze, empty, row - 2, col);
					}
				}
				break;

			case 2: // right
				if (col + 2 < cols) {
					if (maze[row][col + 2] !== 0) {
						maze[row][col + 2] = 0;
						maze[row][col + 1] = 0;
						empty.push({ row: row, col: col + 1 }, { row: row, col: col + 2 });
						dfsGeneratorRecursive(maze, empty, row, col + 2);
					}
				}
				break;

			case 3: // down
				if (row + 2 < rows) {
					if (maze[row + 2][col] !== 0) {
						maze[row + 2][col] = 0;
						maze[row + 1][col] = 0;
						empty.push({ row: row + 1, col: col }, { row: row + 2, col: col });
						dfsGeneratorRecursive(maze, empty, row + 2, col);
					}
				}
				break;

			case 4: // left
				if (col - 2 >= 0) {
					if (maze[row][col - 2] !== 0) {
						maze[row][col - 2] = 0;
						maze[row][col - 1] = 0;
						empty.push({ row: row, col: col - 1 }, { row: row, col: col - 2 });
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

function dfsGeneratorRecursive2(maze, empty, row, col) {
	const rows = maze.length;
	const cols = maze[0].length;

	const frontier = new StackFrontier();
	frontier.add({ row: row, col: col });

	while (true) {
		if (frontier.empty()) return empty;

		const { row, col } = frontier.remove();

		const choices = shuffle([1, 2, 3, 4]); // shuffle the choices randomly
		for (let i = 0; i < choices.length; i++) {
			const choice = choices[i];
			switch (choice) {
				case 1: // up
					if (row - 2 >= 0) {
						if (maze[row - 2][col] !== 0) {
							maze[row - 2][col] = 0;
							maze[row - 1][col] = 0;
							empty.push({ row: row - 1, col: col }, { row: row - 2, col: col });
							frontier.add({ row: row - 2, col: col });
						}
					}
					break;

				case 2: // right
					if (col + 2 < cols) {
						if (maze[row][col + 2] !== 0) {
							maze[row][col + 2] = 0;
							maze[row][col + 1] = 0;
							empty.push({ row: row, col: col + 1 }, { row: row, col: col + 2 });
							frontier.add({ row: row, col: col + 2 });
						}
					}
					break;

				case 3: // down
					if (row + 2 < rows) {
						if (maze[row + 2][col] !== 0) {
							maze[row + 2][col] = 0;
							maze[row + 1][col] = 0;
							empty.push({ row: row + 1, col: col }, { row: row + 2, col: col });
							frontier.add({ row: row + 2, col: col });
						}
					}
					break;

				case 4: // left
					if (col - 2 >= 0) {
						if (maze[row][col - 2] !== 0) {
							maze[row][col - 2] = 0;
							maze[row][col - 1] = 0;
							empty.push({ row: row, col: col - 1 }, { row: row, col: col - 2 });
							frontier.add({ row: row, col: col - 2 });
						}
					}
					break;

				default:
					break;
			}
		}
	}
}
export default dfsGenerator;
