(function () {
    "use strict";

    /************************************/
    /** ------ Global utilities ------ **/
    /************************************/
    jasmine.getEnv().defaultTimeoutInterval = 20000;
    var http = require('http'),
        request = require('request'),
        webdriver = require('../rtd/node_modules/selenium-webdriver'),
        driver,
        flow = webdriver.promise.controlFlow(),
        newRun;

    var getWebdriverSessions = function (callback) {
        request.get({
            url: 'http://localhost:4444/wd/hub/sessions',
            headers: {
                'Content-type': 'application/json'
            }
        }, function (error, response, body) {
            callback(JSON.parse(body).value);
        });
    };

    var getWebdriverSessionStatus = function (sessionId, callback) {
        request.get({
            url: 'http://localhost:4444/wd/hub/session/' + sessionId + '/url',
            headers: {
                'Content-type': 'application/json'
            }
        }, function (error, response) {
            callback(response.statusCode);
        });
    };

    var deleteWebdriverSession = function (sessionId) {
        request.del({
            url: 'http://localhost:4444/wd/hub/session/' + sessionId,
            headers: {
                'Accept': 'application/json'
            }
        }, null);
    };

    var deleteWebdriverSessions = function (sessions) {
        for (var i = 0; i < sessions.length; i += 1) {
            deleteWebdriverSession(sessions[i].id);
        }
    };

    var reuseOrCreateSession = function (sessions) {
        if (sessions.length === 0) {
            driver = require('../rtd/webdrivers/selenium-server.js')(webdriver, { browserName: 'chrome' });
            driver.manage().timeouts().setScriptTimeout(2000);
            driver.manage().timeouts().implicitlyWait(2000);
        } else {
            var tempDriver = require('../rtd/webdrivers/selenium-server.js')(webdriver, { browserName: 'chrome' }, sessions[0].id);
            getWebdriverSessionStatus(sessions[0].id, function (status) {
                if (status !== 200) {
                    deleteWebdriverSessions(sessions);
                    tempDriver = require('../rtd/webdrivers/selenium-server.js')(webdriver, { browserName: 'chrome' });
                }
                tempDriver.manage().timeouts().setScriptTimeout(2000);
                tempDriver.manage().timeouts().implicitlyWait(2000);
                driver = tempDriver;
            });
        }
    };

    getWebdriverSessions(reuseOrCreateSession);

    var resetApp = function () {
        var deferred = webdriver.promise.defer();
        driver.get('http://localhost:8000/reset').then(function () {
            deferred.resolve();
        });
        return deferred.promise;
    };

    var openApp = function () {
        var deferred = webdriver.promise.defer();
        driver.get('http://localhost:8000').then(function () {
            deferred.resolve();
        });
        return deferred.promise;
    };


    var postBackCoverage = function () {
        return driver.executeScript(function () {
            document.postCoverage();
        });
    };

    var waitForWebdriver = function (callback) {
        if (driver) {
            callback();
        }
        newRun = true;
        waitsFor(function () {
            return driver;
        }, "Webdriver did not initialize.\nYou may need to restart RTD", 10000);
        runs(function () {
            callback();
        });
    };

    var error = function (err) {
        console.log('\n');
        console.error(err);
        console.error('Error in acceptance tests');
    };

    /*****************************************/
    /** ------ End global utilities ------- **/
    /*****************************************/

    /***********************************/
    /** ------ Test utilities ------- **/
    /***********************************/

    // Load fixture data
    var setupUrls = function () {
        return driver.get('http://localhost:8000/setupUrls');
    };

    /***************************************/
    /** ------ End test utilities ------- **/
    /***************************************/
    

    /*********************************/
    /** ------ Actual tests ------- **/
    /*********************************/
    beforeEach(function () {
	    // Reset DB data and open app
        var ready = false;
        waitForWebdriver(function () {
            resetApp().
                then(setupUrls).
                then(openApp).
                then(function () {
                    ready = true;
                });
        });
        waitsFor(function () {
            return ready;
        }, "App didn't reset", 10000);
    });

    afterEach(function() {
	    // Post back code that was covered as part of these tests
        var ready = false;
        postBackCoverage().then(function () {
            ready = true;
        });
        waitsFor(function () {
            return ready;
        }, "Coverage didn't postback", 10000);
    });

    describe("Url shortening functionality", function () {
	    var deferred = webdriver.promise.defer();

	    it("Will trigger an erronous state when an invalid URL is entered", function (done) {	
	        // @TODO: get this working via driver.wait without it RTD failing it				
			setTimeout(function() {
				driver.findElement(webdriver.By.css('#input-shorten')).click();
				// Test for invalid state
				try {
					driver.findElement(webdriver.By.css('.form-group.has-error'));
					expect('Error elements present').toBe('Error elements present');

					// Cover failed branch
					driver.findElement(webdriver.By.css('#input-url')).sendKeys("www.");
					driver.findElement(webdriver.By.css('#input-shorten')).click();

					// Try typing in field to ensure error is not visible
					driver.findElement(webdriver.By.css('#input-url')).sendKeys("google.com");
					driver.findElement(webdriver.By.css('#input-shorten')).click();
					driver.findElement(webdriver.By.css('.error-label')).then(function(errorLabel) {
						errorLabel.isDisplayed().then(function(isDisplayed) {
						    expect(isDisplayed).toBe(false);
						})
					});
				} catch(exception) {
					expect('Error elements present').toBe('Error elements not present');
				} finally {
					// So that animation can be hit for code coverage
					setTimeout(function() {
						done();
					}, 500);
				}
			}, 1000);
        });


        it("Will trigger a result state when a valid URL is entered", function (done) {
			// @TODO: get this working via driver.wait without it RTD failing it					
			setTimeout(function() {
				driver.findElement(webdriver.By.css('#input-url')).sendKeys("http://oneseriouslyverylongnoimeanreallylongurl.com");
				driver.findElement(webdriver.By.css('#input-shorten')).click();
				driver.findElement(webdriver.By.css('.table-responsive')).then(function(resultsTable) {
					resultsTable.isDisplayed().then(function(isDisplayed) {
					    expect(isDisplayed).toBe(true);
					    done();
					});
				});
			}, 1000);
	    });

        it("Will generate the same output URL when the same input URL is input", function (done) {
			// @TODO: get this working via driver.wait without it RTD failing it					
			setTimeout(function() {
				driver.findElement(webdriver.By.css('#input-url')).sendKeys("http://google.com");
				driver.findElement(webdriver.By.css('#input-shorten')).click();
				setTimeout(function() {
					driver.findElement(webdriver.By.css('#input-shorten')).click();
					driver.findElements(webdriver.By.css('.url-shortened')).then(function(elements) {
						var values = new Array();
						elements.map(function(element) {
							element.getText().then(function(value) {
								values.push(value);
								if(values.length === 2) {
									expect(values[0]).toBe(values[1]);
									done();
								}
							})
							//done();
						})
					});
				}, 2000);

			}, 2000);
	    });
        
	    it("Will redirect to a URL when a valid short URL is entered", function (done) {				
			setTimeout(function() {
				driver.findElement(webdriver.By.css('#input-url')).sendKeys("http://google.co.uk");
				driver.findElement(webdriver.By.css('#input-shorten')).click();
				driver.findElements(webdriver.By.css('.url-shortened')).then(function(elements) {
					var newTitle = "";
					var originalURL = driver.getCurrentUrl();
					elements.map(function(element) {
						element.getText().then(function(value) {
							driver.get(value);
							driver.getTitle().then(function(title) {
								newTitle = title;
								driver.get(originalURL);
								expect(newTitle).toBe("Google");
								done();
							});
						})
					})
				});

			}, 2000);
	    });

    });

    /******************************/
    /** ------ End tests ------- **/
    /******************************/

})();