import { randInt } from "../Utility";

function primsAlgorithm(maze, visited) {
	// list of all bordering walls to visited nodes
	let surrounding = [];
	// list of all visited nodes
	// let visited = [];

	// random starting point
	const x = randInt(0, maze.length - 1);
	const y = randInt(0, maze[0].length - 1);
	maze[x][y] = 0;
	visited.push([x, y]);

	surrounding.push(...surrounding_cells(maze, x, y));

	let stop = false;
	while (!stop) {
		let rand = surrounding[randInt(0, surrounding.length - 1)];
		while (true) {
			let rand_surr = surrounding_cells(maze, rand[0], rand[1]);
			// checking if cells surrounding rand cell are visited cells
			let cnt = 0;
			rand_surr.forEach((cell) => {
				if (isItemInArray(visited, cell)) {
					cnt += 1;
				}
			});
			// if the random cell selected is bordering more than 1 visited cell, choose a different random cell
			if (cnt <= 1) {
				break;
			} else {
				// remove cell from surrounding that cannot be made visited
				surrounding.splice(itemIndexInArray(surrounding, rand), 1);
				if (surrounding.length == 0) {
					break;
				}
				rand = surrounding[randInt(0, surrounding.length - 1)];
			}
		}

		if (surrounding.length > 0) {
			// set the cell to visited
			maze[rand[0]][rand[1]] = 0;
			// append to visited list and remove from surrounding
			visited.push(rand);
			surrounding.splice(itemIndexInArray(surrounding, rand), 1);

			// add surrounding cells to surrounding list
			let surr = surrounding_cells(maze, rand[0], rand[1]);
			surr.forEach((cell) => {
				if (!isItemInArray(surrounding, cell) && !isItemInArray(visited, cell)) {
					surrounding.push(cell);
				}
			});
		} else {
			stop = true;
		}
	}

	return maze;
}

function itemIndexInArray(array, item) {
	for (var i = 0; i < array.length; i++) {
		if (array[i][0] == item[0] && array[i][1] == item[1]) {
			return i;
		}
	}
}

function isItemInArray(array, item) {
	for (var i = 0; i < array.length; i++) {
		// This if statement depends on the format of your array
		if (array[i][0] == item[0] && array[i][1] == item[1]) {
			return true; // Found it
		}
	}
	return false; // Not found
}

function surrounding_cells(maze, row, col) {
	const rows = maze.length;
	const cols = maze[0].length;

	const indexes = [];
	if (row > 0) {
		indexes.push([row - 1, col]);
	}
	if (row < rows - 1) {
		indexes.push([row + 1, col]);
	}
	if (col > 0) {
		indexes.push([row, col - 1]);
	}
	if (col < cols - 1) {
		indexes.push([row, col + 1]);
	}
	return indexes;
}

export default primsAlgorithm;
