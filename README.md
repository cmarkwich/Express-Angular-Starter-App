Simple Express Angular App
==================
### Use for your own simple express angular app.

This project contains the essential goodies:
- bootstrap 3
- coffee & js (yes, both coffee and js - you pick or use both!)
- sass
- lodash
- fontawesome
- moment
- jquery (it's bootstrap navbar's fault)
- gulp
- node

Note: If you need to add more to the 'vendor' folder, make sure to specify the path in the 'gulpfile.js' file. Then do a rebuild.


##### Development
You will be working out of the 'assets' folder.

Step 1: run 'gulp dev' to run build, server and watches

Step 2: open 'localhost:3000' in your browser

step 3: begin coding

##### Production
Side Note: If you are hosting this in a subfolder on production, make sure to update the base url in 'views/preprocessed/layout.ejs'. Example: base href="/subdomain/"

Step 1: run 'npm start'
