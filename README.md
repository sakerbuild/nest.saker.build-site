# nest.saker.build-site

The website for accessing the saker.nest repository contents. The sites uses JavaScripts to render itself and retrieves its contents from the API server of saker.nest.

The site uses `404.html` as the main page. When the page is loaded with any URL, this page will be loaded and that will dynamically load the appropriate page for the given URL.

The `index.html` file is a symbolic link to `404.html` to allow proper loading of the index page. Otherwise, GitHub Pages would render the readme if we didn't make this link. We use a symbolic link instead of duplicating the contents of `404.html` so we don't have to perform modifications twice if needed.

Available at [https://nest.saker.build](https://nest.saker.build).
