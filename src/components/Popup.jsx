import React from "react";
import Modal from "react-modal";
import "../styles/Popup.css";

// CSS styles for the modal
const modalStyles = {
	overlay: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	content: {
		position: "absolute",
		top: "20%",
		left: "20%",
		right: "20%",
		bottom: "20%",
		border: "1px solid #ccc",
		background: "#fff",
		overflow: "auto",
		WebkitOverflowScrolling: "touch",
		borderRadius: "4px",
		outline: "none",
		padding: "20px",
		color: "black",
	},
};

// The Popup component
const Popup = ({ isOpen, onClose }) => {
	return (
		<Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyles} contentLabel="Instructions">
			<section className="popup">
				<h2>Instructions</h2>
				<p>Step 1: Lorem ipsum dolor sit amet.</p>
				<p>Step 2: Consectetur adipiscing elit.</p>
				<p>Step 3: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
				<button onClick={onClose}>Close</button>
			</section>
		</Modal>
	);
};

export default Popup;
