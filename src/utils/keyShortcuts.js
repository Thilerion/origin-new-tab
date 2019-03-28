export default class Shortcut {
	constructor() {
		this._downKeys = new Set();
		this._lastKey = null;

		this.currentScope = undefined;
		this.listenForKeys = [];

		this.boundDownEventFunction = null;
		this.boundUpEventFunction = null;
	}

	init() {
		this.boundUpEventFunction = this.onKeyUp.bind(this);
		this.boundDownEventFunction = this.onKeyDown.bind(this);

		document.addEventListener('keyup', this.boundUpEventFunction);
		document.addEventListener('keydown', this.boundDownEventFunction);

		return this;
	}

	destroy() {
		console.log('destroying keyboard shortcut listener...');

		document.removeEventListener('keyup', this.boundUpEventFunction);
		document.removeEventListener('keydown', this.boundDownEventFunction);

		return this;
	}

	onKeyDown(e) {
		const key = e.key.toLowerCase();
		
		if (this._lastKey !== key) {
			this._lastKey = key;
			this._downKeys.add(key);
			this.findEvents(e);
		}
	}
	
	onKeyUp(e) {
		const key = e.key.toLowerCase();
		this._downKeys.delete(key);

		if (this._downKeys.size) {
			const last = Array.from(this._downKeys).pop();
			this._lastKey = last;
		} else {
			this._lastKey = null;
		}
	}

	findEvents(e) {
		const keys = Array.from(this._downKeys);
		console.log(keys);

		const bestCommand = this.listenForKeys.find(listener => {
			if (listener.keys.length !== keys.length) return false;
			if (listener.scope !== this.currentScope) return false;
			// TODO: support for shift/alt/ctrl, remove those from _downKeys
			return listener.keys.every(k => keys.includes(k));
		})

		console.log(this.listenForKeys);

		if (bestCommand) {
			bestCommand.fn();
		}
	}

	add({ keys, fn, scope }) {
		const exists = this.listenForKeys.find(listener => {
			if (listener.keys.length !== keys.length) return false;
			if (listener.scope !== scope) return false;
			return listener.keys.every(k => keys.includes(k));
		})

		if (exists) {
			console.warn("This key combination already exists...");
			return;
		}

		this.listenForKeys.push({ keys, fn, scope });
	}

	setScope(scope) {
		this.currentScope = scope;
		return this;
	}
}