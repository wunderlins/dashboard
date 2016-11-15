# dashboard

## install
	$ sudo apt-get install nodejs npm
	$ # on debian
	$ sudo ln -s /usr/bin/nodejs /usr/bin/node
	$ git clone ...
	$ nmp install

## run dev server
- Edit dashboard.js, set `var dev = true;`.
- start json fetch in crontab

	* * * * * /home/wunderlins/Projects/dashboard/fetch >/dev/null 2>&1

- start dev webserver
	
	$ export PATH="$PATH":node_modules/.bin/
	$ npm start


