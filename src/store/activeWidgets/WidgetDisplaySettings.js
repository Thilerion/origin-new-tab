export default class WidgetDisplaySetting {
	constructor({
		name,
		x,
		y,
		width,
		height
	}) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	// Checks if the widget name is a widget that is registered in the app
	validateName(components = []) {
		const validComponent = components.includes(this.name);
		if (!validComponent) return { validComponent, name: null };
		else return {
			validComponent,
			name: this.name
		};
	}

	// Validate min and max width (if the widget has those properties)
	validateWidth(conf) {
		let validMax = true;
		let validMin = true;
		if (conf.maxWidth != null) {
			validMax = this.width <= conf.maxWidth;
		}
		if (conf.minWidth != null) {
			validMin = this.width >= conf.minWidth;
		}
		return validMax && validMin;
	}

	// Validate min and max height (again, if widget has those properties)
	validateHeight(conf) {
		let validMax = true;
		let validMin = true;
		if (conf.maxHeight != null) {
			validMax = this.height <= conf.maxHeight;
		}
		if (conf.minHeight != null) {
			validMin = this.height >= conf.minHeight;
		}
		return validMax && validMin;
	}

	// Validate grid-row-start, starting at 1-index
	validateX(conf) {
		return this.x >= 1 && (conf.columns == null || this.x < conf.columns);
	}

	// Validate grid-column-start, starting at 1-index
	validateY(conf) {
		return this.y >= 1 && (conf.rows == null || this.y < conf.rows);
	}

	validateSettings(componentConfig, globalConfig = {}) {
		// override globalConfig with component-specific config
		const conf = { ...globalConfig, ...componentConfig };

		return (
			this.validateWidth(conf) &&
			this.validateHeight(conf) &&
			this.validateX(conf) &&
			this.validateY(conf) &&
			this.data
		);		
	}

	get data() {
		return JSON.parse(JSON.stringify(this));
	}
};