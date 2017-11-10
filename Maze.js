// 0 - pusta komórka 1 - start 2 - koniec 3 - przeszkoda 4 - puste pole po przejściu "szukacza" 5 - droga
// Pierwsze kliknięcie zaznacza start, drugie - koniec. Od trzeciego stawiamy przeszkody.
//Do dodania: lepszy algorytm np. A*, podczas rysowania ścieżki uwzględniać przeszkody.
class Maze
{
	constructor(){
	}
	//
	getRandom() {
    let number = Math.round(Math.random() * (2 - 1) + 1);
    if(number == 1)
    {
    	return 0;
    }

    else
    {
    	return 3;
    }

	}

	init()
	{
		this.canvas = document.getElementById("canvas");  //do konstruktora
		this.ctx = this.canvas.getContext('2d');
		this.cellSize = 25;
		this.mapWidth = prompt("Podaj ilość komórek (szerokość)");			// in cells
		this.mapHeight = prompt("Podaj ilość komórek (wysokość)");
		this.canvas.width = this.mapWidth * this.cellSize;
		this.canvas.height = this.mapHeight * this.cellSize;
		this.cells = [];
		this.cellType = 1;
		this.made = false;
		this.lastTime = 0;
		this.fps = 10;
		this.aliveCells = [];

		this.end = false;
		this.begin = false;

		this.state = false;

		this.startX = 0;
		this.startY = 0;

		this.pathMade = false;

		this.pathFound = false;

		this.endX = 0;
		this.endY = 0;
		this.initButtons();
		this.generateMaze();
		this.drawTemplate();
		window.addEventListener('mousedown',(evt) => {      //tworzenie komórki przy kliknięciu
				evt.stopImmediatePropagation();
				let x = Math.floor(evt.clientX/this.cellSize);
				let y = Math.floor(evt.clientY/this.cellSize);
				if(evt.buttons === 2 )
				{
					this.cells[x][y].value = 0;
				}
				else
				{
				
				//console.log('Cell Type: ',this.cellType,"Begin: ",this.begin,"end: ",this.end);
				if(this.cellType === 1)
				{

					this.begin = true;
					this.startX = x;
					this.startY = y;
					lastX = x;
					lastY = y;
					this.cells[x][y].value = this.cellType;
					this.cellType = 2;
				}

				else if(this.cellType === 2)
				{
					this.end = true;
					this.endX = x;
					this.endY = y;
					this.cells[x][y].value = this.cellType;
					this.cellType = 3;
				}

				else if(this.cellType === 3)
				{
		
					this.cells[x][y].value = this.cellType;
				}
				}
			});

		this.draw();    //główna pętla symulacji
	}	
	//
	// 0 - pusta komórka 1 - start 2 - koniec 3 - przeszkoda 4 - puste pole po przejściu "szukacza" 5 - droga
	initButtons(){
		let start = document.getElementById("start");
		start.addEventListener('click',() =>{
			this.cells[this.startX][this.startY].findPath();

		});
	}
	//
	generateMaze(){
		for(let x = 0 ; x < this.mapWidth ; x++){
			this.cells.push([]);
			for(let y = 0 ; y < this.mapHeight ; y++)
			{
				//let number = this.getRandom();
				let number = 0;
				//console.log(number);
				this.cells[x][y] = new Cell(number,x,y);
			}



		}
		//console.log(this.cells);
	}
	//
	// 0 - pusta komórka 1 - start 2 - koniec 3 - przeszkoda
	drawTemplate(){ //rysowanie kratek 
		for(let x = 0 ; x < this.mapWidth ; x++){
			for(let y = 0 ; y < this.mapHeight ; y++)
			{
				if(this.cells[x][y].value === 1)
				{
					this.ctx.fillStyle = "red";
					this.ctx.fillRect(x*this.cellSize,y*this.cellSize,this.cellSize,this.cellSize);
					this.ctx.fillStyle = "black";
				}
				else if(this.cells[x][y].value === 2)
				{
					this.ctx.fillStyle = "orange";
					this.ctx.fillRect(x*this.cellSize,y*this.cellSize,this.cellSize,this.cellSize);
					this.ctx.fillStyle = "black";
				}
				else if(this.cells[x][y].value === 3)
				{
					this.ctx.fillRect(x*this.cellSize,y*this.cellSize,this.cellSize,this.cellSize);
				}
				else if(this.cells[x][y].value === 4){
					this.ctx.fillStyle = "green";
					this.ctx.fillRect(x*this.cellSize,y*this.cellSize,this.cellSize,this.cellSize);
					this.ctx.strokeRect(x*this.cellSize,y*this.cellSize,this.cellSize,this.cellSize);
					this.ctx.fillStyle = "black";
				}
				else
				{
					this.ctx.strokeRect(x*this.cellSize,y*this.cellSize,this.cellSize,this.cellSize);
				}

			}



		}


	}
	//
	draw(time)
	{
		requestAnimationFrame(maze.draw);
		if(time - maze.lastTime  >= 1000/maze.fps )
		{
			maze.lastTime = time;
			maze.ctx.clearRect(0,0,maze.mapWidth*maze.cellSize,maze.mapHeight*maze.cellSize);

			//
			//
			maze.drawTemplate();
			//
			if(maze.pathMade === true)
			{
				maze.drawPath();
			}
			//
		}
	}

