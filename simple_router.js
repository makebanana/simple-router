
function  Srouter(configObj){
	if(!configObj.dom_box){
		console ? console.warn('forget add a dom for show pageHTML') : alert('forget add a dom for show pageHTML');
		return
	}
	this._dom_box = configObj.dom_box;
	this._undefind_index = 0;
	this._router  = this.packageRouters(configObj.router);
	this._current = '';
	this.init();
}
Srouter.prototype.packageRouters = function(routerArr){

	var _len = routerArr.length,i;
	for(i = 0; i < _len; i++){
		this.packageRouter(routerArr[i],i);
	}
	return routerArr;
};
Srouter.prototype.packageRouter = function(router,index){
	var _query  = {};
	var _index;
	if(router['noFind']){
		this._undefind_index = index;
	}
	router['realPath'] = router.path.replace(/\{(\w+)\}/g,function(match,key,index,str) {
			_index = 0;
			str.split(match)[0].replace(/\//g,function(){
				_index = _index + 1;
			});
			_query[_index] = key;
            return 'ANYKEY';
        });
	if(_index !== undefined){ router['query'] = _query;};

	return router;

};
Srouter.prototype.matchHash = function(hash){

	var _arrHashParms,
	 	_parms = {},
	  	_lenParms, 
	  	_i;

	var _lenRouter = this._router.length, 
		_realPath = hash,
		_j,  
		_key;

	var _returnObj = {
		index:'0',
		path: this._router[0].path,
		parms:_parms
	}

	if(hash.indexOf('?') > -1){

		_realPath = hash.substr(0,hash.indexOf('?'));

		_arrHashParms = hash.split('?')[1].split('&');

		_lenParms = _arrHashParms.length;

		for(_i = 0;_i < _lenParms; _i++){
			_parms[_arrHashParms[_i].split('=')[0]] = _arrHashParms[_i].split('=')[1];
		}
	}

	//排除了没有找到以及第一个/
	for(_j = 0; _j < _lenRouter; _j++){
		if(this._router[_j]['realPath'].split('/').length === _realPath.split('/').length){
			if(this._router[_j]['query']){
				_realPath =_realPath.split('/');
				for(_key in this._router[_j]['query']){
					_parms[this._router[_j]['query'][_key]] = _realPath[_key];
					_realPath[_key] = 'ANYKEY';
				};

				_realPath = _realPath.join('/');
			}

			if(this._router[_j]['realPath'] === _realPath){
				_returnObj['index'] = _j;
				_returnObj['path']  = this._router[_j]['path'];
			}

		}
	}

	return _returnObj;

};

Srouter.prototype.updateDomFn = function(){
	var _dom =  this._dom_box;
     
     return function(domHTML){
     	_dom.innerHTML = domHTML;
     }

};
Srouter.prototype.hashRun = function(hash){

		var _nextHash = location.hash.substr(1);

		if(_nextHash === this._current){return};

		//获取将要去路由path，以及附带的参数，返回格式{index: '' path：‘’，parms：{}}
		var _next   = this.matchHash(_nextHash);
		console.log(_next.index)
	    //获取hash改变前停留的路由在路由库中的索引
	    var _currentIndex = this.matchHash(this._current)['index'];

	    //如果上一个页面在离开时，需要清理部分函数
	    this._current !== '' && this._router[_currentIndex]['leave'] && this._router[_currentIndex]['leave']();

	    var _fn = this.updateDomFn();
	    //页面进入目标对象
    	this._router[_next['index']]['enter'](_fn,_next['parms'],this._router[_next['index']]);

    	//更新指针
    	this._current = _nextHash;

};
Srouter.prototype.init = function(hash){
	//获取默认进入并加载,不绑定load怕在load之后调用不能达到效果
	this.hashRun();

	 //监听hash路由变化
	
	window.addEventListener ? window.addEventListener("hashchange",this.hashRun.bind(this)):window.attachEvent("hashchange",this.hashRun.bind(this));
};