"use strict";
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));

function get_map()
{
    var c = fs.readFileSync("maps/LIST");
    var cjs = JSON.parse(c);
    var m = cjs['maps'][Math.floor(Math.random() * cjs['maps'].length)];
    var mf = fs.readFileSync("maps/" + m);
    return JSON.parse(mf);
}

function Game() {
    this.maps = get_map();
    this.life = 3;
    this.loop = 0;
    this.timer = 0;
    this.id = Math.floor(Math.random() * (99999999 - 10000000)) + 10000000;
    this.max_players = 2;
    this.players = [];
    this.golden = 0;
    this.stats = "W"; // W=wait I=in_progress P=private

    this.bcast_pacman = function(type, send)
    {
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            if (p.role == "V")
                p.socket.emit(type, send);
        }
    }

    this.spawn_golden = function()
    {
        this.maps['map'][this.maps['ps'][0]][this.maps['ps'][1]] = 42;
        this.golden = 30;
        this.bcast("golden", {'x': this.maps['px'], 'y': this.maps['py']});
    }

    this.stop_golden = function()
    {
        this.golden = 0;
        this.maps['map'][this.maps['ps'][0]][this.maps['ps'][1]] = 9;
        this.bcast("golden", false);
    }

    this.bcast_fantome = function(type, send)
    {
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            if (p == null)
                return ;
            if (p.role != "V")
                p.socket.emit(type, send);
        }
    }

    this.bcast = function(type, send) {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].socket.emit(type, send);
        }
    }

    this.check_case_fantome = function (u){
        var p = this.get_pacman();
        if (p == null) return ;
        var it = this.maps['map'][u.y][u.x];
        if (u.x == p.x && u.y == p.y && this.timer != 0)
        {
            u.eats = true;
            this.send_move();
        }
        if (it == 2 && u.eats == true)
        {
            u.eats = false;
            this.send_move();
        }
        if (it == 42)
        {
            u.view += 2;
            this.stop_golden();
        }
    };

    this.check_case_pacman = function (){
        var p = this.get_pacman();
        if (p == null) return ;
        var it = this.maps['map'][p.y][p.x];
        if (it == 3)
        {
            this.timer = 45;
            this.maps['map'][p.y][p.x] = 9;
        }
        else if (it == 1)
        {
            this.maps['map'][p.y][p.x] = 9;
            var count = this.count_pacdot();
            this.bcast("ember", count);
            if (count == 0)
                end_game(this, 'Vorace (' + this.get_pacman().pseudo +') win !');
        }
        else if (it == 2)
            this.remove_life();
        else if (it == 42)
        {
            this.life += 2;
            this.timer = 45;
            this.bcast("life", this.life);
            this.stop_golden();
        }
    }

    this.count_pacdot = function (){
        var tab = this.maps['map'];
        var nb = 0;
        for (var y = 0; y < tab.length; y++) {
    		for (var x = 0; x < tab[y].length; x++) {
                if (tab[y][x] == 1)
                    nb++;
            }
        }
        return (nb);
    }

    this.remove_life = function()
    {
        this.life--;
        this.bcast("life", this.life);
        if (this.golden != 0)
            this.stop_golden();
        this.loop = 0;
        if (this.life <= 0)
        {
            end_game(this, 'Fantomes win !');
            return ;
        }
        var u = this.players;
        for (var i = 0; i < u.length; i++) {
            u[i].dep = 0;
            if (u[i].role == "V") {
                u[i].y = this.maps['ps'][0];
                u[i].x = this.maps['ps'][1];
            } else {
                u[i].y = this.maps['fs'][0];
                u[i].x = this.maps['fs'][1];
            }
        }
        this.send_move();
    }

    this.check_pacman = function()
    {
        var p = this.get_pacman();
        for (var i = 0; i < this.players.length; i++) {
            var u = this.players[i];
            if (u == p) continue;
            if (p == null)
                return ;
            if (p.x == u.x && p.y == u.y && this.timer == 0 && u.eats == false)
            {
                this.remove_life();
                return true;
            }
        }
        return false;
    }

    this.get_view = function(mx, my, view)
    {
        var p = this.get_pacman();
        if (p == null)
            return ;
        var tab = this.maps['map'];
        var result = [];
        for (var y = 0; y < tab.length; y++) {
            for (var x = 0; x < tab[y].length; x++) {
                if (Math.abs(mx - x) + Math.abs(my - y) <= view)
                    result.push({"val": tab[y][x],"vorace": (p.x == x && p.y == y), "x": x, "y": y});
            }
        }
        return (result);
    }

    this.send_move = function(){
        var mp = [];
        var mf = [];
        for (var j = 0; j < this.players.length; j++) {
            var p = this.players[j];
            mp.push({
                'id': p.socket.id.substring(2),
                'x': p.x,
                'y': p.y,
                'eat': p.eats
            });
            if (p.role != "V")
            {
                mf.push({'id': p.socket.id.substring(2),
                'x': p.x,
                'y': p.y,
                'eat': p.eats,
                'view-length': p.view,
                'view' : this.get_view(p.x, p.y, p.view)
                });
            }
        }
        this.bcast_pacman("move", mp);
        this.bcast_fantome("move", mf);
        //this.bcast("move", mp);
    }

    this.list_players = function()
    {
        var r = {'players': [], 'required': this.max_players};
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            r['players'].push({'id': p.socket.id.substring(2), 'pseudo': p.pseudo});
        }
        this.bcast("list_player", r);
    }

    this.moveall = function(type, send) {
        var p = this.get_pacman();
        for (var i = 0; i < this.players.length; i++) {
            var u = this.players[i];
            if (u == p) continue;
            this.check_case_fantome(u);
            u.move(this.maps['map']);
            this.send_move();
            this.check_case_fantome(u);
        }
        if (this.check_pacman() == true)
            return ;
        p.move(this.maps['map']);
        this.send_move();
        if (this.check_pacman() == true)
            return ;
        this.check_case_pacman();
    }

    this.get_pacman = function() {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].role == "V")
                return this.players[i];
        }
        return null;
    }

    this.get_user_by_id = function(id) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].socket.id == id)
                return this.players[i];
        }
        return null;
    }
}

