const questionDiv = document.getElementById('question');
let Exits = [];
var max = 80; 
 rownum = parseInt(((window.innerHeight)/100)*20);
 colnum = parseInt(((window.innerWidth)/100)*20.5); 
//  rownum=colnum=max;
reset = true;
if(rownum%2==0){
    rownum+=1;
}
if(colnum%2==0){
    colnum+=1;
}

function inputInsert() {
    const grid = Array.from({ length: rownum }, () => Array(colnum).fill('wall'));
    questionDiv.style.gridTemplateColumns = `repeat(${colnum}, 1fr)`;

    Exits = [
        [1, 1],              
        [rownum - 2, colnum - 2] 
    ];

    function carvePath(row, col) {
        const stack = [[row, col]];
        grid[row][col] = 'path';

        while (stack.length) {
            const [currentRow, currentCol] = stack[stack.length - 1];
            const directions = [
                [0, 1], [1, 0], [0, -1], [-1, 0]
            ].sort(() => Math.random() - 0.5); 

            let moved = false;
            for (const [dr, dc] of directions) {
                const newRow = currentRow + dr * 2;
                const newCol = currentCol + dc * 2;

                if (
                    newRow > 0 && newRow < rownum - 1 &&
                    newCol > 0 && newCol < colnum - 1 &&
                    grid[newRow][newCol] === 'wall'
                ) {
                    
                    grid[currentRow + dr][currentCol + dc] = 'path';
                    grid[newRow][newCol] = 'path';
                    stack.push([newRow, newCol]); 
                    moved = true;
                    break;
                }
            }

            if (!moved) {
                stack.pop();
            }
        }
    }

    carvePath(Exits[0][0], Exits[0][1]);

    const fragment = document.createDocumentFragment();
    for (let row = 0; row < rownum; row++) {
        for (let col = 0; col < colnum; col++) {
            const div = document.createElement('div');
            div.id = `${row},${col}`;
            div.classList.add('cell-input', grid[row][col]);

            div.addEventListener('click', () => wallData(row, col));

            fragment.appendChild(div);
        }
    }

    questionDiv.innerHTML = '';
    questionDiv.appendChild(fragment);

    const startDiv = document.getElementById(`${Exits[0][0]},${Exits[0][1]}`);
    startDiv.classList.remove('wall');
    startDiv.classList.add('Start');

    const endDiv = document.getElementById(`${Exits[1][0]},${Exits[1][1]}`);
    endDiv.classList.remove('wall');
    endDiv.classList.add('End');

    let rands = 0;
    const cleared = new Set();
    let WhileCount = 0;
    let WallsData=document.querySelectorAll(".wall");
    targetClears=parseInt((WallsData.length/100)*13)
    // console.log("TotalWall: "+(WallsData.length)+"  Deletes: "+targetClears)

    while (rands < targetClears) {
        if (WhileCount > WallsData.length) {
            break;
        }
        const x = Math.floor(Math.random() * (rownum - 2)) + 1;
        const y = Math.floor(Math.random() * (colnum - 2)) + 1;
        const id = `${x},${y}`;

        if (grid[x][y] === 'wall' && !cleared.has(id)) {
            document.getElementById(id).classList.remove('wall');
            cleared.add(id);
            rands++;
        }
        WhileCount++;
    }

    let tempPath = document.querySelectorAll(".path");
    tempPath.forEach((el) => {
        el.classList.remove("path");
    });
}



inputInsert()


function wallData(row,col){

    if(row==0 || col==0 || row==rownum-1 || col==colnum-1){
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
        nextobject.classList.add("wrong");
    }
    return false
}
function nonWall(row,col){
    let NoWalls=[];
    let nextvalue=[[row,(col+1)],[(row+1),col],[(row-1),col],[row,(col-1)],];
    for(let i=0;i<nextvalue.length;i++){
        if(nextvalue[i][0]>=0 && nextvalue[i][1]>=0){
            let object=document.getElementById((nextvalue[i][0])+","+(nextvalue[i][1]));
            if(!(object.classList.contains('wall'))&& !(object.classList.contains('Path'))&& !(object.classList.contains('wrong'))){
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
    for(ii=rownum-1;ii>=0;ii--){
        await sleep(20)
        for(iii=colnum-1;iii>=0;iii--){
            let object=document.getElementById((ii)+","+(iii));
            if(object.classList.contains('Path')){
                object.classList.add('pass')
            }
        }
    }
    for(ii=rownum-1;ii>=0;ii--){
        await sleep(20)
        for(iii=colnum-1;iii>=0;iii--){
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
        objects=document.querySelectorAll(".wrong");
        objects.forEach((elemant)=>{
            elemant.classList.remove('wrong')
            
        })
        objects=document.querySelectorAll(".Finish");
        objects.forEach((elemant)=>{
            elemant.classList.remove('Finish')
            
        })
    }
}
async function removeNonPath(correctPath) {
    await sleep(500);
    reset=true
    resetall()
    reset=false
    correctPath.forEach(element => {
        document.getElementById((element[0]) + "," + (element[1])).classList.add('Finish');
    });
    await sleep(5);
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
        
        
        if(nextvalue.length==0){
            if(!(document.getElementById(element[0]+","+element[1]).classList.contains("Start"))){
                doubles=await doublesClear(doubles,element)
                document.getElementById(element[0]+ "," + element[1]).classList.add("wrong")
            }
        }
        
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
    while (!areArraysEqual(current, Exits[0])) {
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
function doublesClear(doubles,element){
    let terminated=element;
    k=0
    while(true){
        count=0;
        for (let i = 0; i < doubles.length; i++) {
            if (areArraysEqual(doubles[i][0], terminated)) {
                count++;
            }
        }
        if(count==0){
            for (let i = 0; i < doubles.length; i++) {
                if (areArraysEqual(doubles[i][1], terminated)) {
                    terminated=doubles[i][0]
                    index=doubles.indexOf(doubles[i])
                    if (index !== -1) {
                        doubles.splice(index, 1);
                    }
                }
            }
        }else{
            break;
        }
        k++
    }
    return doubles
}


function newArraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}


