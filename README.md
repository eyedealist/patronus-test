# Patronus.io Backend Developer Test
*XSS vulnerability detection*
*Task [here](https://github.com/eyedealist/patronus-test/PatronusIO_BackendDeveloperTest.md)*

### Installation
```
$ git clone https://github.com/eyedealist/patronus-test
$ npm install
```

### Usage
```
$ ./index.js <url> <payload>
```
url - URL of PHP script to test (protocol optional, default HTTP)
payload - Value of 'name' parameter for GET request

### Tests
To run mocha tests and display coverage:
```
$ npm test
```
To lint files (via eslint):
```
$ npm run lint
```

### License
(The MIT License)

Copyright (c) Trevor Cords

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.