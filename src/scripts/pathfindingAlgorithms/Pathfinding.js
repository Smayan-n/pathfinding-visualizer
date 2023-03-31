import { getNeighbors, indexEquals } from "../Utility";
import { QueueFrontier, StackFrontier } from "./Frontiers";
import Node from "./Node";

//function for pathfinding -> returns an array if solutions states and explored states
//DFS - not shortest
//BFS - shortest
//A* is just dijkstra but uses heuristic - shortest
//dijkstra uses just cost to reach node - shortest
//greedy bfs is just heuristic - not shortest

function pathfind(maze, algorithm) {
	//explored states
	const exploredStates = [];
	const startNode = new Node(maze.start, null, null, "start");

	let frontier;
	if (algorithm === 0) {
		frontier = new StackFrontier();
	} else {
		frontier = new QueueFrontier();
	}

	frontier.add(startNode);

	while (true) {
		//if frontier is empty, no solution exists
		if (frontier.empty()) return { solution: null, explored: exploredStates };

		//remove node from frontier to explore
		let currNode;
		if (algorithm >= 2) {
			currNode = frontier.removeLowestCostNode(algorithm, maze.end);
		} else {
			currNode = frontier.remove();
		}

		//if node is goal, solution found
		if (indexEquals(currNode.state, maze.end)) {
			//backtrack for the solution
			const solutionStates = [];
			while (currNode.parent != null) {
				solutionStates.push(currNode.state);
				currNode = currNode.parent;
			}
			//reverse array
			solutionStates.reverse();
			return { solution: solutionStates.slice(0, solutionStates.length - 1), explored: exploredStates.splice(1) };
		}

		//add node to explored
		exploredStates.push(currNode.state);

		const neighbors = getNeighbors(currNode.state, maze.rows, maze.cols);
		neighbors.forEach((neighbor) => {
			const [action, index] = neighbor;
			//if neighbor is not a wall, and not already explored, add it to the frontier
			if (
				maze.getType(index) !== "wall" &&
				!exploredStates.some((exploredIndex) => indexEquals(exploredIndex, index)) &&
				!frontier.containsState(index)
			) {
				const childNode = new Node(index, currNode, action);
				frontier.add(childNode);
			}
		});
	}
}

export default pathfind;
