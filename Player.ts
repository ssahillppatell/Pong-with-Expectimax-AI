import { Rect } from "./Rect.js";

export class Player extends Rect {
	private score: number;

	constructor () {
		super(5, 25);
		this.score = 0;
	}

	getScore (): number {
		return this.score;
	}

	setScore (score: number): void {
		this.score = score;
	}
}