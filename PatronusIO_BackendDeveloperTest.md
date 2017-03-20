# Test Backend Developer #

## Task ##

Write an application in javascript (ECMAScript 6) running on nodeJS version >= 6.
The application should identify the vulnerability of the following php file:

test.php
	<html>
	  <head>
	  </head>
	  <body>

	  <form action="test.php">
	    <label for="name">TestInput:</label>
	    <input type="text" name="name" id="name">
	    <button type="submit">Send</button>
	  </form>

	  </body>
	</html>

	<?php

	if( array_key_exists( "name", $_GET ) && $_GET[ 'name' ] != NULL ) {
	    echo '<pre>Hello ' . $_GET[ 'name' ] . '</pre>';
	}

	?>

Do not rewrite or update the test.php file in any way! This file will be provided by server.

## Requirements ##

 * The application should be develop with test-driven techniques (unit test coverage of min 75% expected) and in clean code.
 * Avoid lint errors
 * Provide a README.md: Description how to start the tests and the application
 * Two parameters should be configurable via command line or configuration file (payload and url of the php file)
 * Provide only your code and configuration files which are neccessary. Do Not provide third party code or applications (e.g. node_modules)