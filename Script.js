const questionDiv = document.getElementById('question');
let Exits = [];
const max = 40;
function inputInsert() {
    
    Exits[0] = [1, 1];              
    Exits[1] = [max - 3, max - 2];

    questionDiv.style.gridTemplateColumns = `repeat(${max}, 1fr)`;

    const grid = Array.from({ length: max }, () => Array(max).fill('wall'));

    function carvePath(row, col) {
        grid[row][col] = 'path';

        const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0]
        ].sort(() => Math.random() - 0.5);

        for (const [dr, dc] of directions) {
            const newRow = row + dr * 2;
            const newCol = col + dc * 2;

            if (newRow > 0 && newRow < max - 1 && newCol > 0 && newCol < max - 1 && grid[newRow][newCol] === 'wall') {
                
                grid[row + dr][col + dc] = 'path';
                grid[newRow][newCol] = 'path';
                carvePath(newRow, newCol);
            }
        }
    }

    carvePath(Exits[0][0], Exits[0][1]);

    for (let row = 0; row < max; row++) {
        for (let col = 0; col < max; col++) {
            const div = document.createElement('div');
            div.id = row + "," + col;
            div.classList.add('cell-input');

            if (grid[row][col] === 'wall') {
                div.classList.add('wall');
            } else {
                div.classList.add('path');
            }

            div.addEventListener('click', function() {
                wallData(row, col);
            });

            questionDiv.appendChild(div);
        }
    }

    const startDiv = document.getElementById(Exits[0][0] + "," + Exits[0][1]);
    startDiv.classList.remove('wall');
    startDiv.classList.add('Start');

    const endDiv = document.getElementById(Exits[1][0] + "," + Exits[1][1]);
    endDiv.classList.remove('wall');
    endDiv.classList.add('End');
}

inputInsert()


function wallData(row,col){

    if(row==0 || col==0 || row==max-1 || col==max-1){
        // document.getElementById(row+","+col).style.backgroundColor="yellow"
    }else{
        object=document.getElementById(row+","+col);
        if(object.classList.contains("wall")){
            object.classList.remove("wall")
        }else{
            object.classList.add("wall")
        }
    }
}
async function findWay(){
    start=Exits[0];
    if(await nextMove(start[0],start[1])){

    }

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function nextMove(row,col){
    let nextvalue=nonWall(row,col);
    console.log(nextvalue)
    await sleep(30)
    for(let i=0;i<nextvalue.length;i++){
        if(await finishCheck(nextvalue[i][0],nextvalue[i][1])){
            let nextobject=document.getElementById((nextvalue[i][0])+","+(nextvalue[i][1]));
            nextobject.classList.add("Path");
            return true;
        }
    }
    for(let i=0;i<nextvalue.length;i++){
        let nextobject=document.getElementById((nextvalue[i][0])+","+(nextvalue[i][1]));
        nextobject.classList.add("Path");
        if(await nextMove(nextvalue[i][0],nextvalue[i][1])){
            return true
        }
        nextobject.classList.remove("Path");
    }
    return false
}
function nonWall(row,col){
    let NoWalls=[];
    let nextvalue=[[row,(col+1)],[(row+1),col],[(row-1),col],[row,(col-1)],];
    for(let i=0;i<nextvalue.length;i++){
        if(nextvalue[i][0]>=0 && nextvalue[i][1]>=0){
            let object=document.getElementById((nextvalue[i][0])+","+(nextvalue[i][1]));
            if(!(object.classList.contains('wall'))&& !(object.classList.contains('Path'))){
                NoWalls.push([nextvalue[i][0],nextvalue[i][1]])
            }
        }
    }
    return NoWalls;
}

function finishCheck(row,col){
    if(document.getElementById((row)+","+col).classList.contains('End')){
        console.log("FINSIH")
        return true
    }
}