module.exports = function type__object (jh) {

    return {

        command: {

            execute: {
                options: jh.exec.options,
                fn: function (scope, options) {
                    return jh.exec.fn(scope, options);
                }
            }
			
			print:{
			 options: {
					var rl = readline.createInterface({
						 input: process.stdin,
						 output: process.stdout
						 
						 rl.question("Can you try accepting Input Please? ", function(answer) {
  
						console.log("Thank you For typing: Your Input is ", answer);
                }
            }

        }

    };

};
