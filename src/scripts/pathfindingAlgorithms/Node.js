class Node {
	constructor(state, parent, action, type) {
		this.state = state;
		this.parent = parent;
		this.action = action;
		this.type = type;

		if (this.parent != null) {
			this.actualCost = this.parent.actualCost + 1;
		} else {
			this.actualCost = 0;
		}
	}
}

export default Node;
