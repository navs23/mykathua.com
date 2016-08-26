# youtube-simple-search
easy search in YouTube (API key needed)

### Version
0.1.1

### Using:
```sh
npm i youtube-simple-search
```


```sh
    var yss = require('youtube-simple-search');

	yss({
		key: API_KEY,
		query: 'Taylor Swift',
		maxResults: 10
	},
		callback
	);

    function callback(result) {
		console.log(result);
	}
```
