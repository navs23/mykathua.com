var dal= function(qry){
        var sql = require('mssql');
        
        var config = {
        user: 'navs',
        password: 'Myk@thu0',
        server: 'navs.db.9284416.hostedresource.com', // You can use 'localhost\\instance' to connect to named instance 
        database: 'navs',
     
        options: {
            encrypt: false // Use this if you're on Windows Azure 
        }
    }

    sql.connect(config).then(function() {
    	// Query 
    	
    	var request = new sql.Request();
    	request.query(qry).then(function(recordset) {
    	
    	console.dir(recordset);
    		
    	}).catch(function(err) {
    		
    	});
     
        // Stored Procedure 
    	/*
    	var request = new sql.Request();
    	request.input('input_parameter', sql.Int, value);
        request.output('output_parameter', sql.VarChar(50));
    	request.execute('procedure_name').then(function(recordsets) {
    		console.dir(recordsets);
    	}).catch(function(err) {
    		// ... error checks 
    	});
    	*/
    }).catch(function(err) {
    	// ... error checks 
    }); 

};