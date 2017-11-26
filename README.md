# Lite XMLHttpRequest wrapper.

### Install via bower
```
bower install fenric-js-http-request
```

### Using after install via bower
```
<script src="bower_components/fenric-js-http-request/src/request.js"></script>

<script>
  $request.patch('/api/publication/{id}/', {title: "Edited a title"}, {id: 1, success: function(response, event)
  {
    console.dir(this);
    console.dir(response);
    console.dir(event);
  }});
</script>
```
