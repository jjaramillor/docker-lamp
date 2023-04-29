<?php

$html="<table border=1>";
$html.="<tr>";
$html.="<th>nro</th>";
$html.="<th>nota_calculada</th>";
$html.="<th>nota_tabla</th>";
$html.="<th>id_alumno</th>";
$html.="<th>id_examen</th>";
$html.="<th>evaluacion</th>";
$html.="<th>fecha_up</th>";
$html.="<th>query</th>";
$html.="</tr>";
$querys_acum="";
$i=0;
$pass='HBTM32ws';
echo "pass sin encriptar:".$pass;

$array_pass = password_hash($pass, PASSWORD_BCRYPT);

echo "pass  encriptado:";
echo $array_pass;
echo "<br>";

$fecha_hora_ser= date('Y-m-d h:m:i');
$fecha_hora_fin='2022-05-05 14:00:00';
if($fecha_hora_ser>$fecha_hora_fin)
{
    echo "paso la hora indicada :".$fecha_hora_fin;
}
else
{  
    echo "hora actual:".$fecha_hora_ser;
    echo "<br>";
    echo "falta pocos minutos para la hora indicada:".$fecha_hora_fin;
}

foreach($result_data as $dx)
{
	$i++;
	$html.="<tr>";
	$html.="<th>".$i."</th>";
	$html.="<th>".$dx->cal_nota."</th>";
	$html.="<th>".$dx->nota."</th>";
	$html.="<th>".$dx->id_alumno."</th>";
	$html.="<th>".$dx->id_examen."</th>";
	$html.="<th>".$dx->evaluacion."</th>";	
	$html.="<th>".$dx->fech_up."</th>";
	$html.="<th>UPDATE examen_alumnos set nota={$dx->cal_nota} WHERE id_examen={$dx->id_examen} AND id_evaluacion={$dx->evaluacion};</th>";
	
	$querys_acum.="UPDATE examen_alumnos set nota={$dx->cal_nota} WHERE id_examen={$dx->id_examen} AND id_evaluacion={$dx->evaluacion};\n";
	
	$html.="</tr>";
}

$html.="</table>";
echo $html;
echo "<br>";
echo $querys_acum;


?>