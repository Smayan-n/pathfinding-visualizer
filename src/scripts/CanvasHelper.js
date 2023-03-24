//this is a class that can be used to simplify the drawing and animating of shapes on a HTML canvas

class SimpleCanvas {
	constructor(canvasContext) {
		//canvas this.ctx
		this.ctx = canvasContext;
	}

	line(x1, y1, x2, y2, width = 4, color = "white") {
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = width;

		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	//draws circle
	circle(x, y, radius, text = "", color = "white") {
		this.ctx.fillStyle = color;
		this.ctx.strokeStyle = color;
		// this.ctx.strokeWidth = 1;

		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();

		this.ctx.font = `bold ${radius / 2}px Arial`;
		//center text
		this.ctx.textAlign = "center";
		this.ctx.textBaseLine = "middle";
		this.ctx.fillStyle = "black";
		this.ctx.fillText(text, x, y + 5);
		this.ctx.closePath();
	}

	rect(x, y, width, height, text = "", color = "white", fill = true) {
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.strokeStyle = color;

		if (fill) {
			this.ctx.fillRect(x, y, width, height);
			this.ctx.fill();
		} else {
			this.ctx.rect(x, y, width, height);
		}
		this.ctx.stroke();

		this.ctx.font = "bold 24px Arial";
		//center text
		this.ctx.textAlign = "center";
		this.ctx.textBaseLine = "middle";
		this.ctx.fillStyle = "red";
		this.ctx.fillText(text, width / 2 + x, height / 2 + y + 8);
		this.ctx.closePath();
	}
}

export { SimpleCanvas };
