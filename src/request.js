'use strict';

/**
 * It is free open-source software released under the MIT License.
 *
 * @author Anatoly Fenric <a.fenric@gmail.com>
 * @copyright Copyright (c) 2017 by Fenric Laboratory
 * @license https://raw.githubusercontent.com/fenric/js.request/master/LICENSE
 * @link https://github.com/fenric/js.request
 */

var $request;

/**
 * Конструктор компонента
 *
 * @access  public
 * @return  void
 *
 * @see     https://developer.mozilla.org/ru/docs/Web/API/XMLHttpRequest
 */
$request = function()
{
	this.XMLHttpRequest = new XMLHttpRequest();
};

/**
 * Получение версии компонента
 *
 * @access  public
 * @return  string
 */
$request.getVersion = function()
{
	return '1.0.2';
};

/**
 * Отправка запроса по средствам GET метода
 *
 * @param   string   uri
 * @param   object   params
 *
 * @access  public
 * @return  object
 */
$request.get = function(uri, params)
{
	var request;

	params = params || {};

	request = new $request();

	request.open('GET', uri, params);

	request.getXMLHttpRequest().send();

	return request;
};

/**
 * Отправка запроса по средствам PUT метода
 *
 * @param   string   uri
 * @param   object   data
 * @param   object   params
 *
 * @access  public
 * @return  object
 */
$request.put = function(uri, data, params)
{
	var request;

	params = params || {};

	request = new $request();

	request.open('PUT', uri, params);

	request.getXMLHttpRequest().send(data);

	return request;
};

/**
 * Отправка запроса по средствам POST метода
 *
 * @param   string   uri
 * @param   object   data
 * @param   object   params
 *
 * @access  public
 * @return  object
 */
$request.post = function(uri, data, params)
{
	var request;

	params = params || {};

	request = new $request();

	request.open('POST', uri, params);

	if (Object.prototype.toString.call(data) === '[object Object]')
	{
		data = request.serializable(data);
	}

	request.getXMLHttpRequest().send(data);

	return request;
};

/**
 * Отправка запроса по средствам PATCH метода
 *
 * @param   string   uri
 * @param   object   data
 * @param   object   params
 *
 * @access  public
 * @return  object
 */
$request.patch = function(uri, data, params)
{
	var request;

	params = params || {};

	request = new $request();

	request.open('PATCH', uri, params);

	if (Object.prototype.toString.call(data) === '[object Object]')
	{
		data = request.serializable(data);
	}

	request.getXMLHttpRequest().send(data);

	return request;
};

/**
 * Отправка запроса по средствам DELETE метода
 *
 * @param   string   uri
 * @param   object   params
 *
 * @access  public
 * @return  object
 */
$request.delete = function(uri, params)
{
	var request;

	params = params || {};

	request = new $request();

	request.open('DELETE', uri, params);

	request.getXMLHttpRequest().send();

	return request;
};

/**
 * Открытие соединения
 *
 * @param   string   verb
 * @param   string   uri
 * @param   object   params
 *
 * @access  public
 * @return  void
 */
$request.prototype.open = function(verb, uri, params)
{
	var self = this;

	this.getXMLHttpRequest().open(verb, this.prepareURI(uri, params));

	this.getXMLHttpRequest().setRequestHeader('Accept', 'application/json');

	this.getXMLHttpRequest().setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	this.getXMLHttpRequest().setRequestHeader('X-Requested-With', 'XMLHttpRequest');

	this.getXMLHttpRequest().onload = function(event)
	{
		var response;

		event.$request = self;

		try
		{
			response = JSON.parse(this.responseText);
		}
		catch (error)
		{
			response = this.responseText;
		}

		if (params.onload instanceof Function)
		{
			params.onload.call(this, response, event);
		}

		if (this.status >= 200 && this.status <= 202)
		{
			if (params.success instanceof Function)
			{
				params.success.call(this, response, event);
			}
		}

		if (this.status >= 400 && this.status <= 499)
		{
			if (params.clienterror instanceof Function)
			{
				params.clienterror.call(this, response, event);
			}
		}

		if (this.status >= 500 && this.status <= 599)
		{
			if (params.servererror instanceof Function)
			{
				params.servererror.call(this, response, event);
			}
		}
	};

	this.getXMLHttpRequest().onerror = function(event)
	{
		event.$request = self;

		if (params.onerror instanceof Function)
		{
			params.onerror.call(this, event);
		}
	};

	this.getXMLHttpRequest().onabort = function(event)
	{
		event.$request = self;

		if (params.onabort instanceof Function)
		{
			params.onabort.call(this, event);
		}
	};

	this.getXMLHttpRequest().onprogress = function(event)
	{
		event.$request = self;

		if (params.onprogress instanceof Function)
		{
			params.onprogress.call(this, event);
		}
	};
};

/**
 * Получение экземпляра объекта [XMLHttpRequest]
 *
 * @access  public
 * @return  object
 */
$request.prototype.getXMLHttpRequest = function()
{
	return this.XMLHttpRequest;
};

/**
 * Подготовка URI
 *
 * @param   string   uri
 * @param   object   params
 *
 * @access  public
 * @return  string
 */
$request.prototype.prepareURI = function(uri, params)
{
	var key, expression;

	for (key in params)
	{
		expression = new RegExp('{' + key + '}', 'g');

		uri = uri.replace(expression, params[key]);
	}

	return uri + (uri.indexOf('?') < 0 ? '?' : '&') + Math.random();
};

/**
 * Сериализация данных
 *
 * @param   object   data
 *
 * @access  public
 * @return  string
 */
$request.prototype.serializable = function(data)
{
	var key, segment, segments;

	segments = new Array();

	for (key in data)
	{
		segment = this.serializableBuildSegment(key, data[key]);

		if (segment.length > 0)
		{
			segments.push(segment);
		}
	}

	return segments.join('&');
};

$request.prototype.serializableBuildSegment = function(key, value)
{
	var i, k, segments;

	segments = new Array();

	switch (Object.prototype.toString.call(value))
	{
		case '[object Array]' :
			for (i = 0; i < value.length; i++) {
				segments.push(this.serializableBuildSegment(key + '[]', value[i]));
			}
			break;

		case '[object Object]' :
			for (k in value) {
				segments.push(this.serializableBuildSegment(key + '[' + k + ']', value[k]));
			}
			break;

		case '[object Number]' :
		case '[object String]' :
			segments.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
			break;
	}

	return segments.join('&');
};
