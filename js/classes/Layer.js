function Layout()
{
	"use strict";
	this.active = true;
	this.layers = new Array();
	this.AddObjet = function(layername, object)
	{
		for (var v = 1, l1 = arguments.length ; v < l1; v++)
		{
			if (arguments[v] instanceof Array)
				for (var i = 0, l2 = arguments[v].length; i < l2; i++)
					this.layers[layername].AddObjet(arguments[v][i])
				else
					this.layers[layername].AddObjet(arguments[v])
		}
	}
		this.SetActive = function(true_or_false)
		{//console.log("Layout : " + this.active);
		for(var v in this.layers)
			this.layers[v].SetActive(true_or_false);
		this.active = true_or_false;
	}
	this.Draw = function()
	{
		for (var v in this.layers)
			this.layers[v].Draw();
	}
	//params sous la forume d'un dictionaire : {layername : ... , z : , opacity : , bgcolor : , x : , y : , w : , h : }
	this.AddLayer = function(params)
	{
		"use strict";
		var canv = document.createElement('canvas');
		canv.id = params['layername'];
		canv.style.cssText = "position: absolute; opacity: " + params['opacity'] + "; z-index:"+ z +"; background-color:" + params['bgcolor'] + "; left:" + params['x'] + "px; top: " + params['y'] + "px;";
		canv.width = params['w'];
		canv.height = params['h'];
		canv.left = params['x'];
		canv.top = params['y'];
		document.getElementById("canvas").appendChild(canv);
		var canvas = document.getElementById(canv.id);
		var layer = new Layer(canvas.getContext('2d'));
		this.layers[canv.id] = layer;
	}
}
//Debug : console.log("x cmp : "+x+"y cmp : " +y + "\nName :" +v+ "\nobject x : " + child.objects[v].x+ "\nobject y : " +child.objects[v].y+ "\nobject x + width :" + (child.objects[v].x + child.objects[v].width)+ "\n object y + height :" +(child.objects[v].y + child.objects[v].height + "\ny > child.objects[v].y && y < child.objects[v].y + child.objects[v].height && x > child.objects[v].x && x < child.objects[v].x + child.objects[v].width"))
function Layer(contener,id, w, h, z)
{
	var canv = document.createElement('canvas');
	canv.style.cssText = "z-index:"+ z;
	canv.id = id;
	canv.width = w;
	canv.height = h;
	this.width = w;
	this.height = h;
	document.getElementById(contener).appendChild(canv);
	this.canvas = document.getElementById(canv.id);
	this.ctx = this.canvas.getContext('2d');
	this.active = true;
	this.objects = new Array();
	this.AddObjet = function(object)
	{
		object.ctx = this.ctx;
		this.objects.push(object);
		return (object);
	}
	this.SetActive = function(true_or_false)
	{
		for (var v in this.objects)
			this.objects[v].active = true_or_false;
		this.active = true_or_false;
		this.canvas.style.opacity = 1 * true_or_false;

	}
	this.Draw = function()
	{		//console.log("DRAW :")
		for (var v in this.objects){
		//	console.log("object :")
		//	console.log(this.objects[v])
			this.objects[v].Draw();
		}
	}
	var child = this;
	this.canvas.onclick = function(e)
	{
	//	console.log(child.active);
		if (!child.active)
			return;
		var x = e.pageX - this.offsetLeft, y = e.pageY - this.offsetTop;
		for (var v in child.objects)
			if (y > child.objects[v].y && y < child.objects[v].y + child.objects[v].height
				&& x > child.objects[v].x && x < child.objects[v].x + child.objects[v].width) {
				child.objects[v].e();
		}
	}
	this.Clear = function()
	{
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}