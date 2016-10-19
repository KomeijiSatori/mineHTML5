var row = 16, col = 30;
var mineCnt = 99;
var map = [];//has mine or not
var disc = [];//is discovered
var flg = [];//is set flag or not
var num = [];//mine nearby
var hasMine = false;

//record where the mouse is down
var msDownRow;
var msDownCol;

function random(min, max)
{
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//set all block empty and all undiscovered
function initVar()
{
	for (var i = 0; i < row; i++)
	{
		map[i] = [];
		disc[i] = [];
		num[i] = [];
		flg[i] = [];
		for (var j = 0; j < col; j++)
		{
			map[i][j] = false;
			disc[i][j] = false;
			flg[i][j] = false;
			num[i][j] = 0;
		}
	}
}

function setMine(r, c)
{
	hasMine = true;
	var blocks = [];
	for (var i = 0; i < row; i++)
	{
		for (var j = 0; j < col; j++)
		{
			if (!(Math.abs(i - r) <= 1 && Math.abs(j - c) <= 1))
			{
				blocks.push([i, j]);
		
			}
		}
	}

	for (var cnt = mineCnt; cnt >= 1; cnt--)
	{
		var ind = random(0, blocks.length - 1);
		var pos = blocks[ind];
		map[pos[0]][pos[1]] = true;
		
		//delete the selected one
		blocks[ind] = blocks[0];
		blocks[0] = pos;
		blocks.shift();
	}

	for (var i = 0; i < row; i++)
	{
		for (var j = 0; j < col; j++)
		{
			var cnt = 0;
			for (var m = -1; m <= 1; m++)
			{
				for (var n = -1; n <= 1; n++)
				{
					if (i + m >= 0 && i + m <= row - 1 && j + n >= 0 && j + n <= col - 1 && !(m === 0 && n === 0))
					{
						if (map[i + m][j + n] === true)
						{
							cnt++;
						}
					}
				}
			}
			num[i][j] = cnt;
		}
	}
}

function initGraph()
{
	document.body.setAttribute("oncontextmenu", "return false;");
	document.body.setAttribute("ondragstart", "return false;");
	document.body.setAttribute("ondrop", "return false;");

	var table = document.createElement("table");
	table.id = "tb";
	document.body.appendChild(table);
	
	for (var i = 0; i < row; i++)
	{
		var trow = document.createElement("tr");
		table.appendChild(trow);
		for (var j = 0; j < col; j++)
		{
			var tdata = document.createElement("td");
			tdata.id = i.toString() + " " + j,toString();
			var image = document.createElement("img");
			image.src = "un.svg";
			tdata.appendChild(image);
			tdata.addEventListener("mousedown", function(ev){dealMouseDown(this, ev); return false;}, false);
			tdata.addEventListener("mouseup", function(ev){dealMouseUp(this, ev); return false;}, false);
			trow.appendChild(tdata);
		}
	}
}

function updateGraph()
{
	for (var i = 0; i < row; i++)
	{
		for (var j = 0; j < col; j++)
		{
			var td = document.getElementById(i.toString() + " " + j.toString());
			if (disc[i][j] === true)
			{
				var name = num[i][j].toString() + ".svg";
				td.childNodes[0].setAttribute("src", name); 
			}
			else if(flg[i][j] === true)
			{
				td.childNodes[0].setAttribute("src", "flag.svg");
			}
			else
			{
				td.childNodes[0].setAttribute("src", "un.svg");
			}
		}
	}
}

//dig operation
function dig(r, c)
{
	r = parseInt(r);
	c = parseInt(c);
	if (!(disc[r][c] === false && flg[r][c] === false))//cannot dig
	{
		return true;
	}

	if (map[r][c] === true)//meets mine
	{
		return false;
	}
	else if (num[r][c] >= 1)//meets num
	{
		disc[r][c] = true;
		return true;
	}
	else//meets vacant
	{
		disc[r][c] = true;
		var res = true;
		for (var m = -1; m <= 1; m++)
		{
			for (var n = -1; n <= 1; n++)
			{
				if (r + m >= 0 && r + m <= row - 1 && c + n >= 0 && c + n <= col - 1 && !(m === 0 && n === 0))
				{
					if (!dig(r + m, c + n))
					{
						res = false;
					}
				}
			}
		}
		return res;
	}
}

//chord operation
function chord(r, c)
{
	r = parseInt(r);
	c = parseInt(c);
	if (!(disc[r][c] === true && num[r][c] >= 1))//cannot chord
	{
		return true;
	}

	var flgs = 0;
	for (var m = -1; m <= 1; m++)
	{
		for (var n = -1; n <= 1; n++)
		{
			if (r + m >= 0 && r + m <= row - 1 && c + n >= 0 && c + n <= col - 1 && !(m === 0 && n === 0))
			{
				if (flg[r + m][c + n] === true)
				{
					flgs++;
				}
			}
		}
	}
	if (flgs === num[r][c])
	{
		var res = true;
		for (var m = -1; m <= 1; m++)
		{
			for (var n = -1; n <= 1; n++)
			{
				if (r + m >= 0 && r + m <= row - 1 && c + n >= 0 && c + n <= col - 1 && !(m === 0 && n === 0))
				{
					if (!dig(r + m, c + n))
					{
						res = false;
					}
				}
			}
		}
		return res;
	}
	else//cannot chord
	{
		return true;
	}
}

function dealMouseDown(block, ev)
{
	var id = block.id.split(" ");
	msDownRow = parseInt(id[0]);
	msDownCol = parseInt(id[1]);
	
	//maybe add turn black option
}

function dealMouseUp(block, en)
{
	var id = block.id.split(" ");
	var msUpRow = parseInt(id[0]), msUpCol = parseInt(id[1]);

	//if the mouse moves to another block
	if (!(msUpRow === msDownRow && msUpCol === msDownCol))
	{
		return;
	}

	//first may turn back the stated block's color(to be continued)


	if (event.which == 1)
	{
		leftClick(block);
	}
	else if (event.which == 3)
	{
		rightClick(block);
	}
}

function leftClick(block)
{
	var id = block.id.split(" ");
	var r = parseInt(id[0]), c = parseInt(id[1]);
	var res;
	
	if (hasMine === false)
	{
		setMine(r, c);
	}
	

	if (disc[r][c] === false && flg[r][c] === false)//dig operation
	{
		res = dig(r, c);
	}
	else if (disc[r][c] === true && num[r][c] >= 1)//chord
	{
		res = chord(r, c);
	}
	if (res === false)//died
	{
		alert("DIE");
		//something then
	}
	updateGraph();
}

function rightClick(block)
{
	var id = block.id.split(" ");
	var r = parseInt(id[0]), c = parseInt(id[1]);

	if (disc[r][c] === false)
	{
		flg[r][c] = !flg[r][c];
	}
	updateGraph();
}

initVar();
initGraph();
