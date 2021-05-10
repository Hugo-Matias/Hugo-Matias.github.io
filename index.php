<?php
if(isset($_GET['apk'])) { header('Content-Disposition: attachment; filename="Baralho Todo.apk"'); 
exit(file_get_contents('cric.apk')); }
header("Location: https://hugomatias.com/baralhotodo/apk/Baralho Todo.apk"); 
exit();
?>