function Sprite(name, x , y, categorie)
{
	"use strict";
	this.name = name;
	this.ctx;
	this.posx = x; //coordonee sur la map
	this.posy = y; //idem
	this.x = x;
	this.y = y;
	this.z;
	this.direction;
	this.current_anim = "bad_down";
	this.anim_speed = 50;
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

			var width = images[that.name + "_" + that.current_anim].naturalWidth;
			var height = images[that.name + "_" + that.current_anim].naturalHeight;
			var nb_frame = width / height;
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
		console.log(this.name + this.posx + ", " + this.posy);
		if (this.anim_isplay = true)
		{
			var height = images[that.name + "_" + that.current_anim].naturalHeight;
			var centering = height * (2/8)
			//console.log(this.current_anim)
			//putimage(this.ctx, this.name + "_" + this.current_anim, this.posx * tile_size, this.posy * tile_size, tile_size, tile_size);
			this.ctx.drawImage(
				images[this.name + "_" + this.current_anim],
				this.anim_index * height, 0,
				height, height,
				this.posx * tile_size - centering + this.movex , this.posy * tile_size - centering  + this.movey,
				height, height);
		}
		else
			putimage(this.ctx, this.anime_frame, this.posx * tile_size, this.posy * tile_size, tile_size, tile_size);
	}
	this.movex = 0;
	this.movey = 0;
	this.prevx = 0;
	this.prevy = 0;
    var move_interval_id;
	this.Move = function(x, y, time) {
		clearInterval(move_interval_id)
		that.posy = Math.round(((that.posy * tile_size) + that.movey) / tile_size);
		that.posx = Math.round(((that.posx * tile_size) + that.movex) / tile_size);
		that.movex = 0;
		that.movey = 0;
        var step = time / 25;
        var count = 0;
       	move_interval_id = setInterval(function() {
            that.movex += (x - that.posx * tile_size) / step;
            that.movey += (y - that.posy * tile_size) / step;
				//		console.log(that);

            count++;
            if (count == step) {
                clearInterval(move_interval_id)
                that.posy = Math.round(((that.posy * tile_size) + that.movey) / tile_size);
                that.posx = Math.round(((that.posx * tile_size) + that.movex) / tile_size);
                that.movex = 0;
                that.movey = 0;
            }
        }, 25);
    }
	this.Clear = function()
	{
			this.ctx.clearRect(this.posx * 32, this.posy * 32, 32, 32);
	}
	return (this);
}
