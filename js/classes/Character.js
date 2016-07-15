function Character(name, playerid)
{
	"use strict";
	this.Name = name;
	this.ctx;
	this.movept;
	this.posx; //coordonee sur la map
	this.posy; //idem
	this.PlayerId = playerid
	this.SetPos = function(x, y)
	{
		this.posx = x;
		this.posy = y;
	}
		// Chargement de l'image dans l'attribut image
	this.Draw = function()
	{
		var sqr_x = 100;
		var sqr_y = 100;
		putimage(this.ctx,
				"images/char/" + name + "/normal.gif",
				this.posx * sqr_x - 100, //retourne la position pour etre en bas a gauche
				this.posy * sqr_y - 100,//idem
				100,
				100);
	}
	this.Move = function(str)
	{
		this.ctx.clearRect(this.posx *100-100, this.posy*100-100, 100, 100);
		if (str == 0)
			this.posy--;
		if (str === 1)
			this.posx++;
		if (str == 2)
			this.posy++;
		if (str === 3)
			this.posx--;
		this.Draw(this.ctx);
	}
}

function Sprite(name, x , y, categorie)
{
	"use strict";
	this.name = name;
	this.ctx;
	this.posx; //coordonee sur la map
	this.posy; //idem
	this.x = x;
	this.y = y;
	this.z;
	this.direction;
	this.current_anim = "e";
	this.anim_speed = 100;
	this.anim_frame;
	this.anim_index = 0;
	this.cat = categorie;
	this.interval_id;
	this.SetPos = function(x, y)	{
		this.posx = x;
		this.posy = y;
	}
	var that = this; //Je suis amoureux de ce truc. (this n'est pas visible depuis les callback )
	this.Anim_start = function()
	{
		that.anim_isplay == true;
		that.interval_id = setInterval(function () {
			if (!images[that.name + "_" + that.current_anim + "_" + that.anim_index])
				that.anim_index = 0;
			that.anime_frame = that.name + "_" + that.current_anim + "_" + that.anim_index;
			that.anim_index++;
			that.Draw();
		}, that.anim_speed);
	}
	this.Anim_stop = function()
	{
		clearInterval(this.interval_id);
		this.anim_isplay = false;
	}
		// Chargement de l'image dans l'attribut image
	this.Draw = function(ctx, x, y)	{
		if (ctx)
			putimage(ctx, this.anime_frame, this.posx * tile_size, this.posy * tile_size, tile_size, tile_size);
		else
			putimage(this.ctx, this.anime_frame, this.posx * tile_size, this.posy * tile_size, tile_size, tile_size);
	}
	this.Move = function(x, y, time)	{
		var prevx = that.posx;
		var prevy = that.posy;
		function step(timestamp) {
		  if (!start) start = timestamp;
		  var progress = timestamp - start;
		  that.posx = Math.min(progress/prevx, x);
		  that.posy = Math.min(progress/prevx, y);
		  if (progress < time * refresh_rate) {
			window.requestAnimationFrame(step);
		  }
		}


	}
	return (this);
}




