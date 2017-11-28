'use strict';

/**
 * It is free open-source software released under the MIT License.
 *
 * @author Anatoly Fenric <anatoly.fenric@gmail.com>
 * @copyright Copyright (c) 2017 by Fenric Laboratory
 * @license https://raw.githubusercontent.com/fenric/js-http-request/master/LICENSE
 * @link https://github.com/fenric/js-http-request
 */

var $request;

/**
 * Конструктор компонента
 *
 * @constructor
 */
$request = function()
{
	this.XMLHttpRequest = new XMLHttpRequest();
};

/**
 * Получение версии компонента
 *
 * @return  {string}
 */
$request.getVersion = function()
{
	return '1.0.3';
};

/**
 * Отправка запроса по средствам GET метода
 *
 * @param   {string}   url
 * @param   {object}   params
 *
 * @return  {object}
 */
$request.get = function(url, params)
{
	var request;

	params = params || {};

	request = new $request();

	request.open('GET', url, params);

	request.getXMLHttpRequest().send();

	return request;
};

/**
 * Отправка запроса по средствам PUT метода
 *
 * @param   {string}   url
 * @param   {object}   data
 * @param   {object}   params
 *
 * @return  {object}
 */
$request.put = function(url, data, params)
{
	var request;

	params = params || {};

	request = new $request();

	request.open('PUT', url, params);

	request.getXMLHttpRequest().send(data);

	return request;
};

/**
 * Отправка запроса по средствам POST метода
 *
 * @param   {string}   url
 * @param   {object}   data
 * @param   {object}   params
 *
 * @return  {object}
 */
$request.post = function(url, data, params)
{
	var request;

	params = params || {};

	request = new $request();

	request.open('POST', url, params);

	if (Object.prototype.toString.call(data) === '[object Object]')
	{
		data = $request.serialize(data);
	}

	request.getXMLHttpRequest().send(data);

	return request;
};

/**
 * Отправка запроса по средствам PATCH метода
 *
 * @param   {string}   url
 * @param   {object}   data
 * @param   {object}   params
 *
 * @return  {object}
 */
$request.patch = function(url, data, params)
{
	var request;

	params = params || {};

	request = new $request();

	request.open('PATCH', url, params);

	if (Object.prototype.toString.call(data) === '[object Object]')
	{
		data = $request.serialize(data);
	}

	request.getXMLHttpRequest().send(data);

	return request;
};

/**
 * Отправка запроса по средствам DELETE метода
 *
 * @param   {string}   url
 * @param   {object}   params
 *
 * @return  {object}
 */
$request.delete = function(url, params)
{
	var request;

	params = params || {};

	request = new $request();

	request.open('DELETE', url, params);

	request.getXMLHttpRequest().send();

	return request;
};

/**
 * Сериализация данных
 *
 * @param   {object}   data
 *
 * @return  {string}
 */
$request.serialize = function(data)
{
	var key, segment, segments;

	segments = new Array();

	for (key in data)
	{
		segment = $request.serializeSegment(key, data[key]);

		if (segment.length > 0)
		{
			segments.push(segment);
		}
	}

	return segments.join('&');
};

/**
 * Сериализация части данных
 *
 * @param   {mixed}   key
 * @param   {mixed}   value
 *
 * @return  {string}
 */
$request.serializeSegment = function(key, value)
{
	var i, k, segments;

	segments = new Array();

	switch (Object.prototype.toString.call(value))
	{
		case '[object Array]'
		:
			for (i = 0; i < value.length; i++)
			{
				segments.push($request.serializeSegment(key + '[]', value[i]));
			}
			break;

		case '[object Object]'
		:
			for (k in value)
			{
				segments.push($request.serializeSegment(key + '[' + k + ']', value[k]));
			}
			break;

		case '[object Number]' :
		case '[object String]' :
			segments.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
			break;
	}

	return segments.join('&');
};

/**
 * Подготовка URL
 *
 * @param   {string}   url
 * @param   {object}   params
 *
 * @return  {string}
 */
$request.prepareURL = function(url, params)
{
	var key, expression;

	for (key in params)
	{
		expression = new RegExp('{' + key + '}', 'g');

		url = url.replace(expression, params[key]);
	}

	return url + (url.indexOf('?') < 0 ? '?' : '&') + Math.random();
};

/**
 * Получение экземпляра объекта [XMLHttpRequest]
 *
 * @return  {object}
 */
$request.prototype.getXMLHttpRequest = function()
{
	return this.XMLHttpRequest;
};

/**
 * Открытие соединения
 *
 * @param   {string}   verb
 * @param   {string}   url
 * @param   {object}   params
 *
 * @return  {void}
 */
$request.prototype.open = function(verb, url, params)
{
	params = params || {};

	(function(self)
	{
		params['root'] = window.location.pathname.replace(/\/$/, '') || '';

		self.getXMLHttpRequest().open(
			verb, $request.prepareURL(url, params)
		);

		self.getXMLHttpRequest().setRequestHeader(
			'Accept', 'application/json, application/xml, text/plain, text/html'
		);

		self.getXMLHttpRequest().setRequestHeader(
			'Content-Type', 'application/x-www-form-urlencoded'
		);

		self.getXMLHttpRequest().setRequestHeader(
			'X-Requested-With', 'XMLHttpRequest'
		);

		self.getXMLHttpRequest().onload = function(event)
		{
			var response;

			event.$request = self;

			try
			{
				response = JSON.parse(this.responseText);
			}
			catch (e)
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

		self.getXMLHttpRequest().onerror = function(event)
		{
			event.$request = self;

			if (params.onerror instanceof Function)
			{
				params.onerror.call(this, event);
			}
		};

		self.getXMLHttpRequest().onabort = function(event)
		{
			event.$request = self;

			if (params.onabort instanceof Function)
			{
				params.onabort.call(this, event);
			}
		};

		self.getXMLHttpRequest().onprogress = function(event)
		{
			event.$request = self;

			if (params.onprogress instanceof Function)
			{
				params.onprogress.call(this, event);
			}
		};

	}(this);
};
