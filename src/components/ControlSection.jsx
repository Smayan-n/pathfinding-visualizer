import "../styles/ControlSection.css";

function ControlSection(props) {
	const { onClearCanvas } = props;
	return (
		<section className="control-section">
			<button onClick={onClearCanvas} className="clear-btn">
				Clear
			</button>
		</section>
	);
}

export default ControlSection;
