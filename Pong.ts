import { Ball } from "./Ball.js";
import { Player } from "./Player.js";
import { Rect } from "./Rect.js";

enum PlayerType {HUMAN, AI};

export class Pong {
	private _canvas: HTMLCanvasElement;
	private _ctx;
	private ball: Ball;
	private players: Player[];

	constructor(canvas: HTMLCanvasElement) {
		this._canvas = canvas;
		this._ctx = canvas.getContext('2d')!;

		this.ball = new Ball();

		this.players = [
			new Player,
			new Player
		];

		this.players[PlayerType.HUMAN].getPos().setX(20);
		this.players[PlayerType.AI].getPos().setX(this._canvas.width - 20);
		this.players.forEach((player: Player) => {
			player.getPos().setY(this._canvas.height / 2);
		});

		let lastTime: number;
		const callback = (ms: number) => {
			if(lastTime) {
				this.updateCanvas((ms - lastTime) / 1000);
			}
			lastTime = ms;
			requestAnimationFrame(callback);
		}
		callback(0);
		this.reset();
	}

	collide (player: Player, ball: Ball) {
		if(player.getLeft() < ball.getRight() && player.getRight() > ball.getLeft() && player.getTop() < ball.getBottom() && player.getBottom() > ball.getTop()) {
			ball.getVel().setX(-ball.getVel().getX());
		}
	}

	draw (): void {
		this._ctx.fillStyle = '#fff';
		this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

		this.drawRect(this.ball);
		this.players.forEach((player: Player) => this.drawRect(player));
	}

	drawRect (rect: Rect): void {
		this._ctx.fillStyle = '#000'
		this._ctx.fillRect(rect.getLeft(), rect.getTop(), rect.getSize().getX(), rect.getSize().getY());
	}

	reset () {
		this.ball.getPos().setX(this._canvas.width / 2);
		this.ball.getPos().setY(this._canvas.height / 2);

		this.ball.getVel().setX(0);
		this.ball.getVel().setY(0);
	}

	start () {
		if(this.ball.getVel().getX() == 0 && this.ball.getVel().getY() == 0) {
			this.ball.getVel().setX(-200);

			let yDirection = Math.random() - 0.5;
			let yVelocity = 150 + Math.abs(yDirection * 100);
			this.ball.getVel().setY(yDirection > 0 ? yVelocity : -yVelocity);
		}
	}

	updateCanvas (dt: number): void {
		this.ball.getPos().setX(this.ball.getPos().getX() + (this.ball.getVel().getX() * dt));
		this.ball.getPos().setY(this.ball.getPos().getY() + (this.ball.getVel().getY() * dt));
	
		if(this.ball.getLeft() < 0 || this.ball.getRight() > this._canvas.width) {
			let playerId;
			if(this.ball.getVel().getX() < 0) {
				playerId = PlayerType.AI;
			} else {
				playerId = PlayerType.HUMAN;	
			}

			this.players[playerId].setScore(1);
			console.log(playerId ? "AI Won" : "Human Won");
			this.reset();
		}
	
		if(this.ball.getTop() < 0 || this.ball.getBottom() > this._canvas.height) {
			this.ball.getVel().setY(-this.ball.getVel().getY());
		}

		this.players[PlayerType.AI].getPos().setY(this.ball.getPos().getY());
		this.players.forEach((player: Player) => {
			return this.collide(player, this.ball);
		});

		this.draw();
	}

	getPlayers (): Player[] {
		return this.players;
	}
}