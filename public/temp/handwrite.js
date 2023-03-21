/**
 * Created by liubowen on 16/4/11.
 */
var canvasWidth =Math.min(700,$(window).width() - 20);
var strokeColor = "black";
var LastLoc = {x:0,y:0};
var LastTime = 0;//利用时间戳的做法
var LastLineWidth = -1;
var canvasHeight = canvasWidth;
var isMouseDown = false;



var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

canvas.width = canvasWidth;
canvas.height = canvasHeight;

//动态控制controller大小
$("#controller").css("width",canvasWidth+"px");

drawGrid();

$("#clear_btn").click(function(e){
    context.clearRect(0,0,canvasWidth,canvasHeight);
    //清空所有的东西后重新绘制米字格
    drawGrid();
});
$(".color_btn").click(function(e){
    $(".color_btn").removeClass("color_btn_selected");
    $(this).addClass("color_btn_selected");
    strokeColor = $(this).css("background-color");
});

function begainStroke(point){
    isMouseDown =true;
    LastLoc = windowToCanvas(point.x, point.y);
    LastTime = new Date().getTime();//返回当前时间戳
}
function endStroke(){
    isMouseDown = false;
}
function moveStroke(point){
    var curLoc = windowToCanvas(point.x, point.y);//得到当前鼠标点击的坐标
    var curTime = new Date().getTime();
    var  s = calcDistance(curLoc,LastLoc);
    var t = curTime - LastTime;
    var lineWidth = calcLineWidth(t,s);

    //draw
    context.beginPath();
    context.moveTo(LastLoc.x , LastLoc.y);
    context.lineTo(curLoc.x , curLoc.y);

    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = strokeColor;
    context.stroke();

    LastLoc = curLoc;
    LastTime = curTime;
    LastLineWidth = lineWidth;
}
canvas.onmousedown = function(e){
    e.preventDefault();//当用于移动端是阻止默认的事件响应
    //isMouseDown =true;
    //console.log("mouse down");
    //alert(e.clientX+","+ e.clientY);
    //LastLoc = windowToCanvas(e.clientX, e.clientY);
    //LastTime = new Date().getTime();//返回当前时间戳
    //alert(loc.x+","+loc.y);
    begainStroke({x:e.clientX,y:e.clientY});
};
canvas.onmouseup = function(e){
    e.preventDefault();//当用于移动端是阻止默认的事件响应
    //isMouseDown = false;
    //console.log("mouse up");
    endStroke();
};
canvas.onmouseout = function(e){
    e.preventDefault();//当用于移动端是阻止默认的事件响应
    //isMouseDown = false;
    //console.log("mouse out");
    endStroke();
};
canvas.onmousemove = function(e){
    e.preventDefault();//当用于移动端是阻止默认的事件响应
    if(isMouseDown){

        //console.log("mouse move");
        //var curLoc = windowToCanvas(e.clientX, e.clientY);//得到当前鼠标点击的坐标
        //var curTime = new Date().getTime();
        //var  s = calcDistance(curLoc,LastLoc);
        //var t = curTime - LastTime;
        //var lineWidth = calcLineWidth(t,s);
        // draw
        //context.beginPath();
        //context.moveTo(LastLoc.x , LastLoc.y);
        //context.lineTo(curLoc.x , curLoc.y);
        //
        //context.lineWidth = lineWidth;
        //context.lineCap = "round";
        //context.lineJoin = "round";
        //context.strokeStyle = strokeColor;
        //context.stroke();
        //
        //LastLoc = curLoc;
        //LastTime = curTime;
        //LastLineWidth = lineWidth;
        moveStroke({x: e.clientX,y: e.clientY});
    }
};

//触控相关的代码,利用监听器
canvas.addEventListener("touchstart",function(e){
    e.preventDefault();
    var touch = e.touches[0];//防止多点触控，以第0个触控为准
    begainStroke({x:touch.pageX,y:touch.pageY});
});
canvas.addEventListener("touchmove",function(e){
    e.preventDefault();
    if(isMouseDown){
        touch = e.touches[0];
        moveStroke({x:touch.pageX,y:touch.pageY});
    }
});
canvas.addEventListener("touchend",function(e){
    e.preventDefault();
    endStroke();
});

//找出适当的lineWidth

var maxLineWidth = 20;
var minLineWidth = 1;
var maxStrokeV = 10;
var minStrokeV = 0.1;
function calcLineWidth(t,s){
    var v = s/t;
    var resultLineWidth = 0;
    if(v<=minStrokeV){
        resultLineWidth = maxLineWidth;
    }
    else if(v>=maxStrokeV){
        resultLineWidth = minLineWidth;
    }
    else{
        resultLineWidth = maxLineWidth - (v-minStrokeV)/(maxStrokeV-minStrokeV)*(maxLineWidth-minLineWidth);
    }
    if(LastLineWidth == -1){
        return resultLineWidth;
    }
    return LastLineWidth*2/3 + resultLineWidth*1/3;
}
//找出mouseMove前后两点的距离
function calcDistance(loc1,loc2){
    return Math.sqrt((loc1.x - loc2.x)*(loc1.x - loc2.x) + (loc1.y - loc2.y)*(loc1.y - loc2.y));
}

function windowToCanvas(x,y){
    var bbox = canvas.getBoundingClientRect();//拿到canvas的包围盒
    return {x:Math.round(x-bbox.left),y:Math.round(y-bbox.top)};
}
//drawGrid函数画出田字格
function drawGrid(){
    var curWidth = canvas.width;
    var curHeight = canvas.height;
    //。save()和.restore()让drawDrid()里面设置的状态不会影响以后的状态设置
    context.save();
    context.strokeStyle = "rgb(230,11,9)";

    context.beginPath();
    context.moveTo(3,3);
    context.lineTo(canvasWidth-3,3);
    context.lineTo(canvasWidth-3,canvasHeight-3);
    context.lineTo(3,canvasHeight-3);
    context.closePath();

    context.lineWidth = 6;
    context.stroke();

    context.beginPath();
    //context.moveTo(0,0);
    //context.lineTo(canvasWidth,canvasHeight);
    //
    //context.moveTo(canvasWidth,0);
    //context.lineTo(0,canvasHeight);
    drawBash(0,0,10,10,700,700);
    drawBash1(curWidth,0,curHeight-10,10,700,700);
    context.moveTo(canvasWidth/2,0)
    context.lineTo(canvasWidth/2,canvasHeight);

    context.moveTo(0,canvasHeight/2);
    context.lineTo(canvasWidth,canvasHeight/2);

    context.lineWidth = 1;
    context.stroke();
    context.restore();
}
function drawBash(x1,y1,x2,y2){
    for(var i = 0;i<50;i++){
        context.beginPath();
        context.moveTo(x1,y1);
        context.lineTo(x2,y2);

        context.lineWidth =1;
        context.strokeStyle = "rgb(230,11,9)"
        context.stroke();
        x1+=15;
        x2+=15;
        y1+=15;
        y2+=15;
    }
}
function drawBash1(x1,y1,x2,y2){
    for(var i = 0;i<50;i++){
        context.beginPath();
        context.moveTo(x1,y1);
        context.lineTo(x2,y2);

        context.lineWidth =1;
        context.strokeStyle = "rgb(230,11,9)"
        context.stroke();
        x1-=15;
        x2-=15;
        y1+=15;
        y2+=15;
    }
}