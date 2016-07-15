window.onload = function() {
	"use strict";

	var Player1 = new Player("Zao ki",1,1,3,3,6,3);


	var Menu = new Layout();
	Menu.AddLayer("menu", 2, 1, "black", 0 , 0, 1000, 1000);
	Menu.AddObjet("menu", new button_text("Jouer", 400, 400, "white", 100, "Arial", function(){Menu.SetActive(false); Menu.Draw(); Game.SetActive(true); Game.Draw();}));
	Menu.Draw();

	var CharSelect = new Layout();
	CharSelect.AddLayer("grid", 1 , 1, "green", 100, 300, 800, 400);
	CharSelect.AddLayer("p1", 1 , 1, "green", 0, 0, 1000, 250);
	CharSelect.AddLayer("p2", 1 , 1, "green", 0, 750, 1000, 250);
	CharSelect.AddObjet("grid", new CharSelector());
	CharSelect.SetActive(false);
	CharSelect.Draw();
	CharSelect.objects;

	var Game = new Layout();
	Game.AddLayer("map", 1, 1, "black", 0, 0, 1000, 1000);
	Game.AddLayer("game", 1, 1, "transparent", 0, 0, 1000, 1000);


	var map = new Map(Game.layers["map"].ctx);
	map.Draw(Game.layers["map"].ctx);
	Player1.AddCharacter(new Character("bowman"));

	var current = Player1.Characters[0];
	Game.AddObjet("game",current);
	Game.AddLayer("hud", 100, 1, "red", 50, 750, 900, 200);
	Game.AddObjet("hud" ,[new button_arrow(750, 0, 60, 60, 0,function(){current.Move(0);}),
		new button_arrow(800, 50, 60, 60, 90, function(){current.Move(1);}),
		new button_arrow(750, 100, 60, 60, 180, function(){current.Move(2);}),
		new button_arrow(700, 50, 60, 60, 270, function(){current.Move(3);}),
		]);
	Game.SetActive(false);
	Game.Draw();
}
