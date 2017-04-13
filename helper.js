// dependencies
var AWS = require('aws-sdk');
var shell = require('shelljs');
var Promise = require("bluebird");
var fs = require("fs");
var config = require('./config.js')();

var aws_security = {
	region : config.region,
	accessKeyId : config.accessKeyId,
	secretAccessKey : config.secretAccessKey
};
AWS.config.update(aws_security);

var lambda = new AWS.Lambda();
var iam = new AWS.IAM();

/**
 * Clean tmp directory and install the required npm modules.
 * 
 * @param {string[]}
 *            npm_packages
 * @returns {Promise}
 */
var cleanInstallNpmPackages = function(pkgArr) {
	console.log(pkgArr);
	shell.rm('-rf', config.tmpFolder + "*");

	return Promise.map(pkgArr, function(pkg) {
		console.log('Installing npm package... ' + pkg);

		return new Promise(function(resolve, reject) {

			var _npmCmd = "npm install " + pkg + " --prefix " + config.tmpFolder;
			console.log(_npmCmd);
			shell.exec(_npmCmd, function(code, stdout, stderr) {
				console.log('Exit code:', code);
				console.log('Program output:', stdout);
				if (code == 0) {
					return resolve();
				} else {
					console.log('Program stderr:', stderr);
					return reject();
				}
			});

		});

		// return fs.readFileAsync(fileName);
	}).then(function() {
		console.log("all npm pkgs install.");
		return Promise.resolve();
	});

};

/**
 * write index.js file in tmp directory.
 * 
 * @param {string}
 *            code string
 * @returns {Promise}
 */
var writeIndexFile = function(code) {
	return new Promise(function(resolve, reject) {
		fs.writeFile(config.tmpFolder + "index.js", code, function(err) {
			if (err) {
				console.log(err);
				return reject(err);
			}
			console.log("Index file created.");
			return resolve();
		});
	});
};

/**
 * zip node_modules and index.js file into lambda.zip file.
 * 
 * @returns {Promise}
 */
var zipFiles = function() {

	return new Promise(function(resolve, reject) {
		shell.cd(config.tmpFolder);
		var _zipCmd = "zip -r lambda.zip  node_modules/  index.js";
		console.log(_zipCmd);
		shell.exec(_zipCmd, function(code, stdout, stderr) {
			console.log('Exit code:', code);
			// console.log('Program output:', stdout);
			if (code == 0) {
				return resolve();
			} else {
				console.log('Program stderr:', stderr);
				return reject();
			}
		});

	});

};

var createLambdaRole = function() {
	return new Promise(function(resolve, reject) {
		var params = {
			RoleName : config.roleName,
		};
		iam.getRole(params, function(err, data) {
			if (err) {
				// console.log(err, err.stack);
				// reject(err);
				console.log('NO Role. Creating new Role');

				params['AssumeRolePolicyDocument'] = JSON.stringify(config.rolePolicyDoc);
				iam.createRole(params, function(err, data) {
					if (err) {
						console.log(err, err.stack); // an error occurred
						return reject(err);
					} else {
						console.log(data);
						var respData = data;
						console.log('Attaching Policy Now.');
						var params = {
							PolicyDocument : JSON.stringify(config.rolePolicy),
							PolicyName : 'Lambda_Custom_Policy',
							RoleName : config.roleName
						};
						iam.putRolePolicy(params, function(err, data) {
							if (err) {
								console.log(err, err.stack); // an error occurred
								return reject(err);
							} else {
								console.log(data);
								return resolve(respData);
							}
						});

					}

				});

				return;
			}
			console.log('Role already exist');
			console.log(data);
			return resolve(data);

		});

	});

};

/**
 * upload lambda function to aws. if function already exist with the given name, then it will update the code.
 * 
 * @param {string}
 *            function name of lambda
 * @returns {Promise}
 */
