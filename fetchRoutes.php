/*
 * Project: Web Based GIS Assignment 2
 * File: fetchRoutes.php
 * File Created: Wednesday, 4th May 2022 8:46:10 pm
 * Student Number: 201578549
 * -----
 * Last Modified: Wednesday, 4th May 2022 8:46:51 pm
 * -----
 * License: MIT
 */

 <?php


/**  This file attempts to query the users routes database and return an array of string versions of the 
 *  GeoJSON features, so that these can then be changed back into geojson and displayed on the map.
*/

	
	//Connect to db 
	$pgsqlOptions = "host='dialogplus.leeds.ac.uk' dbname='geog5871' user='geog5871student' password='Geibeu9b'";
	$dbconn = pg_connect($pgsqlOptions) or die ('connection failure');
	
	//Define sql query
	$query = "SELECT route, description FROM gy21km_routes_submit WHERE approved = 'true'";

	//Execute query
	$result = pg_query($dbconn, $query) or die ('Query failed: '.pg_last_error());
	
	//Define new array to store results
	$userRoutes = array();

	//Loop through query results 
	while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
	
		//Populate userRoutes array 
		$userRoutes[] = array("route"=> $row["route"],"description"=>$row["description"]);
	};
	
    // Encode data in JSON
    echo json_encode($userRoutes);

	//Close db connection
	pg_close($dbconn);

?>