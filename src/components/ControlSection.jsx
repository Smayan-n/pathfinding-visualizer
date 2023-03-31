import "../styles/ControlSection.css";
import DropDown from "./Dropdown";

function ControlSection(props) {
	const { onClearCanvas, onGenerate, onPathfind } = props;

	function handleGenerationOptionClick(e) {
		//index of the option clicked
		const option = parseInt(e.target.getAttribute("value"));
		onGenerate(option);
	}

	function handlePathfindingOptionClick(e) {
		//index of the option clicked
		const option = parseInt(e.target.getAttribute("value"));
		onPathfind(option);
	}

	const generationOptions = ["DFS Algorithm", "Recursive Division", "Prim's Algorithm"];
	const pathFindingOptions = [
		"Depth-First Search",
		"Breadth-First Search",
		"A* Search",
		"Dijkstra's Algorithm",
		"Greedy Best-First Search",
	];
	return (
		<section className="control-section">
			<button onClick={onClearCanvas} className="clear-btn">
				Clear
			</button>
			<DropDown
				title="Maze Generation"
				options={generationOptions}
				onOptionClick={handleGenerationOptionClick}
			></DropDown>
			<DropDown
				title="Path Finding"
				options={pathFindingOptions}
				onOptionClick={handlePathfindingOptionClick}
			></DropDown>
		</section>
	);
}

export default ControlSection;
