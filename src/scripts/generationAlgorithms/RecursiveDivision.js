import { randInt } from "../Utility";

//takes in a clear maze and adds walls
function recursiveDivision(maze, walls, rowRange, colRange) {
	const rr = rowRange.end - rowRange.start;
	const cr = colRange.end - colRange.start;

	if (rr < 2 || cr < 2) {
		return maze;
	}

	//vertical division
	if (cr >= rr) {
		const possibleCols = [];
		for (let i = colRange.start + 1; i < colRange.end; i += 2) {
			possibleCols.push(i);
		}
		const wallCol = possibleCols[randInt(0, possibleCols.length - 1)];

		const possibleRows = [];
		for (let i = rowRange.start; i < rowRange.end; i += 2) {
			possibleRows.push(i);
		}
		const openRow = possibleRows[randInt(0, possibleRows.length - 1)];

		for (let row = rowRange.start; row < rowRange.end; row++) {
			maze[row][wallCol] = row === openRow ? 0 : 1;
			row === openRow ? null : walls.push({ row: row, col: wallCol });
		}

		recursiveDivision(maze, walls, rowRange, { start: colRange.start, end: wallCol });
		recursiveDivision(maze, walls, rowRange, { start: wallCol + 1, end: colRange.end });

		//Horizontal division
	} else {
		const possibleRows = [];
		for (let i = rowRange.start + 1; i < rowRange.end; i += 2) {
			possibleRows.push(i);
		}
		const wallRow = possibleRows[randInt(0, possibleRows.length - 1)];

		const possibleCols = [];
		for (let i = colRange.start; i < colRange.end; i += 2) {
			possibleCols.push(i);
		}
		const openCol = possibleCols[randInt(0, possibleCols.length - 1)];

		for (let col = colRange.start; col < colRange.end; col++) {
			maze[wallRow][col] = col === openCol ? 0 : 1;
			col === openCol ? null : walls.push({ row: wallRow, col: col });
		}

		recursiveDivision(maze, walls, { start: rowRange.start, end: wallRow }, colRange);
		recursiveDivision(maze, walls, { start: wallRow + 1, end: rowRange.end }, colRange);
	}

	return maze;
}

export default recursiveDivision;
