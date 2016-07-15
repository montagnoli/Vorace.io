function Player(name, id, nbofchar, x, y, width, height)
{
	"use strict";
	this.Name;
	this.Id;
	this.Victory;
	this.Defeat;
	this.NumberChar = nbofchar;
	this.BeginZone = [x, y, width, height];
	this.Characters = new Array();
	this.AddCharacter = function(Perso)
	{
		Perso.SetPos(2,4);
		this.Characters.unshift(Perso);
	}
	this.DelCharacter = function(Perso)
	{
		var index = this.Characters.indexOf(Perso);
		this.Characters.splice(index, 1);
	}
}

function current()
{
	this.player;
	this.character;
}