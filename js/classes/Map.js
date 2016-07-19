function Map(ctx) {
    this.field = [
        []
    ];

    this.Draw = function(context) {
        var textures = {
            "1": "floor",
            "0": "wall",
            "2": "fspawn",
            "3": "floor",
            "9": "floor"
        };
        var key;
        //affichage du terrain
        for (y = 0, ly = this.field.length; y < ly; y++)
            for (x = 0, lx = (this.field[y]).length; x < lx; x++) {
                key = this.field[y][x];
                putimage(context, textures[key], 32 * x, 32 * y, 32, 32);
                if (this.field[y][x] == "0") {
                    if (y < this.field.length - 1 && this.field[y + 1][x] != "0")
                        putimage(context, "wall_limit", 32 * x, 32 * y, 32, 32, -90);
                    if (y > 1 && this.field[y - 1][x] != "0")
                        putimage(context, "wall_limit", 32 * x, 32 * y, 32, 32, 90);
                    if (x > 1 && this.field[y][x - 1] != "0")
                        putimage(context, "wall_limit", 32 * x, 32 * y, 32, 32);
                    if (x < this.field[y].length - 1 && this.field[y][x + 1] != "0")
                        putimage(context, "wall_limit", 32 * x, 32 * y, 32, 32, 180);
                }
            }
    }
}