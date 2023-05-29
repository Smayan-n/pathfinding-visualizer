import React, { useRef, useState } from "react";
import "../styles/ControlSection.css";
import DropDown from "./Dropdown";

function ControlSection(props) {
	const { onClearCanvas, onGenerate, onPathfind, onGridDimsChange, numStates } = props;

	const rowsInputRef = useRef(null);
	const colsInputRef = useRef(null);

	const [generationOption, setGenerationOption] = useState(-1);
	const [pathfindingOption, setPathfindingOption] = useState(-1);

	function handleGenerationOptionClick(e) {
		//index of the option clicked
		// const option = parseInt(e.target.getAttribute("value"));
		// setGenerationAlgorithm(generationOptions[option]);
		// onGenerate(option);
		setGenerationOption(parseInt(e.target.getAttribute("value")));
		setPathfindingOption(-1);
	}

	function handlePathfindingOptionClick(e) {
		//index of the option clicked
		// const option = parseInt(e.target.getAttribute("value"));
		// setPathfindingAlgorithm(pathFindingOptions[option]);
		// onPathfind(option);
		setPathfindingOption(parseInt(e.target.getAttribute("value")));
		setGenerationOption(-1);
	}

	function handleStartClick() {
		if (generationOption === -1) {
			onPathfind(pathfindingOption);
		} else {
			onGenerate(generationOption);
		}
	}

	function handleGridDimsChange() {
		onGridDimsChange(parseInt(rowsInputRef.current.value), parseInt(colsInputRef.current.value));
	}

	const generationAlgorithms = ["DFS Algorithm", "Recursive Division", "Prim's Algorithm"];
	const pathfindingAlgorithms = [
		"Depth-First Search",
		"Breadth-First Search",
		"A* Search",
		"Dijkstra's Algorithm",
		"Greedy Best-First Search",
	];
	const generationAlgorithmsDescriptions = [
		"generates a maze by randomly exploring the grid using depth-first search",
		"generates a maze by recursively dividing the grid with walls, creating passages through random openings",
		"generates a maze by repeatedly adding the nearest unvisited cell to the maze",
	];
	const pathfindingAlgorithmsDescriptions = [
		"does not guarantee the shortest path and is slow",
		"guarantees the shortest path but is slow",
		"guarantees the shortest path and is fast",
		"guarantees the shortest path and can be fast",
		"does not guarantee the shortest but can be fast",
	];

	const getDescription = () => {
		if (generationOption === -1 && pathfindingOption === -1) {
			return "Pick an algorithm to generate a maze or find a path!";
		} else if (generationOption !== -1) {
			return (
				<div>
					<strong>{generationAlgorithms[generationOption]}</strong>{" "}
					{generationAlgorithmsDescriptions[generationOption]}
				</div>
			);
		} else {
			return (
				<div>
					<strong>{pathfindingAlgorithms[generationOption]}</strong>{" "}
					{pathfindingAlgorithmsDescriptions[generationOption]}
				</div>
			);
		}
	};
	return (
		<section className="control-section">
			<section className="top-bar">
				<div className="app-title">Pathfinding Visualizer</div>
				<DropDown
					title="Maze Generation"
					options={generationAlgorithms}
					onOptionClick={handleGenerationOptionClick}
				></DropDown>
				<DropDown
					title="Path Finding"
					options={pathfindingAlgorithms}
					onOptionClick={handlePathfindingOptionClick}
				></DropDown>

				<button
					style={{
						backgroundColor: generationOption === -1 && pathfindingOption === -1 ? "grey" : "green",
					}}
					disabled={pathfindingOption === -1 && generationOption === -1}
					onClick={handleStartClick}
					className="start-btn"
				>
					{generationOption !== -1
						? "Generate Maze!"
						: pathfindingOption !== -1
						? "Find Path!"
						: "Select an Algorithm"}
				</button>

				<button onClick={onClearCanvas} className="clear-btn">
					Clear
				</button>
			</section>

			<section className="top-section">
				<section className="display-section">
					<section className="states-info">
						<div>States Explored: {numStates.explored}</div>
						{numStates.solution === -1 ? (
							<div style={{ color: "red" }}>No Solution</div>
						) : (
							<div>Solution States: {numStates.solution}</div>
						)}
					</section>
				</section>

				<section className="settings-section">
					<label htmlFor="rows-input">Rows: </label>
					<input ref={rowsInputRef} type="number" id="rows-input" min="10" max="50" defaultValue="19" />
					<label htmlFor="cols-input">Columns: </label>
					<input ref={colsInputRef} type="number" id="cols-input" min="10" max="100" defaultValue="50" />
					<button onClick={handleGridDimsChange}>Apply</button>
				</section>
			</section>

			<section className="bottom-info-section">{getDescription()}</section>
		</section>
	);
}

export default ControlSection;
