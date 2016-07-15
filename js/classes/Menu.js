function Hud(ctx)
{
	"use strict";
	this.elemLeft = ctx.canvas.offsetLeft;
	this.elemTop = ctx.canvas.offsetTop;
	this.elements = new Array();
	this.addElement = function(elem)
	{
		this.elements.push(elem);
	}
	this.Draw = function(ctx)
	{
		for (var i = 0, l = this.elements.length ; i < l ; i++)
			this.elements[i].Draw(ctx);
	}
}

function button_arrow(x, y, w, h, angle, funct)
{
	"use strict";
	this.active = true;
	this.ctx;
	this.name = name;
	this.width = w;
	this.height = h;
	this.x = x;
	this.y = y;
	this.e = funct;
	this.angle = angle;
	this.Draw = function()
	{
		putimage(this.ctx, "images/buttons/arrow.gif", this.x, this.y, this.width, this.height, this.angle);
	}
}

function button_text(name, x, y, color, px, font, funct)
{
	"use strict";
	this.ctx;
	this.name = name;
	this.x = x;
	this.y = y;
	this.e = funct;
	this.active = true;
	this.Draw = function()
	{
		this.ctx.fillStyle = color;
		this.ctx.font = px + "px " + font;
		this.width = this.ctx.measureText(name).width + px *0.25;
		this.height = px;
		this.ctx.fillText(name, x, y + this.height * 0.75);
	}
}