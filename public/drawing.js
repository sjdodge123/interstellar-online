function clearBackground() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawRect(0,0,canvas.width,canvas.height,'black');
}

function drawRect(x,y,width,height,color) {
	ctx.fillStyle = color;
	ctx.fillRect(x,y,width,height);
}