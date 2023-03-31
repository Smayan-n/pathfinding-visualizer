import { indexEquals } from "../Utility";

class StackFrontier {
	constructor() {
		this.frontier = [];
	}

	empty() {
		return this.frontier.length === 0;
	}

	add(node) {
		this.frontier.push(node);
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

	//returns node with lowest cost in frontier(for A* and Dijkstra's)
	removeLowestCostNode(algorithm, end) {
		const fCost = (node) => {
			//manhattan distance heuristic
			const heuristic = Math.abs(node.state.row - end.row) + Math.abs(node.state.col - end.col);
			const pathCost = node.actualCost;
			//A*, Dijkstra's, and greedy BFS respectively
			if (algorithm === 2) return heuristic + pathCost;
			else if (algorithm === 3) return pathCost;
			else if (algorithm === 4) return heuristic;
		};

		let removeIdx = 0;
		for (let i = 1; i < this.frontier.length; i++) {
			if (fCost(this.frontier[i]) <= fCost(this.frontier[removeIdx])) {
				removeIdx = i;
			}
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
