<?php

ini_set('memory_limit','-1');

$preguntas_eval=$datos['data1'];
$arr_pregun=[];
foreach($preguntas_eval as $rows)
{
	$arr_pregun[$rows->id_eval_pregunta]=$rows->pregunta;
}

$num_preguntas=count($arr_pregun);
$datos2=$datos['data2'];

$html="<table border=1 >";
foreach($datos2 as $rowsx)
{	
$datos_eval[$rowsx->id_alumno][$rowsx->id_examen][$rowsx->id_pregunta]=$rowsx->nota;		
}

$querys_add="INSERT examen_alumnos_det (`id_examen`,`id_pregunta`,`opcion_alias`,`created_date`						,`user_created`) VALUES";

foreach($datos_eval as $id_alum=>$array_examen)
{
		$html.="<tr>";
		$html.="<td >".$id_alum."</td>";	
		$valid_npreg=0;	
		foreach($array_examen as $id_exa=>$array_pregunt)
		{
			$valid_npreg=count($array_pregunt);
			$html.="<td>".$id_exa."</td>";			
			if($valid_npreg<$num_preguntas)
			{
				foreach($arr_pregun as $idpreg=>$preg)
				{
					if(isset($array_pregunt[$idpreg]))
					{
						$html.="<td >".$idpreg."</td>";
						//echo $idpreg."--";
						//print_r($array_pregunt);
						//echo "<br>";
						
					}
					else
					{
						$html.="<td >**</td>";
						$querys_add.="(".$id_exa.",".$idpreg.",'',NOW(),1),";
					}
					
				}				
			}
			else
			{
				
					$html.="<td colspan=".$num_preguntas.">-</td>";
								
			}
		}
		$html.="</tr>";
		
}		
$html.="</table>";

echo $html;
echo "<br>";
echo "<br>";

echo $querys_add;
echo "<br>";
echo "<br>";
echo "<br>";
echo "<hr>";




	
	

?>