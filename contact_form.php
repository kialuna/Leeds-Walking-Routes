/*
 * Project: Web Based GIS Assignment 2
 * File: contact_form.php
 * File Created: Tuesday, 3rd May 2022 2:36:00 pm
 * Student Number: 201578549
 * -----
 * Last Modified: Wednesday, 4th May 2022 12:23:55 pm
 * -----
 * License: MIT
 */


<?php

// Function to clean and filter user's inputs

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
};

//Connect to database

$pgsqlOptions = "host='dialogplus.leeds.ac.uk' dbname='geog5871' user='geog5871student' password='Geibeu9b'";
$dbconn = pg_connect($pgsqlOptions) or die ('connection failure');

// Get data from form and clean it

$fname=sanitise($_POST["fname"]);
$femail=sanitise($_POST["femail"]);
$fmessage=sanitise($_POST["fmessage"]);


//Query to insert data into pgadmin table

$query = "INSERT INTO gy21km_contact_form (name,email,message) VALUES ('$fname','$femail','$fmessage')"; 

//Execute query

$result = pg_query($query) or die ('Query failed: '.pg_last_error());

// Close database connection

pg_close($dbconn);

//Go back to homepage

header("Location: http://dialogplus.leeds.ac.uk/geog5870/web40/Assignment%202/My%20Map/index.html");

?>