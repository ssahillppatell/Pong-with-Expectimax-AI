import { Pong } from "./Pong.js";

enum PlayerType {HUMAN, AI};

const canvas = document.getElementById('pong') as HTMLCanvasElement;
const pong = new Pong(canvas);

canvas.addEventListener('mousemove', (e) => {
	pong.getPlayers()[PlayerType.HUMAN].getPos().setY(e.offsetY);
});

canvas.addEventListener('click', (e) => {
	pong.start();
});