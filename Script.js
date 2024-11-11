const questionDiv = document.getElementById('question');
let Exits = [];
const max = 30;
reset=true;
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
        resetall()
        object=document.getElementById(row+","+col);
        if(object.classList.contains("wall")){
            object.classList.remove("wall")
        }else{
            object.classList.add("wall")
        }
    }
}
async function findWay(){
    resetall()
    if(!reset){
        return
    }
    reset=false;
    start=Exits[0];
    if(!(await nextMove(start[0],start[1]))){
        alert('No Path Found')
        reset=true;
    }else{
        finished()
    }

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function nextMove(row,col){
    let nextvalue=nonWall(row,col);
    await sleep(1)
    for(let i=0;i<nextvalue.length;i++){
        if(await finishCheck(nextvalue[i][0],nextvalue[i][1])){
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
        return true
    }
}
async function finished(){
    for(ii=max-1;ii>=0;ii--){
        await sleep(20)
        for(iii=max-1;iii>=0;iii--){
            let object=document.getElementById((ii)+","+(iii));
            if(object.classList.contains('Path')){
                object.classList.add('pass')
            }
        }
    }
    for(ii=max-1;ii>=0;ii--){
        await sleep(20)
        for(iii=max-1;iii>=0;iii--){
            let object=document.getElementById((ii)+","+(iii));
            if(object.classList.contains('Path')){
                object.classList.remove('pass')
            }
        }
    }
    reset=true;
}
function resetall(){
    if(reset){
        Paths=[];
        objects=document.querySelectorAll(".Path");
        objects.forEach((elemant)=>{
            elemant.classList.remove('Path')
        })
    }
}
async function removeNonPath(correctPath) {
    await sleep(500);
    reset=true
    resetall()
    reset=false
    correctPath.forEach(element => {
        console.log((element))
        document.getElementById((element[0]) + "," + (element[1])).classList.add('Path');
    });
    finished()
}

async function fastWay() {
    resetall()
    if(!reset){
        return
    }
    reset=false
    let start = [];
    start.push(Exits[0]);
    let doubles=[]
    if (await fastMove(start,doubles)) {
        
        const path = findPath(Exits[1],doubles);
        console.log(path);
        await removeNonPath(path);
    } else {
alert('No Path Found')
reset=true;
    }
}


async function fastMove(Paths,doubles) {
    let tempPath = [];
    await sleep(10);
    for (const element of Paths) {
        let nextvalue = nonWall(element[0], element[1]);

        for (let i = 0; i < nextvalue.length; i++) {
            if (await finishCheck(nextvalue[i][0], nextvalue[i][1])) {     
                doubles.push([[element[0], element[1]],[nextvalue[i][0], nextvalue[i][1]]])    
                return true;
            }
        }

        for (let i = 0; i < nextvalue.length; i++) {
            let nextobject = document.getElementById((nextvalue[i][0]) + "," + (nextvalue[i][1]));
            nextobject.classList.add("Path");
            doubles.push([[element[0], element[1]],[nextvalue[i][0], nextvalue[i][1]]])
            tempPath.push([nextvalue[i][0], nextvalue[i][1]]);
        }
    }

    if (tempPath.length === 0) {
        return false;
    }

    if (await fastMove(tempPath,doubles)) {
        return true;
    }

    return false;
}
function areArraysEqual(arr1, arr2) {
    return arr1[0] === arr2[0] && arr1[1] === arr2[1];
}

function findPath(start,data) {
    let result = [start];
    let current = start;
    while (!areArraysEqual(current, [1, 1])) {
        let found = false;
        for (let i = 0; i < data.length; i++) {
            if (areArraysEqual(data[i][1], current)) {
                result.unshift(data[i][0]); 
                current = data[i][0];
                found = true;
                break;
            }
        }
        if (!found) break; 
    }

    return result;
}