var uplaodLambdaFunction = function(functionName) {
	// console.log(shell.pwd());
	return new Promise(function(resolve, reject) {
		createLambdaRole().then(function(arnResp) {

			lambda.getFunction({
				'FunctionName' : functionName
			}, function(err, data) {
				if (err) {
					console.log('function ' + functionName + ' does not exist. create new');
					var params = {
						Code : {
							ZipFile : fs.readFileSync("lambda.zip")
						},
						Description : "This is function description",
						FunctionName : functionName,
						Handler : "index.handler",
						MemorySize : 128,
						Publish : true,
						Role : arnResp.Role.Arn,
						Runtime : "nodejs6.10",
						Timeout : 15,
						VpcConfig : {}
					};
					lambda.createFunction(params, function(err, data) {
						if (err) {
							console.log(err);
							return reject(err);
						} else {
							console.log('function created...');
							console.log(data);
							return resolve();
						}
					});

				} else {
					console.log('function already exist. updating...');
					console.log(data);

					var params = {
						ZipFile : fs.readFileSync("lambda.zip"),
						FunctionName : functionName
					};
					lambda.updateFunctionCode(params, function(err, data) {
						if (err) {
							console.log(err);
							return reject(err);
						} else {
							console.log('function updated...');
							console.log(data);
							return resolve();
						}
					});

				}
			});

		});

	});
};

/**
 * Main function that will create and deploy lambda function. If function name already exist, then it will update the
 * code.
 * 
 * @param {string[]}
 *            npm_packages
 * @param {string}
 *            code string
 * @param {string}
 *            function name of lambda
 * @returns {Promise}
 */

var createNDeploy = function(pkgArr, code, functionName) {
	var resp = {
		status : 0,
		message : "unable to create function"
	};
	return cleanInstallNpmPackages(pkgArr).then(function(npmInstallResp) {
		console.log("writing index.js file");
		return writeIndexFile(code);
	}).then(function(writeFileResp) {
		return zipFiles();
	}).then(function(zipFileResp) {
		console.log('all zip done');
		uplaodLambdaFunction(functionName).then(function(uploadLambdaResp) {
			console.log('DONE. function created.');
			return Promise.resolve();
		});
	});
};

/**
 * Delete lambda function
 * 
 * @param {string[]}
 *            npm_packages
 * @param {string}
 *            code string
 * @param {string}
 *            function name of lambda
 * @returns {Promise}
 */

var deleteLambda = function(functionName) {
	// return uplaodLambdaFunction(functionName);
	var resp = {
		status : 0,
		message : "unable to create function"
	};

	return new Promise(function(resolve, reject) {
		var params = {
			FunctionName : functionName
		};
		lambda.deleteFunction(params, function(err, data) {
			if (err) {
				console.log(err);
				resp.data = err;
				return reject(resp);
			} else {
				console.log('function deleted...');
				resp.status = 1;
				resp.message = "Function Deleted";
				console.log(data);
				return resolve(resp);
			}
		});

	});
};

/**
 * Executes an existing AWS lambda function
 * 
 * @param {string}
 *            AWS Lambda function Name
 * @param {string}
 *            AWS Lambda event string
 * @returns {Promise} Success promise receives the results of the execution of the AWS lambda function
 */

var executeLambda = function(functionName, event_string) {
	var resp = {
		status : 0,
		message : "unable to create function"
	};

	return new Promise(function(resolve, reject) {
		var params = {
			FunctionName : functionName,
			Payload : event_string
		};
		lambda.invoke(params, function(err, data) {
			if (err) {
				console.log(err);
				resp.data = err;
				return reject(resp);
			} else {
				console.log('function executed...');
				resp.status = 1;
				resp.message = "Function executed";
				resp.data = data;
				console.log(data);
				return resolve(resp);
			}
		});

	});
};

exports.createNDeploy = createNDeploy;
exports.deleteLambda = deleteLambda;
exports.executeLambda = executeLambda;
