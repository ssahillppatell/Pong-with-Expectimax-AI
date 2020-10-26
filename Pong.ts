import { Ball } from "./Ball.js";
import { Player } from "./Player.js";
import { Rect } from "./Rect.js";
import { Vector } from "./Vector.js";
import { MyNode } from './MyNode.js';

enum PlayerType {HUMAN, AI};
let crosssedMid: boolean = false;
let hitPosition: number;
let expectedHumanPos: number;
let isCalculated: boolean = false;
let isHit: boolean = false;
let bestShot: number;

const evaluationFunc = (humanYPos: number, nextExpectedPos: number): number => {
	return Math.abs(nextExpectedPos - humanYPos);
}

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
		const callback = (ms: number): void => {
			if(lastTime) {
				this.updateCanvas((ms - lastTime) / 1000);
			}
			lastTime = ms;
			requestAnimationFrame(callback);
		}
		callback(0);
		this.reset();
	}

	collide (player: Player, ball: Ball): void {
		if(player.getLeft() < ball.getRight() && player.getRight() > ball.getLeft() && player.getTop() < ball.getBottom() && player.getBottom() > ball.getTop()) {
			console.log("Hit Pos:", this.ball.getPos().getY())
			ball.getVel().setX(-ball.getVel().getX());
			if(ball.getVel().getX() > 0) {
				crosssedMid = false;
			}
			this.ball.getVel().setX(this.ball.getVel().getX() * 1.1);
			this.players[PlayerType.AI].setPaddleSpeed(this.players[PlayerType.AI].getPaddleSpeed() * 1.05);

			// Randomness Added
			if(ball.getVel().getX() > 0) {
				let newBallVy: number = 0;
				console.log("dist: ", this.players[PlayerType.HUMAN].getTop() - this.ball.getTop());
				if(this.ball.getTop() - this.players[PlayerType.HUMAN].getTop() <= 8) {
					newBallVy = this.ball.getVel().getY() - Math.abs(this.ball.getVel().getY()) * ((Math.random() + 0.5)/10);
					console.log("Collision Type: ", -1);
				} else if(this.ball.getTop() - this.players[PlayerType.HUMAN].getTop() >= 18) {
					newBallVy = this.ball.getVel().getY() + Math.abs(this.ball.getVel().getY()) * ((Math.random() + 0.5)/10);
					console.log("Collision Type: ", 1);
				} else {
					newBallVy = this.ball.getVel().getY() * 1.03;
					console.log("Collision Type: ", 0);
				}
				
				this.ball.getVel().setY(newBallVy);
				isCalculated = false;
			}

			if(ball.getVel().getX() < 0) {
				let newBallVy = 0;
				if(this.ball.getTop() - this.players[PlayerType.AI].getTop() <= 8) {
					newBallVy = this.ball.getVel().getY() + Math.abs(this.ball.getVel().getY()) * (Math.random()/10);
					console.log("Collision Type: ", -1);
				} else if(this.ball.getTop() - this.players[PlayerType.AI].getTop() >= 18) {
					newBallVy = this.ball.getVel().getY() - Math.abs(this.ball.getVel().getY()) * (Math.random()/10);
					console.log("Collision Type: ", 1);
				} else {
					console.log("Collision Type: ", 0);
					newBallVy = this.ball.getVel().getY() * 1.03;
				}

				this.ball.getVel().setY(newBallVy);
				isHit = false;
			}
		}
	}

	draw (): void {
		this._ctx.fillStyle = '#fff';
		this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
		
		this._ctx.fillStyle = '#000';
		this._ctx.fillRect(this._canvas.width / 2, 0, 1, this._canvas.height);

		this.drawRect(this.ball);
		this.players.forEach((player: Player) => this.drawRect(player));
	}

	drawRect (rect: Rect): void {
		this._ctx.fillStyle = '#000'
		this._ctx.fillRect(rect.getLeft(), rect.getTop(), rect.getSize().getX(), rect.getSize().getY());
	}

	reset (): void {
		this.ball.getPos().setX(this._canvas.width / 2);
		this.ball.getPos().setY(this._canvas.height / 2);

		this.ball.getVel().setX(0);
		this.ball.getVel().setY(0);

		this.players.forEach((player) => {
			player.getPos().setY(this._canvas.height / 2);
			player.setPaddleSpeed(150);
		});
	}

	start (): void {
		console.clear();
		if(this.ball.getVel().getX() == 0 && this.ball.getVel().getY() == 0) {
			this.ball.getVel().setX(-200);

			let yDirection = Math.random() - 0.5;
			let yVelocity = 150 + Math.abs(yDirection * 50);
			this.ball.getVel().setY(yDirection > 0 ? yVelocity : -yVelocity);
		}
	}

	updateCanvas (dt: number): void {
		this.ball.getPos().setX(this.ball.getPos().getX() + (this.ball.getVel().getX() * dt));
		this.ball.getPos().setY(this.ball.getPos().getY() + (this.ball.getVel().getY() * dt));
	
		// Points Logic
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
	
		// Deflect ball from canvas
		if(this.ball.getTop() < 0 || this.ball.getBottom() > this._canvas.height) {
			this.ball.getVel().setY(-this.ball.getVel().getY());
		}

		// Logic
		if(this.ball.getPos().getX() >= this._canvas.width / 2 && this.ball.getVel().getX() > 0) {
			const timeToHit = 375 / this.ball.getVel().getX();
			let humanPos: Vector;

			if(!crosssedMid) {
				hitPosition = this.ball.getPos().getY() + timeToHit * this.ball.getVel().getY();
				hitPosition = hitPosition > 0 ? hitPosition > 450 ? 900 - hitPosition : hitPosition : Math.abs(hitPosition);
				console.log("Expected Hit position: ", hitPosition);

				humanPos = this.players[PlayerType.HUMAN].getPos();

				crosssedMid = true;				
			}

			if(Math.abs(hitPosition! - (this.players[PlayerType.AI].getTop() + this.players[PlayerType.AI].getBottom()) / 2) > 9) {	
				if(hitPosition! <= this.players[PlayerType.AI].getPos().getY()) {
					this.players[PlayerType.AI].getPos().setY(this.players[PlayerType.AI].getPos().getY() -  this.players[PlayerType.AI].getPaddleSpeed() * dt);
				} else if(hitPosition! >= this.players[PlayerType.AI].getPos().getY()) {
					this.players[PlayerType.AI].getPos().setY(this.players[PlayerType.AI].getPos().getY() +  this.players[PlayerType.AI].getPaddleSpeed() * dt);
				}
			}
			
			let myNode: MyNode = new MyNode(0);

			if(crosssedMid && this.ball.getVel().getX() > 0 && !isCalculated) {
				const newTimeToHit: number = 750 / this.ball.getVel().getX();
				expectedHumanPos = newTimeToHit * this.ball.getVel().getY();
				expectedHumanPos = expectedHumanPos > 0 ? expectedHumanPos > 450 ? 900 - expectedHumanPos : expectedHumanPos : Math.abs(expectedHumanPos);
				myNode.addChild(new MyNode(evaluationFunc(humanPos!.getY(), expectedHumanPos)));
				
				expectedHumanPos = newTimeToHit * (this.ball.getVel().getY() + Math.abs(this.ball.getVel().getY()) * (Math.random()/10));
				expectedHumanPos = expectedHumanPos > 0 ? expectedHumanPos > 450 ? 900 - expectedHumanPos : expectedHumanPos : Math.abs(expectedHumanPos);
				myNode.addChild(new MyNode(evaluationFunc(humanPos!.getY(), expectedHumanPos)));

				expectedHumanPos = newTimeToHit * (this.ball.getVel().getY() - Math.abs(this.ball.getVel().getY()) * (Math.random()/10));
				expectedHumanPos = expectedHumanPos > 0 ? expectedHumanPos > 450 ? 900 - expectedHumanPos : expectedHumanPos : Math.abs(expectedHumanPos);
				myNode.addChild(new MyNode(evaluationFunc(humanPos!.getY(), expectedHumanPos)));

				bestShot = myNode.getMax().index;
				isCalculated = true;
			}

			if(crosssedMid && 775 - this.ball.getPos().getX() >= 3 && 775 - this.ball.getPos().getX() <= 12 && !isHit) {
				if(bestShot == 1) {
					this.players[PlayerType.AI].getPos().setY(this.players[PlayerType.AI].getPos().getY() + 8);
				} else if(bestShot == 2) {
					this.players[PlayerType.AI].getPos().setY(this.players[PlayerType.AI].getPos().getY() - 8);
				}

				isHit = true;
			}
		}
				
		// Collision check
		this.players.forEach((player: Player) => {
			return this.collide(player, this.ball);
		});

		this.draw();
	}

	getPlayers (): Player[] {
		return this.players;
	}
}