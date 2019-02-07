export default function movable({
	isMovable = true
}) {
	return {
		data() {
			return {
				moveDelta: {
					x: 0,
					y: 0
				}
			}
		},
		beforeDestroy() {
			this.removeMoveListeners();
		},
		computed: {
			maxDeltaX() {
				return (this.gridSize.x + this.gridSize.width) - (this.widgetPos.x + this.widgetPos.width);
			},
			minDeltaX() {
				return -(this.widgetPos.x - this.gridSize.x);
			},
			maxDeltaY() {
				return (this.gridSize.y + this.gridSize.height) - (this.widgetPos.y + this.widgetPos.height);
			},
			minDeltaY() {
				return -(this.widgetPos.y - this.gridSize.y);
			},

			trueMoveDeltaX() {
				if (this.moveDelta.x < 0) {
					return Math.max(this.moveDelta.x, this.minDeltaX);
				} else if (this.moveDelta.x > 0) {
					return Math.min(this.moveDelta.x, this.maxDeltaX);
				}
				return 0;
			},
			trueMoveDeltaY() {
				if (this.moveDelta.y < 0) {
					return Math.max(this.moveDelta.y, this.minDeltaY);
				} else if (this.moveDelta.y > 0) {
					return Math.min(this.moveDelta.y, this.maxDeltaY);
				}
				return 0;
			},
			trueMoveRows() {
				return Math.round(this.trueMoveDeltaY / this.cellSize.height);
			},
			trueMoveCols() {
				return Math.round(this.trueMoveDeltaX / this.cellSize.width);
			},
			trueMove() {
				return {
					x: this.trueMoveCols,
					y: this.trueMoveRows
				}
			}
		},
		methods: {
			onMoveStart(e) {
				this.$_moveOrigin = {
					x: e.clientX,
					y: e.clientY
				};
				console.log('on move start from origin:', this.$_moveOrigin);
				this.addMoveListeners();
			},
			onMoveUpdate(e) {
				const dx = e.clientX - this.$_moveOrigin.x;
				const dy = e.clientY - this.$_moveOrigin.y;
				this.moveDelta = {
					x: dx,
					y: dy
				}
			},
			onMoveEnd(e) {
				this.onMoveUpdate(e);
				this.removeMoveListeners();
				console.log(`Total amount moved was: `, { ...this.moveDelta });
				this.moveDelta = {
					x: 0,
					y: 0
				}
				this.getWidgetSize();
			},

			addMoveListeners() {
				window.addEventListener('mousemove', this.onMoveUpdate);
				window.addEventListener('mouseup', this.onMoveEnd);
			},

			removeMoveListeners() {
				window.removeEventListener('mousemove', this.onMoveUpdate);
				window.removeEventListener('mouseup', this.onMoveEnd);
			}
		},
		watch: {
			trueMove(newValue, oldValue) {
				if (newValue.x === oldValue.x && newValue.y === oldValue.y) {
					return;
				}
				this.updateWidgetGridPosition(newValue);
			}
		}
	}
}