function User(socket, pseudo) {
    this.socket = socket;
    this.pseudo = pseudo;
    this.eats = false;
    this.x = 0;
    this.y = 0;
    this.role = null; //V or F
    this.dep = 0;
    this.pdep = 0;
    this.view = 5;
    this.move = function(tab) {
        //TODO pre-direction 1 case a l'avance seulement
        var t = false;
        if (this.dep == 1 && tab[this.y][this.x - 1] != 0) //L
            this.x -= 1;
        else if (this.dep == 2 && (tab[this.y - 1] == undefined || tab[this.y - 1][this.x] != 0)) //U
            this.y -= 1;
        else if (this.dep == 3 && tab[this.y][this.x + 1] != 0) //R
            this.x += 1;
        else if (this.dep == 4 && (tab[this.y + 1] == undefined || tab[this.y + 1][this.x] != 0)) //D
            this.y += 1;
        else if (this.dep != 0) {
            if (this.pdep == 1 && tab[this.y][this.x - 1] != 0) //L
                this.x -= 1;
            else if (this.pdep == 2 && (tab[this.y - 1] == undefined || tab[this.y - 1][this.x] != 0)) //U
                this.y -= 1;
            else if (this.pdep == 3 && tab[this.y][this.x + 1] != 0) //R
                this.x += 1;
            else if (this.pdep == 4 && (tab[this.y + 1] == undefined || tab[this.y + 1][this.x] != 0)) //D
                this.y += 1;
            t = true;
        }
        if (this.x < 0)
            this.x = tab[0].length - 1;
        if (this.x > tab[0].length - 1)
            this.x = 0;
        if (this.y < 0)
            this.y = tab.length - 1;
        if (this.y > tab.length - 1)
            this.y = 0;
        if (t == false)
            this.pdep = this.dep;
    }
}

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client.html');
});

var users = [];
var games = [new Game()];

function get_game_by_id(id)
{
    for (var g in games)
    {
        if (g.id == id)
            return (g);
    }
    return (null);
}

