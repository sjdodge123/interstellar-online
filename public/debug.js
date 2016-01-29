"use strict";
var debugActive = false,
	overLay;

class Overlay {
	constructor (x,y,width,height,color) {
		this.width = width;
		this.height = height;
		this.color = color;
		this.x = x;
		this.y = y;
	}
	draw() {
		ctx.globalAlpha=0.4;
		drawRect(this.x,this.y,this.width,this.height,this.color);
		ctx.globalAlpha=1;
	}
	update() {
		this.draw();
	}
}
function debugOverlay(){
	if(!debugActive){
		var framesPerSecond = 1000/30;
		overLay = new Overlay(100,100,500,400,'white');
		debugActive = true;
		gameObjectList.push(overLay);
		//window.addEventListener("keydown", debugHotkeys, false);
	} else {
		debugActive = false;
		gridOn = false;
		gameObjectList.splice(gameObjectList.indexOf(overLay),1);
		overLay = null;
	}
}

function debugClick(evt){
	//FIND WHICH OBJECT WAS CLICKED AND DISPLAY INFORMATION ABOUT THE OBJECT
	//var result = gameObjectList.checkCollide(mouseX,mouseY);
	//if(result.hit){
	//	display(result.object.stats);
	//};
}