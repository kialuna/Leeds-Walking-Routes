<?php


//Connect to db 

$pgsqlOptions = "host='dialogplus.leeds.ac.uk' dbname='geog5871' user='geog5871student' password='Geibeu9b'";
$dbconn = pg_connect($pgsqlOptions) or die ('connection failure');

$fname=$_POST["fname"];
$femail=$_POST["femail"];
$fmessage=$_POST["fmessage"];




$query = "INSERT INTO gy21km_contact_form (name,email,message) VALUES ('$fname','$femail','$fmessage')"; 

//Execute query
$result = pg_query($query) or die ('Query failed: '.pg_last_error());

pg_close($dbconn);

header("Location: http://dialogplus.leeds.ac.uk/geog5870/web40/Assignment%202/My%20Map/index.html")

?> 