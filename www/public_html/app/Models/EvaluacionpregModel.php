<?php namespace App\Models;
namespace App\Models;

use CodeIgniter\Model;

class EvaluacionpregModel extends Model
{
    protected $table      = 'evaluacion_preguntas';
    protected $primaryKey = 'id_eval_pregunta';

    protected $useAutoIncrement = true;
    protected $returnType = 'array';
	protected $useSoftDeletes = false;
	
	 /* ($id_ugel,$cod_local,$id_nivel,$id_evaluacion,$grado,$seccion);*/	
	public function reporte_notas_colegio($id_ugel,$cod_local,$id_nivel,$id_evaluacion,$grado,$seccion)
	{
		$db = \Config\Database::connect();	
		
		$sql="SELECT c.nota,a.escala1,a.escala2,a.escala3,e.id_alumno,a.id_evaluacion,c.id_examen,g.seccion,f.id_colegio,a.periodo  FROM evaluaciones a INNER JOIN examen_alumnos c ON c.id_evaluacion=a.id_evaluacion INNER JOIN alumnos e ON e.id_alumno=c.id_alumno INNER JOIN colegios f ON f.id_colegio=e.id_colegio INNER JOIN colegio_seccion g ON g.id_colegio=f.id_colegio  AND e.seccion=g.seccion WHERE a.id_evaluacion IN(".$id_evaluacion.") AND id_nivel=".$id_nivel." ";
		
		$sql.=($id_ugel=='')?"":" AND f.id_ugel=".$id_ugel." ";
		$sql.=($cod_local=='')?"":" AND f.cod_local='".$cod_local."' ";		
		$sql.=($seccion=='')?"":" AND g.seccion='".$seccion."'";
       // return $sql;
		
		$html_exp="<table id='tbl_notas_examen_export'>";
		$html_exp_cab="<tr>";
		$html_exp_cab.="<th>Ugel<th>";
		$html_exp_cab.="<th>Colegio<th>";
		$html_exp_cab.="<th>Alumno<th>";
		$html_exp_cab.="<th>Nivel<th>";
		$html_exp_cab.="<th>Grado<th>";
		$html_exp_cab.="<th>Seccion<th>";
		$html_exp_cab.="<th>Escala<th>";
		$html_exp_cab.="</tr>";
		
		$query=$db->query($sql);
		if (!$query)
			{
					$error=$db->error(); // Has keys 'code' and 'message'
					
					print_r($error);
			}
			else
			{
                $result_data = $query->getResult();
				$data_notas=array();
				$procesos=['Inicio','Proceso','Satisfactorio'];
				$html="<table border=1 id='tbl_notas_examen1' class='table table-bordered table-dark2 text-center'>";
				$html2="<table border=1 id='tbl_notas_examen2' class='table table-bordered table-dark2 text-center'>";
				$html.="<thead>";
				$html2.="<thead>";
				$html.="<tr>";
                $html2.="<tr>";
				$html.="<th rowspan='2'>Seccion</th>";
                $html2.="<th rowspan='2'>Seccion</th>";
				$html.="<th rowspan='2'>Total Alumnos</th>";
                $html2.="<th rowspan='2'>Total Alumnos</th>";
				foreach($procesos as $proc)
				{
					$html.="<th colspan='2'>".$proc."</th>";
                    $html2.="<th colspan='2'>".$proc."</th>";
				}
				
				$html.="</tr>";
                $html2.="</tr>";
				$html.="<tr>";
                $html2.="<tr>";
				foreach($procesos as $proc)
				{
					$html.="<th>Cant</th>";
                    $html2.="<th>Cant</th>";
					$html.="<th>Porc</th>";
                    $html2.="<th>Porc</th>";
				}
				$html.="</tr>";
                $html2.="</tr>";
				$html.="</thead>";
                $html2.="</thead>";
				$html.="<tbody>";
                $html2.="<tbody>";

				 $escalas=[];
				 $escalas2=[];
				 $total_secc=[];
				 $total_secc2=[];

				if(count($result_data)>0)
				{
					
					foreach ($result_data as $rows)
					{
                        if($rows->periodo=='2022-1')
                        {
                            @$total_secc[$rows->seccion]+=+1;
                            $nota_sec=$rows->nota;
                            if($rows->nota=='' || is_null($rows->nota))
                            {
                                $nota_sec=0;
                            }
                            if(intval($nota_sec)<(intval($rows->escala1)+1))
                            {
                                @$escalas[$rows->seccion][$procesos[0]]+=+1;
                            }
                            else if(intval($nota_sec)<(intval($rows->escala2)+1)&& intval($rows->nota)>intval($rows->escala1))
                            {
                                @$escalas[$rows->seccion][$procesos[1]]+=+1;
                            }
                            else if(intval($rows->nota)>intval($rows->escala2))
                            {
                                @$escalas[$rows->seccion][$procesos[2]]+=+1;
                            }
                        }
                        else{
                            @$total_secc2[$rows->seccion]+=+1;
                            $nota_sec2=$rows->nota;
                            if($rows->nota=='' || is_null($rows->nota))
                            {
                                $nota_sec2=0;
                            }
                            if(intval($nota_sec)<(intval($rows->escala1)+1))
                            {
                                @$escalas2[$rows->seccion][$procesos[0]]+=+1;
                            }
                            else if(intval($nota_sec)<(intval($rows->escala2)+1)&& intval($rows->nota)>intval($rows->escala1))
                            {
                                @$escalas2[$rows->seccion][$procesos[1]]+=+1;
                            }
                            else if(intval($rows->nota)>intval($rows->escala2))
                            {
                                @$escalas2[$rows->seccion][$procesos[2]]+=+1;
                            }
                        }
						
					}
                    if(count($escalas)>0){
                        foreach($escalas as $secc=>$arr_escala)
                        {
                            $html.="<tr>";
                            $html.="<td>".$secc."</td>";
                            $html.="<td>".@$total_secc[$secc]."</td>";
                            foreach($procesos as $proc)
                            {
                                if(isset($arr_escala[$proc]))
                                {
                                    $cantidad=$arr_escala[$proc];

                                    $html.="<td>".$cantidad."</td>";
                                    $cont_por=($cantidad>0?round($cantidad/@$total_secc[$secc]*100,2):0);
                                    if($cont_por>0)$cont_por=$cont_por."%";
                                    $html.="<td>".$cont_por."</td>";


                                }
                                else
                                {
                                    $html.="<td>0</td>";
                                    $html.="<td>0%</td>";

                                }

                            }
                            $html.="</tr>";
                        }
                        $html.="</tbody><table>";
                    }
                    else{
                        $html="0";
                    }

                    if(count($escalas2)>0){
                        foreach($escalas2 as $secc=>$arr_escala2)
                        {
                            $html2.="<tr>";
                            $html2.="<td>".$secc."</td>";
                            $html2.="<td>".@$total_secc2[$secc]."</td>";
                            foreach($procesos as $proc)
                            {
                                if(isset($arr_escala2[$proc]))
                                {
                                    $cantidad=$arr_escala2[$proc];

                                    $html2.="<td>".$cantidad."</td>";
                                    $cont_por=($cantidad>0?round($cantidad/@$total_secc2[$secc]*100,2):0);
                                    if($cont_por>0)$cont_por=$cont_por."%";
                                    $html2.="<td>".$cont_por."</td>";


                                }
                                else
                                {
                                    $html2.="<td>0</td>";
                                    $html2.="<td>0%</td>";

                                }

                            }
                            $html2.="</tr>";
                        }
                        $html2.="</tbody><table><br>";
                    }
                    else{
                        $html2="0";
                    }


			     }
				else
				{
					$html="0";
                    $html2="0";
				}
				 
				echo $html."|".$html2;
				 
			}		
   
		
	}

