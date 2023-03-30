import "../styles/ControlSection.css";
import DropDown from "./Dropdown";

function ControlSection(props) {
	const { onClearCanvas, onGenerate } = props;

	function handleOptionClick(e) {
		//index of the option clicked
		const option = parseInt(e.target.getAttribute("value"));
		onGenerate(option);
	}

	const generationOptions = ["DFS Algorithm", "Recursive Division", "Prim's Algorithm"];
	return (
		<section className="control-section">
			<button onClick={onClearCanvas} className="clear-btn">
				Clear
			</button>
			<DropDown title="Maze Generation" options={generationOptions} onOptionClick={handleOptionClick}></DropDown>
		</section>
	);
}

export default ControlSection;
