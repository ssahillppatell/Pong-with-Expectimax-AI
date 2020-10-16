export class Vector {
	private x: number;
	private y: number;
	private len: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
		this.len = Math.sqrt(this.x * this.x + this.y * this.y);
	}

	getX (): number {
		return this.x;
	}

	getY (): number {
		return this.y;
	}

	setX (x: number): void {
		this.x = x
	}

	setY (y: number): void {
		this.y = y
	}

	getLen() : number {
		return this.len;
	}
}