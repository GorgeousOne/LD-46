class UI {

	constructor() {
		this.buttons = [];
	}

	addButtons(button) {
		this.buttons.push(button);
	}

	onMouseClick() {
		this.buttons.forEach(button => {
			if (button.bounds.contains(mouseX, mouseY))
				button.onClick();
		});
	}

	onMouseMove() {
		this.buttons.forEach(button => button.isHovered = button.bounds.contains(mouseX, mouseY));
	}

	display() {
		this.buttons.forEach(button => button.display());
	}
}