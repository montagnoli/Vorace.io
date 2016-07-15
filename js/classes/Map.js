function Map(ctx)
{
	this.field =[[]];

	this.Draw = function(context)
	{
		var textures = {
			"1" : "floor",
			"0": "wall",
			"2" : "fspawn",
			"3" : "floor",
			"9" : "floor"
			};
			var key;
		//affichage du terrain
		for (y = 0, ly = this.field.length; y < ly; y++)
			for (x = 0, lx = (this.field[y]).length; x < lx; x++)
			{
				key = this.field[y][x];
				putimage(context, textures[key], 32 * x, 32 * y, 32, 32);
			}
	}
}
