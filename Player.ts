import { Rect } from "./Rect.js";

export class Player extends Rect {
	private score: number;
	private paddleSpeed: number;

	constructor () {
		super(5, 25);
		this.score = 0;
		this.paddleSpeed = 150;
	}

	getScore (): number {
		return this.score;
	}

	setScore (score: number): void {
		this.score = score;
	}

	getPaddleSpeed (): number {
		return this.paddleSpeed;
	}

	setPaddleSpeed (speed: number): void {
		this.paddleSpeed = speed;
	}
}