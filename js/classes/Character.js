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
	this.current_anim = "bad_down";
	this.anim_speed = 25;
	this.anim_frame;
	this.anim_index = 0;
	this.cat = categorie;
	this.interval_id;
	this.anim_isplay = true;
	this.SetPos = function(x, y)	{
		this.posx = x;
		this.posy = y;
	}
	var that = this; //Je suis amoureux de ce truc. (this n'est pas visible depuis les callback )
	this.Anim_start = function()
	{
		that.anim_isplay == true;
		that.interval_id = setInterval(function () {

			var width = images[that.name + "_" + that.current_anim].naturalWidth
			var nb_frame = width / 64;
			if (that.anim_index >= nb_frame - 1)
				that.anim_index = -1;
	//		that.anim_frame = images[that.name + "_" + that.current_anim];
			that.anim_index++;
			//console.log(this.anim_index);
		}, that.anim_speed);
	}
	this.Anim_stop = function()
	{
		clearInterval(this.interval_id);
		this.anim_isplay = false;
	}
		// Chargement de l'image dans l'attribut image
	this.Draw = function(params)	{
		if (this.anim_isplay = true)
		{
			//console.log(this.current_anim)
			//putimage(this.ctx, this.name + "_" + this.current_anim, this.posx * tile_size, this.posy * tile_size, tile_size, tile_size);
			this.ctx.drawImage(
				images[this.name + "_" + this.current_anim],
				this.anim_index * 64, 0,
				64, 64,
				this.posx * tile_size - 48 + this.movex , this.posy * tile_size - 48  + this.movey,
				128, 128);
		}
		else
			putimage(this.ctx, this.anime_frame, this.posx * tile_size, this.posy * tile_size, tile_size, tile_size);
	}
	this.movex = 0;
	this.movey = 0;
	this.prevx = 0;
	this.prevy = 0;
	
	this.Move = function(x, y, time)
	{
		this.prevx = this.posx;
		this.prevy = this.posy;
		var move_interval_id;
		var step = time / 25;
		var count = 0;
		var move_interval_id = setInterval(function () {
			that.movex += (that.posx - x)  / step;
			that.movey += (that.posy - y)  / step;
			count++;
			if (count == step)
			{
				clearInterval(move_interval_id)
				that.posy = y;
				that.posx = x;
			}
	}, 25);
	}
	return (this);
}




