import _isEqual from 'lodash.isequal';

export default {
	data() {
		return {
			initialPlaceOnGrid: {
				...this.getWidgetPlaceOnGrid()
			},
			lastMoveDelta: {
				x: null,
				y: null
			}
		}
	},
	methods: {
		hasMoveDeltaChanged(dxGrid, dyGrid) {
			const isInitialMoveState = !dxGrid && !dyGrid && _isEqual(
				this.initialPlaceOnGrid,
				this.getWidgetPlaceOnGrid()
			);
			const equalMoveDelta = (
				dxGrid === this.lastMoveDelta.x &&
				dyGrid === this.lastMoveDelta.y
			);

			if (isInitialMoveState || equalMoveDelta) {
				return false;
			} else {
				this.lastMoveDelta = { x: dxGrid, y: dyGrid };
				return true;
			}
		},
		onMoveStart(e) {
			if (!this.editing) {
				return;
			}
			if (!this.selected) {
				this.$emit('selectWidget', true);
			}

			this.initialPlaceOnGrid = this.getWidgetPlaceOnGrid();

			this.$_moveOrigin = {
				x: e.clientX,
				y: e.clientY
			};
			console.log("Started moving.");

			this.createMoveListeners();
		},
		onMoveUpdate(e) {
			if (!this.editing) {
				this.removeMoveListeners();
				return;
			}

			const dx = e.clientX - this.$_moveOrigin.x;
			const dy = e.clientY - this.$_moveOrigin.y;

			// Snap move amounts to grid
			const dxGrid = this.convertHorPxToGrid(dx);
			const dyGrid = this.convertVerPxToGrid(dy);

			// If no movement is found, don't bother calculating the rest
			if (!this.hasMoveDeltaChanged(dxGrid, dyGrid)) {
				return;
			}

			const clamped = this.validateMoveAmount(dxGrid, dyGrid);
			
			const newPos = {
				x: this.initialPlaceOnGrid.x + clamped.dx,
				y: this.initialPlaceOnGrid.y + clamped.dy
			};

			this.updateWidgetMovement(newPos.x, newPos.y);
		},
		onMoveEnd(e) {
			const { x, y } = this.initialPlaceOnGrid;
			const before = { x, y };
			const after = { x: this.widget.x, y: this.widget.y };
			const delta = { x: after.x - before.x, y: after.y - before.y };

			// only log if changes made
			if (delta.x || delta.y) {
				console.log(`Widget "${this.widget.name}" was moved:`);
				console.table({ before, after, delta });
			} else {
				console.log('Stopped moving.');
			}

			this.onMoveUpdate(e);
			this.removeMoveListeners();
		},

		validateMoveAmount(dxGrid, dyGrid) {
			const dyMin = 1 - this.initialPlaceOnGrid.top;
			const dxMin = 1 - this.initialPlaceOnGrid.left;

			const dyMax = (this.$store.state.grid.rows + 1) - this.initialPlaceOnGrid.bottom;
			const dxMax = (this.$store.state.grid.cols + 1) - this.initialPlaceOnGrid.right;

			const clamped = {};

			if (dxGrid < dxMin) {
				clamped.dx = dxMin;
			} else if (dxGrid > dxMax) {
				clamped.dx = dxMax;
			} else {
				clamped.dx = dxGrid;
			}
			if (dyGrid < dyMin) {
				clamped.dy = dyMin;
			} else if (dyGrid > dyMax) {
				clamped.dy = dyMax;
			} else {
				clamped.dy = dyGrid;
			}

			return clamped;
		},

		createMoveListeners() {
			window.addEventListener('mousemove', this.onMoveUpdate);
			window.addEventListener('mouseup', this.onMoveEnd);
		},
		removeMoveListeners() {
			window.removeEventListener('mousemove', this.onMoveUpdate);
			window.removeEventListener('mouseup', this.onMoveEnd);
		}
	},
	beforeDestroy() {
		this.removeMoveListeners();
	}
}