/*
 * Project: Web Based GIS Assignment 2
 * File: route_submit.php
 * File Created: Wednesday, 4th May 2022 8:22:21 pm
 * Student Number: 201578549
 * -----
 * Last Modified: Wednesday, 4th May 2022 8:22:27 pm
 * -----
 * License: MIT
 */

 <?php


function sanitise($str){
    $sanStr=filter_var($str,FILTER_SANITIZE_SPECIAL_CHARS);
    $sanStr=trim($sanStr);
    $pattern1="/[\(\)\[\]\{\}]/";
    $sanStr=preg_replace($pattern1," - ",$sanStr);
    $pattern2="/[^A-Za-z0-9\s\.\:\-\+\!\@\,\'\"]/";
    $sanStr = preg_replace($pattern2,"",$sanStr);
    if (strlen($sanStr)>500){
        $sanStr = substr($sanStr,0,500);
    }    
    return $sanStr;
}

$fdesc=sanitise($_POST["fdesc"]);
$froute=$_POST["froute"];


//Connect to database

$pgsqlOptions = "host='dialogplus.leeds.ac.uk' dbname='geog5871' user='geog5871student' password='Geibeu9b'";
$dbconn = pg_connect($pgsqlOptions) or die ('connection failure');

$query = "INSERT INTO gy21km_routes_submit (route,description,approved) VALUES ('$froute','$fdesc','true')";

$result=pg_query($query) or die ('Query failed: '.pg_last_error());

pg_close($dbconn);

header("Location: http://dialogplus.leeds.ac.uk/geog5870/web40/Assignment%202/My%20Map/index.html")

 ?>