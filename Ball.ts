import { Rect } from "./Rect.js";
import { Vector } from "./Vector.js";

export class Ball extends Rect {
	private vel: Vector;

	constructor () {
		super(5, 5)
		this.vel = new Vector();
	}

	getVel (): Vector {
		return this.vel;
	}
}