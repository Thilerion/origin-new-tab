import { createUID } from '@/utils/uid';

export default class WidgetDisplaySetting {
	constructor({
		name,
		uid,
		x,
		y,
		width,
		height,
		alignX,
		alignY
	}) {
		this.name = name;
		this.uid = uid;

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.alignX = alignX;
		this.alignY = alignY;
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

	validateAlignment(conf) {
		if (!this.alignX) {
			// use widget default alignment
			this.alignX = conf.alignX || conf.alignXDefault;
		}
		if (!this.alignY) {
			this.alignY = conf.alignY || conf.alignYDefault;
		}
		// TODO: different alignment options per widget
		return conf.alignXOptions.includes(this.alignX) && conf.alignYOptions.includes(this.alignY);
	}

	validateUID() {
		if (this.uid == null) {
			console.log(`No UID detected in ${this.name}`);
			this.uid = createUID(this.name);
		}
		return true;
	}

	validateSettings(componentConfig, globalConfig = {}) {
		// override globalConfig with component-specific config
		const conf = { ...globalConfig, ...componentConfig };

		return (
			this.validateUID() &&
			this.validateWidth(conf) &&
			this.validateHeight(conf) &&
			this.validateX(conf) &&
			this.validateY(conf) &&
			this.validateAlignment(conf) &&
			this.data
		);		
	}

	get data() {
		return JSON.parse(JSON.stringify(this));
	}
};