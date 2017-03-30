
function  Srouter(configObj){
	if(!configObj.dom_box){
		if(console){
			console.warn('forget add a dom for show pageHTML');
		}else{
			alert('forget add a dom for show pageHTML');
		}
		return;
	}
	this._undefind_index = 0;
	this._router  = this.packageRouters(configObj.router);
	this._current = {
		index: '',
		path: '',
		parms: {}
	};
	this._callback = this.updateDomFn(configObj.dom_box);
	this.init();
}
/**
 * [packageRouters 对用户写入的路由组数据进行处理]
 * @param  {[array]} routerArr [用户实例化传入的路由组]
 * @return {[array]}           [经过封装之后的路由组]
 */
Srouter.prototype.packageRouters = function(routerArr){

	var _len = routerArr.length,i;
	for(i = 0; i < _len; i++){
		this.packageRouter(routerArr[i],i);
	}
	return routerArr;
};
/**
 * [packageRouter 对写入的单个路由进行数据处理，单独出来考虑将来使用 add 新增路由]
 * @param  {[object]} router [单个路由对象]
 * @param  {[number]} index  [当前在路由库中的索引]
 * @return {[object]}        [封装数据路由]
 */
Srouter.prototype.packageRouter = function(router,index){
	var _query  = {};
	var _index;
	if(router.noFind){
		this._undefind_index = index;
	}
	router.realPath = router.path.replace(/\{(\w+)\}/g,function(match,key,index,str) {
			_index = 0;
			str.split(match)[0].replace(/\//g,function(){
				_index = _index + 1;
			});
			_query[_index] = key;
            return '{ANYKEY}';
        });
	if(_index !== undefined){ router.query = _query;}

	return router;

};
/**
 * [matchHash 匹配改hash地址在路由库中的位置]
 * @param  {[string]} hash [需要匹配的hash值]
 * @return {[object]}      [返回一个对象包含]
 */
Srouter.prototype.matchHash = function(hash){

	var _arrHashParms,
	 	_parms = {},
	  	_lenParms, 
	  	_i;

	var _lenRouter = this._router.length, 
		_realPath = hash,
		_loopPath,
		_queryObj,
		_j,  
		_key;

	var _returnObj = {
		index:this._undefind_index,
		path: this._router[this._undefind_index].path,
		parms:{}
	};

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

		if(this._router[_j].realPath.split('/').length === _realPath.split('/').length){

			_loopPath = _realPath;

			_queryObj = {};

			if(this._router[_j].query){

				_loopPath =_loopPath.split('/');

				for(_key in this._router[_j].query){

					if(this._router[_j].query.hasOwnProperty(_key)){

						_queryObj[this._router[_j].query[_key]] = _loopPath[_key];

						_loopPath[_key] = '{ANYKEY}';
					}

				}

				_loopPath = _loopPath.join('/');

			}

			if(this._router[_j].realPath === _loopPath){

				_returnObj.index = _j;
				_returnObj.path  = this._router[_j].path;
				_returnObj.parms = _parms;

				for(_key in _queryObj){

					if(_queryObj.hasOwnProperty(_key)){

						_returnObj.parms[_key] = _queryObj[_key];

					}
				}
				break;
			}

		}
	}

	return _returnObj;

};

Srouter.prototype.updateDomFn = function(dom){  
     return function(domHTML){
     	dom.innerHTML = domHTML;
     };

};
Srouter.prototype.hashRun = function(hash){

		var _nextHash = location.hash.substr(1);

		//拦截同样的hash地址以及初级路由地址筛选
		if(_nextHash === this._current.path || _nextHash.indexOf('/') === -1 ){return;}

		//获取将要去路由path，以及附带的参数，返回格式{index: '' path：‘’，parms：{}}
		var _next   = this.matchHash(_nextHash);

		if(this._current.index !== ''){
		    //如果上一个页面在离开时，需要清理部分函数
		    if(typeof this._router[this._current.index].leave === 'function'){

		    	this._router[this._current.index].leave();
		    }

		}

	    //页面进入目标对象
    	this._router[_next.index].enter(this._callback,_next.parms,this._router[_next.index]);

    	//更新指针
    	this._current = _next;

};
Srouter.prototype.init = function(hash){

	//获取默认进入并加载,不绑定load怕在load之后调用不能达到效果
	this.hashRun();

	 //监听hash路由变化
	if(window.addEventListener){
		window.addEventListener("hashchange",this.hashRun.bind(this));
	}else{
		window.attachEvent("hashchange",this.hashRun.bind(this));
	}
};