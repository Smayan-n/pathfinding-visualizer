import { indexEquals } from "../Utility";

class StackFrontier {
	constructor() {
		this.frontier = [];
	}

	empty() {
		return this.frontier.length === 0;
	}

	add(node) {
		const state = node.state;
		const index = this.frontier.findIndex((n) => indexEquals(n.state, state));
		if (index !== -1) {
			// Node is already in frontier, update cost
			const existingNode = this.frontier[index];
			if (node.actualCost < existingNode.actualCost) {
				existingNode.actualCost = node.actualCost;
				existingNode.parent = node.parent;
			}
		} else {
			// Node is not in frontier, add it
			this.frontier.push(node);
		}
	}

	containsState(state) {
		return this.frontier.some((n) => indexEquals(n.state, state));
	}

	remove() {
		if (!this.empty()) {
			//remove last element
			const removedNode = this.frontier.splice(this.frontier.length - 1, 1);
			return removedNode[0];
		}
	}

	removeNodeWithState(index) {
		this.frontier.forEach((n, idx) => {
			if (indexEquals(n.state, index)) {
				this.frontier.splice(idx, 1);
			}
		});
	}

	//returns node with lowest cost in frontier(for A* , Dijkstra's, G-BFS)
	removeLowestCostNode(algorithm, end) {
		//An admissible heuristic is one that never overestimates the actual cost to reach the goal node

		const fCost = (node) => {
			//manhattan distance heuristic
			const pathCost = node.actualCost;
			//A*, Dijkstra's, and greedy BFS respectively
			if (algorithm === 2) return heuristic(node) + pathCost;
			else if (algorithm === 3) return pathCost;
			else if (algorithm === 4) return heuristic(node);
		};

		const heuristic = (node) => {
			const heuristic = Math.abs(node.state.row - end.row) + Math.abs(node.state.col - end.col);
			return heuristic;
		};

		const tieBreaker = (node) => {
			//the tiebreaker (which is just the diagonal distance) will ensure proper pick of nodes with the same fCost for A*

			const tieBreaker = Math.sqrt(Math.pow(node.state.row - end.row, 2) + Math.pow(node.state.col - end.col, 2));
			return tieBreaker;
		};

		let removeIdx = 0;
		for (let i = 1; i < this.frontier.length; i++) {
			const currNode = this.frontier[i];
			const lowestNode = this.frontier[removeIdx];
			//make sure to take other algorithms in account when changing things here
			if (fCost(currNode) <= fCost(lowestNode)) {
				removeIdx = i;
			}
			// } else if (fCost(currNode) === fCost(lowestNode)) {
			// 	//tiebreaker - fix for dijkstras
			// 	if (heuristic(currNode) < heuristic(lowestNode)) {
			// 		removeIdx = i;
			// 	}
			// }
		}
		const lowestNode = this.frontier.splice(removeIdx, 1);
		return lowestNode[0];
	}
}

class QueueFrontier extends StackFrontier {
	remove() {
		if (!this.empty()) {
			//remove first element
			const removedNode = this.frontier.splice(0, 1);
			return removedNode[0];
		}
	}
}

export { StackFrontier, QueueFrontier };
