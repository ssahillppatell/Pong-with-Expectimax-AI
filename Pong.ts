import { Ball } from "./Ball.js";

export class Pong {
	private _canvas: HTMLCanvasElement;
	private _ctx;
	private ball: Ball;

	constructor(canvas: HTMLCanvasElement) {
		this._canvas = canvas;
		this._ctx = canvas.getContext('2d')!;

		this.ball = new Ball();

		this.ball.getPos().setX(50);
		this.ball.getPos().setY(50);

		this.ball.getVel().setX(100);
		this.ball.getVel().setY(100);

		let lastTime: number;
		const callback = (ms: number) => {
			if(lastTime) {
				this.updateBall((ms - lastTime) / 1000);
			}
			lastTime = ms;
			requestAnimationFrame(callback);
		}
		callback(0);
	}

	updateBall (dt: number): void {
		this.ball.getPos().setX(this.ball.getPos().getX() + (this.ball.getVel().getX() * dt));
		this.ball.getPos().setY(this.ball.getPos().getY() + (this.ball.getVel().getY() * dt));
	
		if(this.ball.getLeft() < 0 || this.ball.getRight() > this._canvas.width) {
			this.ball.getVel().setX(-this.ball.getVel().getX());
		}
	
		if(this.ball.getTop() < 0 || this.ball.getBottom() > this._canvas.height) {
			this.ball.getVel().setY(-this.ball.getVel().getY());
		}
	
		this._ctx.fillStyle = '#fff';
		this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
		this._ctx.fillStyle = '#000'
		this._ctx.fillRect(this.ball.getPos().getX(), this.ball.getPos().getY(), this.ball.getSize().getX(), this.ball.getSize().getY());
	}
}