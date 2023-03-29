import "../styles/ControlSection.css";

function ControlSection(props) {
	const { onClearCanvas, onGenerate } = props;
	return (
		<section className="control-section">
			<button onClick={onClearCanvas} className="clear-btn">
				Clear
			</button>
			<button onClick={onGenerate}>Generate</button>
		</section>
	);
}

export default ControlSection;
