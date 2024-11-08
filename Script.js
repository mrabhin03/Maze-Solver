const questionDiv = document.getElementById('question');
Exits=[];
function inputInsert(){
    max=15;
    Exits[0]=[0,1];
    Exits[1]=[max-1,max-2];
    questionDiv.style.gridTemplateColumns=`repeat(${max},1fr)`;
    for (let row = 0; row < max; row++) {
        for (let col = 0; col < max; col++) {
            const div = document.createElement('div');
            div.id=row+","+col;
            div.classList.add('cell-input');
            if(row==0 || col==0 || row==max-1 || col==max-1){
                div.classList.add('wall');
            }
            div.addEventListener('click', function() {
                wallData(row,col)
            });
            questionDiv.appendChild(div);
        }
    }
    document.getElementById(Exits[0][0]+","+Exits[0][1]).classList.remove('wall')
    document.getElementById(Exits[0][0]+","+Exits[0][1]).classList.add('Start')
    document.getElementById(Exits[0][0]+","+Exits[0][1]).classList.add('Path')
    
    document.getElementById(Exits[1][0]+","+Exits[1][1]).classList.remove('wall')
    document.getElementById(Exits[1][0]+","+Exits[1][1]).classList.add('End')
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
    await sleep(1)
    for(let i=0;i<nextvalue.length;i++){
        if(finishCheck(nextvalue[i][0],nextvalue[i][1])){
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
    let nextvalue=[[(row+1),col],[(row-1),col],[row,(col-1)],[row,(col+1)]];
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
    if(document.getElementById((row+1)+","+col).classList.contains('End')){
        return true
    }
}