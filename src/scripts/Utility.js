function interpolate(p1, p2, step_size = 0.05) {
	//return a lost of interpolated points between p1 and p2 with given step size
	//p1, p2 = previous position, current position

	const direction = { x: p2.x - p1.x, y: p2.y - p1.y };
	const coords = [];
	for (let i = 0; i <= 1; i += step_size) {
		const x = Math.round(p1.x + i * direction.x);
		const y = Math.round(p1.y + i * direction.y);
		coords.push({ x: x, y: y });
	}
	return coords;
}
function distance(p1, p2) {
	return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function lerp(a, b, t) {
	return (1 - t) * a + t * b;
}

//return random int between min and max inclusive
function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function indexEquals(index1, index2) {
	return index1.row === index2.row && index1.col === index2.col;
}

function getNeighbors(index, rows, cols) {
	const { row, col } = index;
	const candidates = [
		["left", { row: row, col: col - 1 }],
		["up", { row: row - 1, col: col }],
		["right", { row: row, col: col + 1 }],
		["down", { row: row + 1, col: col }],
	];

	//validate neighbors
	const approved = [];
	candidates.forEach((candidate) => {
		const [action, index] = candidate;
		//make sure candidate is not outside maze bounds
		if (0 <= index.row && index.row < rows && 0 <= index.col && index.col < cols) {
			approved.push(candidate);
		}
	});
	return approved;
}
// function to shuffle an array
function shuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

export { interpolate, distance, lerp, randInt, indexEquals, getNeighbors, shuffle };
