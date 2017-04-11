module.exports = function() {

	var mode = 'live'; // local, live
	var config = {};

	if (mode == 'local') {

	} else if (mode == 'live') {

		config.tmpFolder = "./tmp/";
		config.region = "us-west-2";
		config.accessKeyId = "your access key here IAM role";
		config.secretAccessKey = "your secret key here IAM role";
		config.role_arn = "arn:aws:iam::860952709310:role/lambda_basic_execution";

	}

	return config;
};