function run_game(g)
{
    var players = [];
    var u = g.players;
    var p = Math.floor(Math.random() * u.length);
    for (var i = 0; i < u.length; i++) {
        u[i].dep = 0;
        if (p == i) {
            u[i].y = g.maps['ps'][0];
            u[i].x = g.maps['ps'][1];
            u[i].role = "V";
        } else {
            u[i].y = g.maps['fs'][0];
            u[i].x = g.maps['fs'][1];
            u[i].role = "F";
        }
        players.push({
            'id': u[i].socket.id.substring(2),
            'pseudo': u[i].name,
            "x": u[i].x,
            "y": u[i].y,
            "role": u[i].role
        });
    }
    g.bcast('start', {
        'players': players,
        'map': g.maps
    });
    g.bcast("life", g.life);
    g.stats = "I";
}

function join_game(user, g)
{
    g.players.push(user);
    g.list_players();
    if (g.players.length != g.max_players)
        return ;
    run_game(g);
    games.unshift(new Game());
}

function create_private_game(nb_pl) {
    var g = new Game();
    if (nb_pl <= 1)
    {
        return "";
    }
    g.max_players = nb_pl;
    g.stats = "P";
    games.push(g);
    return g.id;
}

function move_players() {
    for (var i = 0; i < games.length; i++) {
        var g = games[i];
        if (g.stats == "W" || g.stats == "P")
            continue;
        g.moveall();
        if (g.timer != 0)
        {
            g.timer--;
            g.bcast("timer", g.timer);
        }
        g.loop += 1;
        if (g.loop >= 1000 + Math.floor(Math.random() * (1000)))
        {
            g.spawn_golden();
            console.log("GOGOGOGO");
            g.loop = 0;
        }
        if (g.golden != 0)
        {
            g.golden--;
            if (g.golden == 0)
                g.stop_golden();
        }
    }
}
var ticks = 0;
setInterval(function() {
    move_players();
    if (ticks == 1000)
    {
        console.log('Games: ' + (games.length - 1)  + ' - Players: ' + users.length);
        fs.appendFile('log.txt', 'Games: ' + (games.length - 1)  + ' - Players: ' + users.length + "\n", 'utf8', function(err){});
        ticks = 0;
    }
    ticks++;
}, 125);

function get_game_by_user_id(id) {
    for (var i = 0; i < games.length; i++) {
        if (games[i].get_user_by_id(id) != null)
            return games[i];
    }
    return null;
}

function get_user_by_id(id) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].socket.id == id)
            return users[i];
    }
    return null;
}

function end_game(g, raison)
{
    if (g.stats == "I")
    {
        g.bcast("end_game", raison);
        fs.appendFile('log.txt', raison + "\n", 'utf8', function(err){});
        remove_matching(games, g);
    }
    else
        g.list_players();
}

function remove_matching(array, user) {
    var i = array.indexOf(user);
    if (i != -1) {
        array.splice(i, 1);
    }
}


io.on('connection', function(socket) {
    console.log('Co ' + socket.id);

    socket.on('disconnect', function() {
        console.log("Deco " + socket.id);
        var user = get_user_by_id(socket.id);
		var g = get_game_by_user_id(socket.id);
		if (g) {
            remove_matching(g.players, user);
			end_game(g, 'Player disconnect...');
        }
        if (user)
            remove_matching(users, user);
    });

    socket.on('move', function(mov) {
        var user = get_user_by_id(socket.id);
        var game = get_game_by_user_id(socket.id);
        if (user != null && game != null) {
            if (mov != user.dep && (parseInt(mov) > 0 && parseInt(mov) < 5)) {
                user.dep = mov;
            }
        }
    });

    socket.on('play', function(type) {
        var user = get_user_by_id(socket.id);
        if (user != null && get_game_by_user_id(socket.id) == null) {
            console.log(user.pseudo + " (" + user.socket.id + ") joined a game");
            if (user == "create")
            {
                create_private_game(5);
                return ;
            }
            var g = get_game_by_id(type);
            if (g == null)
                g = games[0];
            join_game(user, g);
        }
    });

    socket.on('pseudo', function(name) {
        var user = get_user_by_id(socket.id);
        if (user == null)
        {
            users.push(new User(socket, name));
            console.log(socket.id + " has name <" + name + ">");
        }
    });

});

http.listen(3000, '0.0.0.0', function() {
    console.log('listening on *:3000');
});
