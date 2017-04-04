module.exports = {

	/**
	 * Creates a new AWS lambda function using the npm_packages and javascript_code params
	 * @param {string[]} npm_packages 
	 * @param {string} javascript code
	 * @returns {Promise} Success promise receives the new AWS Lambda function ID
	 */
  create : function(npm_packages,javascript_code){
    console.log("This function should create an AWS lambda function with the following npm packages:");
    console.log(npm_packages);
    console.log("With this javascript code:");
    console.log(javascript_code);
  },


	/**
	 * Updates an existing AWS lambda function
	 * @param {string} AWS Lambda function ID
	 * @param {string[]} npm_packages 
	 * @param {string} javascript code
	 * @returns {Promise} Success promise receives the AWS Lambda function ID
	 */
  update : function(lambda_id, npm_packages,javascript_code){
    console.log("This function should update an existing AWS lambda function with the ID:");
    console.log(lambda_id);
    console.log("Using the following npm packages:");
    console.log(npm_packages);
    console.log("With this javascript code:");
    console.log(javascript_code);
  },

	/**
	 * Executes an existing AWS lambda function
	 * @param {string} AWS Lambda function ID
	 * @param {Object} AWS Lambda event object
	 * @returns {Promise} Success promise receives the results of the execution of the AWS lambda function
	 */
  execute : function(lambda_id, event_object){
    console.log("This function should execute an existing AWS lambda function with the ID:");
    console.log(lambda_id);
    console.log("Using the following event object:");
    console.log(event_object);
  },

	/**
	 * Deletes an existing AWS lambda function
	 * @param {string} AWS Lambda function ID
	 * @returns {Promise} 
	 */
  delete : function(lambda_id, event_object){
    console.log("This function should delete an existing AWS lambda function with the ID:");
    console.log(lambda_id);
  },

}