	drawPath()
	{
		
		for(let x = 0 ; x < path.length ; x++)
		{
			if(x === 0 )
			{
				this.ctx.fillStyle = "red";
			}
			else if(x === path.length -1)
			{
				this.ctx.fillStyle = "orange";
			}
			else
			{
				this.ctx.fillStyle = "#7f841b";
			}
			this.ctx.fillRect(path[x].x*this.cellSize,path[x].y*this.cellSize,this.cellSize,this.cellSize);
			this.ctx.strokeRect(path[x].x*this.cellSize,path[x].y*this.cellSize,this.cellSize,this.cellSize);
			this.ctx.fillStyle = "black";
		}
	}
}

const maze = new Maze();
window.onload = function(){
	maze.init();
}
//
//
//
//
const directions = [
{x:1,y:0},
{x:-1,y:0},
{x:0,y:1},
{x:0,y:-1}
];


let lastX = maze.startX;
let lastY = maze.startY;
let path = [];

class Cell{
	constructor(value,x,y){
		this.x = x;
		this.y = y;
		this.value = value;
		this.neighbours = [];
		this.addNeighbours();
	}

	addNeighbours()
	{
		for(let x = 0; x < directions.length ; x++)
		{
			let xN = this.x - directions[x].x;
			let yN = this.y - directions[x].y;
			if(xN < 0 || yN < 0 || xN > maze.mapWidth-1 || yN > maze.mapHeight-1)
			{
				continue;
			}
			let obj = {x:xN,y:yN};
			 this.neighbours.push(obj);
		}
	}

	findPath()
	{
		if(maze.pathFound === true)
		{
			return;
		}
		for(let x = 0 ; x < this.neighbours.length ; x++)
		{
			let xN = this.neighbours[x].x;
			let xY = this.neighbours[x].y;
			if(maze.cells[xN][xY].value === 3 || maze.cells[xN][xY].value === 4)
			{
				continue;
			}
			maze.cells[xN][xY].value = 4;

			if(xN === maze.endX && xY === maze.endY)
			{
				document.getElementById("start").innerHTML = "ZNALAZŁEM WYJŚCIE!";
				maze.cells[maze.endX][maze.endY].value = 2;
				maze.pathFound = true;
				this.makePath();
			}
			else{
				document.getElementById("start").innerHTML = "SZUKAM...";
			}

			setTimeout( () => {
				maze.cells[xN][xY].findPath();
			},100);
		}
	}
	makePath()
	{
		
		do
		{
			if(maze.endX > lastX)
			{
				lastX++;

			}

			else if(maze.endX < lastX)
			{
				lastX--;
			}

			if(maze.endY > lastY)
			{
				lastY++;
			}

			else if (maze.endY < lastY)
			{
				lastY--;
			}
			path.push({x:lastX,y:lastY});
			console.log(lastX, maze.endX,  lastY,  maze.endY);
			console.log(lastX == maze.endX );
			console.log(lastY == maze.endY);
		}while(lastX != maze.endX || lastY != maze.endY)

		setTimeout( () => {
				maze.pathMade = true;
				maze.drawPath();
			},100);
	}

	
}
