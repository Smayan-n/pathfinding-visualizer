import { randInt } from "../Utility";

function primsAlgorithm(maze, visited) {
	// list of all bordering walls to visited nodes
	let surrounding = [];

	// random starting point
	const row = randInt(0, maze.length - 1);
	const col = randInt(0, maze[0].length - 1);
	maze[row][col] = 0;
	visited.push({ row: row, col: col });

	surrounding.push(...surrounding_cells(maze, row, col));

	let stop = false;
	while (!stop) {
		let rand = surrounding[randInt(0, surrounding.length - 1)];
		while (true) {
			let rand_surr = surrounding_cells(maze, rand.row, rand.col);
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
			maze[rand.row][rand.col] = 0;
			// append to visited list and remove from surrounding
			visited.push(rand);
			surrounding.splice(itemIndexInArray(surrounding, rand), 1);

			// add surrounding cells to surrounding list
			let surr = surrounding_cells(maze, rand.row, rand.col);
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
		if (array[i].row == item.row && array[i].col == item.col) {
			return i;
		}
	}
}

function isItemInArray(array, item) {
	for (var i = 0; i < array.length; i++) {
		if (array[i].row == item.row && array[i].col == item.col) {
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
		indexes.push({ row: row - 1, col: col });
	}
	if (row < rows - 1) {
		indexes.push({ row: row + 1, col: col });
	}
	if (col > 0) {
		indexes.push({ row: row, col: col - 1 });
	}
	if (col < cols - 1) {
		indexes.push({ row: row, col: col + 1 });
	}
	return indexes;
}

export default primsAlgorithm;