	 public function get_omitidas($id_eval,$id_ugel)
	 {
		 $db = \Config\Database::connect();	
		 
		$sql_1="SELECT b.* FROM evaluaciones a INNER JOIN evaluacion_preguntas b ON a.id_evaluacion=b.id_evaluacion WHERE a.id_evaluacion=".$id_eval."	";	
		$query=$db->query($sql_1);
		$result_data = $query->getResult();
			 
		$sql_2="SELECT c.`id_alumno`,c.nota,d.* FROM colegios a INNER JOIN alumnos b 
ON a.`id_colegio`=b.`id_colegio`INNER JOIN examen_alumnos c ON c.`id_alumno`=b.`id_alumno` INNER JOIN examen_alumnos_det d ON c.`id_examen`=d.`id_examen` WHERE a.`id_ugel`=".$id_ugel." 
AND c.`id_evaluacion`=".$id_eval." ORDER BY c.id_alumno,d.id_examen,d.`id_pregunta` ";
			
		$query2=$db->query($sql_2);
		$result_data2 = $query2->getResult();
		
		$data_result=array('data1'=>$result_data,'data2'=>$result_data2);
		
		return $data_result;		 
		 
	 }
	 
    public function get_notas_update($id_eval)
    {
      
	  $db = \Config\Database::connect();	 

      if($id_eval==2 || $id_eval==8)
      {
          $sql_1="		  
		SELECT * FROM
		(
		SELECT 		
		    SUM(IF(EXISTS(SELECT pt.valor FROM pregunta_tipos pt WHERE pt.`idpreguntatipo`=e.`pregunta_tipo` AND d.respuesta=pt.opcion  AND e.pregunta_tipo<>1),
			 (SELECT SUM(pt.valor) FROM pregunta_tipos pt WHERE pt.`idpreguntatipo`=e.`pregunta_tipo` AND d.respuesta=pt.opcion AND e.pregunta_tipo<>1 ),IF(d.respuesta=e.correcta,e.puntaje,0))) AS cal_nota,
		d.nota,id_alumno,id_examen,d.id_evaluacion AS evaluacion,d.fech_up FROM 
		(
		SELECT a.`id_examen`,a.`id_alumno`,a.`id_evaluacion`,a.`nota`,b.`id_pregunta`,b.`opcion_alias` AS respuesta,a.`updated_date` AS fech_up
		 FROM  examen_alumnos a INNER JOIN `examen_alumnos_det` b ON a.id_examen=b.`id_examen`
		WHERE a.id_evaluacion=".$id_eval."  ORDER BY b.id_examen,b.id_pregunta  
		 ) AS d
		INNER JOIN `evaluacion_preguntas` e ON 
		e.id_eval_pregunta=d.id_pregunta AND e.`id_evaluacion`=d.id_evaluacion
		GROUP BY id_alumno,id_examen) AS f
		WHERE f.cal_nota<>f.nota";

      }
	  else{

          $sql_1="SELECT * FROM
		(SELECT SUM( IF(e.correcta<>'PA',IF(d.respuesta=e.correcta,e.`puntaje`,0),
		IF(d.respuesta='Correc',2,IF(d.respuesta='Parc',1,0)))) AS cal_nota,
		d.nota,id_alumno,id_examen,d.id_evaluacion as evaluacion,d.fech_up FROM 
		(
		SELECT a.`id_examen`,a.`id_alumno`,a.`id_evaluacion`,a.`nota`,b.`id_pregunta`,b.`opcion_alias` AS respuesta,a.`updated_date` AS fech_up
		 FROM  examen_alumnos a INNER JOIN `examen_alumnos_det` b ON a.id_examen=b.`id_examen`
		WHERE a.id_evaluacion=".$id_eval."  ORDER BY b.id_examen,b.id_pregunta  
		 ) AS d  INNER JOIN `evaluacion_preguntas` e ON 
		e.id_eval_pregunta=d.id_pregunta AND e.`id_evaluacion`=d.id_evaluacion
		GROUP BY id_alumno,id_examen) AS f
		WHERE f.cal_nota<>f.nota";

      }

		$query=$db->query($sql_1);
		if (!$query)
			{
					$error=$db->error(); // Has keys 'code' and 'message'
					
					return $error;
			}
			else
			{
				
				 $result_data = $query->getResult();
				 return $result_data;
				 
			}		
       
		

    }

}
    