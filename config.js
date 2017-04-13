module.exports = function() {

	var config = {};

	config.tmpFolder = "./tmp/";
	config.region = "us-west-2";
	config.accessKeyId = "";
	config.secretAccessKey = "";

	config.roleName = "lambda_basic_execution3";
	config.rolePolicyDoc = {
		"Version" : "2012-10-17",
		"Statement" : {
			"Effect" : "Allow",
			"Principal" : {
				"Service" : "lambda.amazonaws.com"
			},
			"Action" : "sts:AssumeRole"
		}
	};
	config.rolePolicy = {
		"Version" : "2012-10-17",
		"Statement" : [ {
			"Effect" : "Allow",
			"Action" : [ "logs:*" ],
			"Resource" : "arn:aws:logs:*:*:*"
		} ]
	};

	return config;
};
