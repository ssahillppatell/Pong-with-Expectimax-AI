import { Vector } from "./Vector.js";

export class Rect {
	private w: number;
	private h: number;
	private pos: Vector;
	private size: Vector;

	constructor(w: number, h: number) {
		this.w = w;
		this.h = h;
		this.pos = new Vector();
		this.size = new Vector(this.w, this.h)
	}

	getPos (): Vector {
		return this.pos;
	}

	getSize (): Vector {
		return this.size;
	}

	getLeft (): number {
		return this.pos.getX() - this.size.getX() / 2;
	}

	getRight (): number {
		return this.pos.getX() + this.size.getX() / 2;
	}

	getTop (): number {
		return this.pos.getY() - this.size.getY() / 2;
	}

	getBottom (): number {
		return this.pos.getY() + this.size.getY() / 2;
	}
}