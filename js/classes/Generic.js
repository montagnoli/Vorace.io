function putimage(ctx, path, x, y, nx, ny, angle)
{
	"use strict";
	var image = new Image;
	if (path[0] != '/') //detect si le path indique une image load avec create_img
	 {
		image = images[path];
		if (angle)
		{
			ctx.save();
			ctx.translate(x, y);
			ctx.translate(nx/2, ny/2);
			ctx.rotate(angle * (0.01745329251));
			ctx.drawImage(image, -(nx/2), -(ny/2), nx, ny);
			ctx.restore();
		}
		else
		 ctx.drawImage(image, x, y, nx, ny);
	}
	else {
	image = new Image();
	image.src = path;
	}
	image.onload = function() {
			if (angle)
			{
				ctx.save();
				ctx.translate(x, y);
				ctx.translate(nx/2, ny/2);
				ctx.rotate(angle * (0.01745329251));
				ctx.drawImage(image, -(nx/2), -(ny/2), nx, ny);
				ctx.restore();
			}
			else
				ctx.drawImage(image, x, y, nx, ny);
		}
}

