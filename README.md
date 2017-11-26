# Lite XMLHttpRequest wrapper.

### Install via bower
```
bower install fenric-js-http-request
```

### Using after install via bower
```
<script src="bower_components/fenric-js-http-request/src/request.js"></script>
```

### Example for GET verb
```
$request.get('/api/publication/{id}/', {id: 1, success: function(response, event)
{
	console.dir(response);
}});
```

### Example for POST verb
```
let data = {
	title: "Title of a publication",
	content: "Content of a publication.",
};

$request.post('/api/publication/', data, {success: function(response, event)
{
	console.dir(response);
}});
```

### Example for PATCH verb
```
let data = {
	title: "Edited title of a publication",
	content: "Edited content of a publication.",
};

$request.patch('/api/publication/{id}/', data, {id: 1, success: function(response, event)
{
	console.dir(response);
}});
```

### Example for DELETE verb
```
$request.delete('/api/publication/{id}/', {id: 1, success: function(response, event)
{
	console.dir(response);
}});
```

### Example for PUT verb (upload files)
```
var form, input;

form = document.querySelector('form');

if (form instanceof Node)
{
	input = form.querySelector('input[type="file"]');

	if (input instanceof Node)
	{
		input.addEventListener('change', function(event)
		{
			if (this.files.length > 0)
			{
				$request.put('/api/upload/', this.files[0], {success: function(response, event)
				{
					console.dir(response);
				}});
			}
		});
	}
}
```

### Other request parameters
```
$request.get('/api/publications/',
{
	// @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/onabort
	onabort: function(response, event)
	{
		// some code
	},

	// @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/onerror
	onerror: function(response, event)
	{
		// some code
	},

	// @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/onload
	onload: function(response, event)
	{
		// some code
	},

	// @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/onprogress
	onprogress: function(response, event)
	{
		// some code
	},

	// When the server returns a status code >= 400 or <= 499
	clienterror: function(response, event)
	{
		// some code
	},

	// When the server returns a status code >= 500 or <= 599
	servererror: function(response, event)
	{
		// some code
	},

	// When the server returns a status code 200, 201 or 202
	success: function(response, event)
	{
		// some code
	},
});
```

