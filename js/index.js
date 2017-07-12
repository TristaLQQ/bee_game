
var oBtn = document.getElementById('gameBtn');
	
	oBtn.onclick = function(){
		this.style.display = 'none';
		Game.init('div1');  //开始游戏的初始化
	};
	
var Game = {
	
	oEnemy : {   //敌人的数据
		e1 : {style:'enemy1',blood:1,speed:5,score:1},
		e2 : {style:'enemy2',blood:2,speed:7,score:2},
		e3 : {style:'enemy3',blood:3,speed:10,score:3}
	},
	
	gk : [  //关卡的数据
		{
			eMap : [
				'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
				'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
				'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
				'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
				'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
				'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1'
			],
			//限定每行有10列
			colNum : 10,
			iSpeedX : 10,
			iSpeedY : 10,
			times : 2000
		},
		{
			eMap : [
				'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
				'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
				'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
				'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
				'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
				'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1'
			],
			colNum : 10,
			iSpeedX : 10,
			iSpeedY : 10,
			times : 2000
		}
	],
	air : {  //飞机的数据
		style : 'air1',
		bulletStyle : 'bullet'
	},
	
	init : function(id){  //初始化
		this.oParent = document.getElementById(id);
		
		this.createScore();
		
		this.createEemey(0);
		
		this.createAir();
		
	},
	createScore : function(){  //创建积分
		var oS = document.createElement('div');
		oS.id = 'score';
		oS.innerHTML = '积分:<span>0</span>分';
		this.oParent.appendChild(oS);
		this.oSNum = oS.getElementsByTagName('span')[0];
	},
	createEemey : function(iNow){  //创建蜜蜂
		
		//判断是否不是第一次加载
		if( this.oUl ){
			this.oParent.removeChild( this.oUl );
			clearInterval(this.oUl.timer);
		}
		
		document.title = '第'+ (iNow + 1) +'关';
		
		var gk = this.gk[iNow];
		var oUl = document.createElement('ul');
		this.oUl = oUl;
		this.aLi = null;
		
		var arr = [];
		
		oUl.id = 'bee';
		oUl.style.width = gk.colNum * 40 + 'px';
		this.oParent.appendChild(oUl);
		oUl.style.left = (this.oParent.offsetWidth - oUl.offsetWidth)/2 + 'px';
		
		for(var i=0;i<gk.eMap.length;i++){
			var oLi = document.createElement('li');
			oLi.className = this.oEnemy[gk.eMap[i]].style;
			oLi.blood = this.oEnemy[gk.eMap[i]].blood;
			oLi.speed = this.oEnemy[gk.eMap[i]].speed;
			oLi.score = this.oEnemy[gk.eMap[i]].score;
			oUl.appendChild(oLi);
		}
		
		this.aLi = oUl.getElementsByTagName('li');
		
		for(var i=0;i<this.aLi.length;i++){
			arr.push( [ this.aLi[i].offsetLeft , this.aLi[i].offsetTop ] );
		}
		
		for(var i=0;i<this.aLi.length;i++){
			this.aLi[i].style.position = 'absolute';
			this.aLi[i].style.left = arr[i][0] + 'px';
			this.aLi[i].style.top = arr[i][1] + 'px';
		}
		
		this.runEnemy(gk);
		
	},
	runEnemy : function(gk){  //蜜蜂左右移动
	
		var This = this;
		
		var L = 0;
		var R = this.oParent.offsetWidth - this.oUl.offsetWidth;
	
		this.oUl.timer = setInterval(function(){
			
			if(This.oUl.offsetLeft>R){
				gk.iSpeedX *= -1;
				This.oUl.style.top = This.oUl.offsetTop + gk.iSpeedY + 'px';
			}
			else if(This.oUl.offsetLeft<L){
				gk.iSpeedX *= -1;
				This.oUl.style.top = This.oUl.offsetTop + gk.iSpeedY + 'px';
			}
			
			This.oUl.style.left = This.oUl.offsetLeft + gk.iSpeedX + 'px';
			
		},200);
		
		setInterval(function(){
			
			This.oneMove();
			
		},gk.times);
		
	},
	
	oneMove : function(){  //单只蜜蜂的向下掉落
		
		var nowLi = this.aLi[ Math.floor(Math.random()*this.aLi.length) ];
		var This = this;
		
		nowLi.timer = setInterval(function(){
			
			//left和top值根据勾股定理和等比例来计算
			var a = (This.oAir.offsetLeft + This.oAir.offsetWidth/2) - (nowLi.offsetLeft + nowLi.parentNode.offsetLeft + nowLi.offsetWidth/2);
			var b = (This.oAir.offsetTop + This.oAir.offsetHeight/2) - (nowLi.offsetTop + nowLi.parentNode.offsetTop + nowLi.offsetHeight/2);
			
			var c = Math.sqrt(a*a + b*b);
			
			var sX = nowLi.speed * a/c;
			var sY = nowLi.speed * b/c;
			
			nowLi.style.left = nowLi.offsetLeft + sX + 'px';
			nowLi.style.top = nowLi.offsetTop + sY + 'px';
			
			if( This.pz( This.oAir , nowLi ) ){
				alert('游戏结束');
				window.location.reload();
			}
			
			
		},30);
		
	},
	
	createAir : function(){  //创建飞机
		var oAir = document.createElement('div');
		
		oAir.className = this.air.style;
		
		this.oAir = oAir;
		
		this.oParent.appendChild( oAir );
		
		oAir.style.left = (this.oParent.offsetWidth - oAir.offsetWidth)/2 + 'px';
		oAir.style.top = this.oParent.offsetHeight - oAir.offsetHeight + 'px';
		
		this.bindAir();
		
	},
	bindAir : function(){  //操作飞机
	
		var timer = null;
		var iNum = 0;
		var This = this;
	
		document.onkeydown = function(ev){
			var ev = ev || window.event;
			
			if(!timer){
				timer = setInterval(show,30);
			}
			
			if( ev.keyCode == 37 ){
				iNum = 1;
			}
			else if( ev.keyCode == 39 ){
				iNum = 2;
			}
		};
		
		document.onkeyup = function(ev){
			var ev = ev || window.event;
			clearInterval(timer);
			timer = null;
			iNum = 0;
			
			if(ev.keyCode == 32){
				This.createBullet();
			}
			
		};
		
		function show(){
			//需要限制飞机的左右移动的范围，不能超出可视区的范围
			var L=0;
			var R=(This.oParent.offsetWidth - This.oAir.offsetWidth);
              //左移
			if(iNum == 1){
				 if(This.oAir.offsetLeft<=L){
				 	This.oAir.style.left =0;
				 }
				 else{
				   This.oAir.style.left = This.oAir.offsetLeft - 10 + 'px'; 	
				 }
				
			}
			//右移
			else if(iNum == 2){
				if(This.oAir.offsetLeft >=R){
					This.oAir.style.left = R+ 'px';
				}else{
				   This.oAir.style.left = This.oAir.offsetLeft + 10 + 'px';	
				}
				
			}
		}
		
	},
	createBullet : function(){  //创建子弹
		var oB = document.createElement('div');
		oB.className = this.air.bulletStyle;
		this.oParent.appendChild( oB );
		oB.style.left = this.oAir.offsetLeft + this.oAir.offsetWidth/2 + 'px';
		oB.style.top = this.oAir.offsetTop - 10 + 'px';
		this.runBullet(oB);
	},
	runBullet : function(oB){  //子弹移动
	
		var This = this;
		oB.timer = setInterval(function(){
			
			var T = oB.offsetTop - 10;
			
			if(T<-10){
				clearInterval(oB.timer);
				This.oParent.removeChild(oB);
			}
			else{
				oB.style.top = T + 'px';	
			}
			
			for(var i=0;i<This.aLi.length;i++){
				if( This.pz(oB,This.aLi[i]) ){
					
					if(This.aLi[i].blood == 1){
						
						clearInterval( This.aLi[i].timer );
						This.oSNum.innerHTML = parseInt(This.oSNum.innerHTML) + This.aLi[i].score;
						
						This.oUl.removeChild( This.aLi[i] );
						
					}
					else{
						This.aLi[i].blood--;
					}
					
					
					This.oParent.removeChild(oB);
					clearInterval(oB.timer);
				}
			}
			
			//实时监测:如果全部的蜜蜂敌人都消灭了的话，就进入下一关
			if( !This.aLi.length ){
				This.createEemey(1); //这里是定死的数字，因为这里只有两关
			}
			
		},30);
		
	},
	pz : function(obj1,obj2){  //碰撞检测
		var L1 = obj1.offsetLeft;
		var R1 = obj1.offsetLeft + obj1.offsetWidth;
		var T1 = obj1.offsetTop;
		var B1 = obj1.offsetTop + obj1.offsetHeight;
		var L2 = obj2.offsetLeft+obj2.parentNode.offsetLeft;
		var R2 = obj2.offsetLeft + obj2.offsetWidth + obj2.parentNode.offsetLeft;
		var T2 = obj2.offsetTop + obj2.parentNode.offsetTop;;
		var B2 = obj2.offsetTop + obj2.offsetHeight + obj2.parentNode.offsetTop;
		
		//四个方向都要进行检测
		if( R1<L2 || L1>R2 || T1>B2 || B1<T2 ){
			return false;
		}
		
			return true;
	}
};
