<?php namespace App\Models;
namespace App\Models;

use CodeIgniter\Model;

class AreaModel extends Model
{
    protected $table      = 'areas';
    protected $primaryKey = 'id_area';

    protected $useAutoIncrement = true;
    protected $returnType = 'array';
	protected $useSoftDeletes = false;

    protected $allowedFields = ['area','active'];

   
   
    public function get_datos_grado($id_colegio,$periodo)
    {
      

        $db = \Config\Database::connect();
       
       $sql="SELECT a.id_colegio,a.idcolegio_det,a.id_area,a.grado,a.id_evaluacion ,b.seccion,b.idcolegio_sec 
        FROM colegio_detalle a INNER JOIN `colegio_seccion` b ON a.id_colegio=b.id_colegio
        where a.active=1  AND b.active=1 AND a.id_colegio={$id_colegio} and a.periodo='{$periodo}' ORDER BY b.seccion";
       
        $query= $db->query($sql);
        $result_data = $query->getResult();
            
        if(count($result_data)>0){
            return $result_data;
        }
        else { return '0';
        }
         

    }

  public function get_datos($colegio,$niveles,$area,$grado,$seccion){
        $db = \Config\Database::connect();
        $sql='SELECT ed.opcion_alias as respuesta,ep.pregunta,ep.correcta,ec.competencias';
        $sql.=' FROM examen_alumnos_det ed';
        $sql.=' INNER JOIN examen_alumnos ea on ed.id_examen=ea.id_examen';
        $sql.=' INNER JOIN alumnos a ON a.id_alumno=ea.id_alumno';
        $sql.=' INNER JOIN colegios col ON col.id_colegio=a.id_colegio';
        $sql.=' INNER JOIN evaluacion_preguntas ep on ed.id_pregunta=ep.id_eval_pregunta';
        $sql.=' INNER JOIN eval_competencias ec ON ec.id_competencia=ep.id_competencia ';
        $sql.=' WHERE 1=1 ';
        $sql.= (isset($colegio) && $colegio!="")?" AND col.cod_local=".$colegio." ":"";
        $sql.= (isset($niveles) && $niveles!="")?" AND col.id_nivel=".$niveles." ":"";
        $sql.= (isset($area) && $area!="")?"  AND ep.id_evaluacion=".$area." ":"";
        $sql.= (isset($grado) && $grado!="")?" AND a.grado=".$grado." ":"";
        $sql.= (isset($seccion) && $seccion!="")?" AND a.seccion='".$seccion."' ":"";
        $query   = $db->query($sql);        
        $results = $query->getResult();
        $data_grado=array();
        if(count($results)>0)
             {
                foreach ($results as $rows) 
                {
                    $data_grado[]=$rows;
                 }
             }
             return $data_grado;
    }

    public function get_valor($id_valor,$id_valor_1,$tabla,$columnas,$columna_filter,$columna_filter_1,$inner_join,$colegio_id,$id_nivel,$periodo){
        $db = \Config\Database::connect();
		if($columna_filter=='grado'){
            $sql="SELECT DISTINCT b.`seccion` AS  id,b.`seccion` as descripcion FROM  colegios c 
                INNER JOIN `colegio_detalle` a ON c.`id_colegio`=a.`id_colegio` INNER JOIN `colegio_seccion` b  
                    ON a.`id_colegio`=b.`id_colegio` WHERE a.grado={$id_valor} AND a.`active`=1 
                                                       AND b.`active`=1 AND c.cod_local={$colegio_id} 
                                                       AND c.id_nivel={$id_valor_1}";
        }
        else if($columna_filter=='id_area')		{

            $sql="SELECT DISTINCT b.`grado` AS id,b.`grado` AS descripcion FROM colegios a 
        INNER JOIN `colegio_detalle` b ON a.`id_colegio`=b.`id_colegio` 
                                                WHERE a.`active`=1 AND b.`active`=1 
                                                  AND a.cod_local='{$id_valor_1}' 
                                                  AND a.id_nivel={$id_nivel} 
                                                  AND b.id_evaluacion IN({$id_valor})  ";
        }
        else {
        $sql="SELECT ".$columnas." ";
        $sql.=" FROM ".$tabla." ";
        $sql.=" ".$inner_join." ";
        $sql.=" WHERE 1=1 AND ";
        $sql.=" ".$columna_filter."=".$id_valor." ";
        $sql.=(isset($id_valor_1) && $id_valor_1!="")?" AND ".$columna_filter_1."=".$id_valor_1." ":"";
            if($periodo!=''){
                $dataexp=explode(",",$periodo);
                if(count($dataexp)==0 ||  count($dataexp)==1){
                    $sql.=" AND periodo='".$periodo."' ";
                }
                else{
                    $string_per=str_replace(",","','",$periodo);
                    $sql.=" AND periodo IN ('".$string_per."') ";
                }
            }
		}
        //return $sql;
        $query   = $db->query($sql);
        $results = $query->getResult();
        $data_grado=array();
        if(count($results)>0){
                foreach ($results as $rows){
                    $data_grado[]=$rows;
                 }
             }
             return $data_grado;
    }

    public function get_capacidades($id_ugel,$colegio,$niveles,$area,$grado,$seccion){
        $db = \Config\Database::connect();
        $sql='SELECT ep.id_evaluacion ,ed.opcion_alias as respuesta,ep.pregunta,ep.correcta,ec.competencias,ecp.alias as capacidades,ecp.id_capacidad';
        $sql.=' FROM examen_alumnos_det ed';
        $sql.=' INNER JOIN examen_alumnos ea on ed.id_examen=ea.id_examen';
        $sql.=' INNER JOIN alumnos a ON a.id_alumno=ea.id_alumno';
        $sql.=' INNER JOIN colegios col ON col.id_colegio=a.id_colegio';
        $sql.=' INNER JOIN evaluacion_preguntas ep on ed.id_pregunta=ep.id_eval_pregunta AND ep.id_evaluacion=ea.id_evaluacion ';
        $sql.=' INNER JOIN eval_competencias ec ON ec.id_competencia=ep.id_competencia';
        $sql.=' INNER JOIN eval_capacidades ecp ON ecp.id_capacidad=ep.id_capacidad';
        $sql.=' WHERE 1=1 ';
        $sql.= (isset($id_ugel) && $id_ugel!="")?" AND col.id_ugel=".$id_ugel." ":"";
        $sql.= (isset($colegio) && $colegio!="")?" AND col.cod_local=".$colegio." ":"";
        // $sql.= (isset($niveles) && $niveles!="")?" AND col.id_nivel=".$niveles." ":"";
        $sql.= (isset($area) && $area!="")?"  AND ep.id_evaluacion IN(".$area.") ":"";
        $sql.= (isset($grado) && $grado!="")?" AND a.grado=".$grado." ":"";
        $sql.= (isset($seccion) && $seccion!="")?" AND a.seccion='".$seccion."' ":"";
        $sql.=" ORDER BY ep.id_eval_pregunta";
       // return $sql; exit();
        //$sql.= (isset($seccion) && $seccion!="")?" AND det.grado=".$area." ":"";
        $query   = $db->query($sql);        
        $results = $query->getResult();
        $data_grado1=array();
        $data_grado2=array();
        if(count($results)>0){
                foreach ($results as $rows){
                    if($rows->id_evaluacion<7)
                    {
                        $data_grado1[]=$rows;

                    }else
                    {
                        $data_grado2[]=$rows;
                    }

                 }
             }
             return array('data_grado1'=>$data_grado1,'data_grado2'=>$data_grado2);
    }
    public function get_detalle($colegio,$niveles,$area,$grado,$seccion,$valor1,$valor2,$valor3,$valor4,$valor5){
        $db = \Config\Database::connect();
    $sql='SELECT ed.opcion_alias as respuesta,ep.pregunta,ep.correcta,ec.competencias,ecp.alias as capacidades,a.apellidos,a.nombres,col.nom_colegio,ea.nota,a.seccion';
        $sql.=' FROM examen_alumnos_det ed';
        $sql.=' INNER JOIN examen_alumnos ea on ed.id_examen=ea.id_examen';
        $sql.=' INNER JOIN alumnos a ON a.id_alumno=ea.id_alumno';
        $sql.=' INNER JOIN colegios col ON col.id_colegio=a.id_colegio';
        $sql.=' INNER JOIN evaluacion_preguntas ep on ed.id_pregunta=ep.id_eval_pregunta';
        $sql.=' INNER JOIN eval_competencias ec ON ec.id_competencia=ep.id_competencia';
        $sql.=' INNER JOIN eval_capacidades ecp ON ecp.id_capacidad=ep.id_capacidad';
        $sql.=' WHERE 1=1 ';
        $sql.= (isset($colegio) && $colegio!="")?" AND col.cod_local=".$colegio." ":"";
        $sql.= (isset($niveles) && $niveles!="")?" AND col.id_nivel=".$niveles." ":"";
        $sql.= (isset($area) && $area!="")?"  AND ep.id_evaluacion=".$area." ":"";
        $sql.= (isset($grado) && $grado!="")?" AND a.grado=".$grado." ":"";
        $sql.= (isset($seccion) && $seccion!="")?" AND a.seccion='".$seccion."' ":"";

        $sql.= (isset($valor1) && $valor1!="")?" AND ec.competencias='".$valor1."' ":"";
        $sql.= (isset($valor2) && $valor2!="")?" AND ep.pregunta='".$valor2."' ":"";
        $sql.= (isset($valor3) && $valor3!="")?" AND ecp.alias='".$valor3."' ":"";
        if(isset($valor5)){
            if($valor5=='O'){
                $sql.= (isset($valor5) && $valor5!="")?" AND (ed.opcion_alias is NULL OR ed.opcion_alias='') ":"";
            }else{
                $sql.= (isset($valor5) && $valor5!="")?" AND ed.opcion_alias='".$valor5."' ":"";
            }
        }
       //return $sql; exit();
        //$sql.= (isset($seccion) && $seccion!="")?" AND det.grado=".$area." ":"";
        $query   = $db->query($sql);        
        $results = $query->getResult();
        $data_grado=array();
        if(count($results)>0){
                foreach ($results as $rows){
                    $data_grado[]=$rows;
                 }
             }
             return $data_grado;
    }
	public function get_notas($ugel,$colegio,$niveles,$area,$grado,$seccion){
    $db = \Config\Database::connect();
   $sql=' SELECT a.id_alumno,ed.opcion_alias as respuesta,ep.pregunta,ep.correcta, CONCAT(a.apellidos," ",a.nombres) as nombre';
    $sql.=' ,col.nom_colegio,a.seccion,a.grado,ea.nota';
    $sql.=' FROM examen_alumnos_det ed';
    $sql.=' INNER JOIN examen_alumnos ea on ed.id_examen=ea.id_examen';
    $sql.=' INNER JOIN alumnos a ON a.id_alumno=ea.id_alumno';
    $sql.=' INNER JOIN colegios col ON col.id_colegio=a.id_colegio';
    $sql.=' INNER JOIN evaluacion_preguntas ep on ed.id_pregunta=ep.id_eval_pregunta';
    $sql.=' WHERE 1=1 ';
    $sql.= (isset($ugel) && $ugel!="")?" AND col.id_ugel=".$ugel." ":"";
    $sql.= (isset($colegio) && $colegio!="")?" AND col.cod_local=".$colegio." ":"";
    $sql.= (isset($niveles) && $niveles!="")?" AND col.id_nivel=".$niveles." ":"";
    $sql.= (isset($area) && $area!="")?"  AND ep.id_evaluacion=".$area." ":"";
    $sql.= (isset($grado) && $grado!="")?" AND a.grado=".$grado." ":"";
    $sql.= (isset($seccion) && $seccion!="")?" AND a.seccion='".$seccion."' ":"";

   //return $sql; exit();
    //$sql.= (isset($seccion) && $seccion!="")?" AND det.grado=".$area." ":"";
    $query   = $db->query($sql);        
    $results = $query->getResult();
    $data_grado=array();
    if(count($results)>0){
            foreach ($results as $rows){
                $data_grado[]=$rows;
             }
         }
         return $data_grado;
	}
public function get_avance($ugel,$colegio){
    $db = \Config\Database::connect();

    $sql=' SELECT ug.nom_ugel,col.nom_colegio,a.id_alumno,ex_a.id_evaluacion,col.id_nivel ';
    $sql.=' FROM examen_alumnos ex_a ';
    $sql.=' INNER JOIN alumnos a ON a.id_alumno=ex_a.id_alumno';
    $sql.=' INNER JOIN colegios col ON col.id_colegio=a.id_colegio';
    $sql.=' INNER JOIN ugel ug ON ug.id_ugel=col.id_ugel';
    $sql.=' WHERE 1=1 and col.active=1 ';
    $sql.= (isset($ugel) && $ugel!="")?" AND col.id_ugel=".$ugel." ":"";
    $sql.= (isset($colegio) && $colegio!="")?" AND col.cod_local=".$colegio." ":"";

    $query   = $db->query($sql);        
    $results = $query->getResult();
    $data_grado1=array();
    $data_grado2=array();
    if(count($results)>0){
            foreach ($results as $rows){
                if($rows->id_evaluacion<7)
                {
                    $data_grado1[]=$rows;
                }
                else{
                    $data_grado2[]=$rows;
                }

             }
         }

    $sql_T=" SELECT ug.nom_ugel,col.nom_colegio,a.active as total,a.grado,col.id_nivel ";
    $sql_T.=" FROM alumnos a";
    $sql_T.=" INNER JOIN colegios col ON a.id_colegio=col.id_colegio";
    $sql_T.=" INNER JOIN ugel ug ON col.id_ugel=ug.id_ugel";
    $sql_T.=" WHERE a.active=1 ";
    $sql_T.=(isset($ugel) && $ugel!="")?" AND col.id_ugel=".$ugel." ":"";
    $sql_T.=(isset($colegio) && $colegio!="")?" AND col.cod_local=".$colegio." ":"";
    
    $query_T= $db->query($sql_T);        
    $results_T= $query_T->getResult();
    $data_T1=array();
    if(count($results_T)>0){
            foreach ($results_T as $rows){
                $data_T1[]=$rows;
             }
         }

    return array('data_grado1'=>$data_grado1,'data_T1'=>$data_T1,'data_grado2'=>$data_grado2,'data_T2'=>$data_T1);

    
}

public function get_avance_areas($ugel,$colegio){
    $db = \Config\Database::connect();
    $sql=' SELECT ug.nom_ugel,col.nom_colegio,a.id_alumno,ex_a.id_evaluacion,col.id_nivel,ar.area ';
    $sql.=' FROM examen_alumnos ex_a ';
    $sql.=' INNER JOIN alumnos a ON a.id_alumno=ex_a.id_alumno';
    $sql.=' INNER JOIN colegios col ON col.id_colegio=a.id_colegio';
    $sql.=' INNER JOIN ugel ug ON ug.id_ugel=col.id_ugel';
    $sql.=' INNER JOIN evaluaciones ev ON ev.id_evaluacion=ex_a.id_evaluacion';
    $sql.=' INNER JOIN areas ar ON ar.id_area=ev.id_area';
    $sql.=' WHERE 1=1 and col.active=1 ';
    $sql.= (isset($ugel) && $ugel!="")?" AND col.id_ugel=".$ugel." ":"";
    $sql.= (isset($colegio) && $colegio!="")?" AND col.cod_local=".$colegio." ":"";

    $query   = $db->query($sql);        
    $results = $query->getResult();
    $data_grado1=array();
    $data_grado2=array();
    if(count($results)>0){
            foreach ($results as $rows){
                if($rows->id_evaluacion<7)
                {    $data_grado1[]=$rows;
                }else{
                    $data_grado2[]=$rows;
                }
             }
         }

    $sql_T=" SELECT ug.nom_ugel,col.nom_colegio,a.active as total,a.grado,col.id_nivel,ar.area ";
    $sql_T.=" FROM alumnos a";
    $sql_T.=" INNER JOIN colegios col ON a.id_colegio=col.id_colegio";
    $sql_T.=" INNER JOIN ugel ug ON col.id_ugel=ug.id_ugel";
    $sql_T.=" INNER JOIN areas ar ON ar.id_nivel=col.id_nivel";
    $sql_T.=" WHERE a.active=1 ";
    $sql_T.=(isset($ugel) && $ugel!="")?" AND col.id_ugel=".$ugel." ":"";
    $sql_T.=(isset($colegio) && $colegio!="")?" AND col.cod_local=".$colegio." ":"";
    
    $query_T= $db->query($sql_T);        
    $results_T= $query_T->getResult();
    $data_T1=array();
    if(count($results_T)>0){
            foreach ($results_T as $rows){
                $data_T1[]=$rows;
             }
         }

    return array('data_grado1'=>$data_grado1,'data_T1'=>$data_T1,'data_grado2'=>$data_grado2,'data_T2'=>$data_T1);
}
public function get_escala($ugel,$cod_local,$id_evaluacion,$id_nivel)
{
    $db = \Config\Database::connect();
    $sql=' SELECT ev.periodo,a.id_alumno,col.nom_colegio,a.seccion,a.grado,ea.nota,ug.nom_ugel,ev.nombre_evaluacion,ea.id_evaluacion,col.area,col.id_gestion ';
    $sql.=' ,a.sexo,ev.escala1,ev.escala2,ev.escala3 ';
    $sql.=' FROM examen_alumnos ea ';
    $sql.=' INNER JOIN alumnos a ON a.id_alumno=ea.id_alumno';
    $sql.=' INNER JOIN colegios col ON col.id_colegio=a.id_colegio';
    $sql.=' INNER JOIN ugel ug on col.id_ugel=ug.id_ugel';
    $sql.=' INNER JOIN evaluaciones ev ON ev.id_evaluacion=ea.id_evaluacion';
    $sql.=' WHERE col.active=1 ';
	$sql.= (isset($id_nivel) && $id_nivel!="")?" AND col.id_nivel=".$id_nivel." ":"";
    $sql.= (isset($ugel) && $ugel!="")?" AND col.id_ugel=".$ugel." ":"";
    $sql.= (isset($cod_local) && $cod_local!="")?" AND col.cod_local='".$cod_local."' ":"";
    $sql.= (isset($id_evaluacion) && $id_evaluacion!="")?" AND ev.id_evaluacion IN(".$id_evaluacion.") ":"";
    
    $sql.=' ORDER BY col.id_ugel';

    $query   = $db->query($sql);        
    $results = $query->getResult();
    $data_grado1=array();
    $data_grado2=array();
    if(count($results)>0){
            foreach ($results as $rows){
                if($rows->periodo=='2022-1'){
                    $data_grado1[]=$rows;
                }else{
                    $data_grado2[]=$rows;
                }

             }
         }
    return array('data_grado1'=>$data_grado1,'data_grado2'=>$data_grado2,'total1'=>count($data_grado1),'total2'=>count($data_grado2),'sql'=>$sql);
	
   }
   
   public function get_microregion($ugel,$id_evaluacion,$id_nivel,$id_micro,$periodo)
	{
    $db = \Config\Database::connect();
    $sql=' SELECT ev.periodo,a.id_alumno,CONCAT(a.apellidos," ",a.nombres) as nombre,col.nom_colegio,a.seccion,a.grado,ea.nota,ug.nom_ugel,ev.nombre_evaluacion,ea.id_evaluacion,col.area,col.id_gestion ';
    $sql.=' ,a.sexo,ev.escala1,ev.escala2,ev.escala3 ';
    $sql.=' FROM examen_alumnos ea ';
    $sql.=' INNER JOIN alumnos a ON a.id_alumno=ea.id_alumno';
    $sql.=' INNER JOIN colegios col ON col.id_colegio=a.id_colegio';
    $sql.=' INNER JOIN ugel ug on col.id_ugel=ug.id_ugel';
    $sql.=' INNER JOIN evaluaciones ev ON ev.id_evaluacion=ea.id_evaluacion';
    $sql.=' WHERE col.active=1 ';
	$sql.= (isset($id_nivel) && $id_nivel!="")?" AND col.id_nivel=".$id_nivel." ":"";
    $sql.= (isset($ugel) && $ugel!="")?" AND col.id_ugel=".$ugel." ":"";
    $sql.= (isset($id_micro) && $id_micro!="")?" AND ug.id_microregion=".$id_micro." ":"";
    $sql.= (isset($id_evaluacion) && $id_evaluacion!="")?" AND ev.id_evaluacion IN(".$id_evaluacion.") ":"";
    $sql.=' ORDER BY col.id_ugel';

    $query   = $db->query($sql);        
    $results = $query->getResult();
    $data_grado1=array();
    $data_grado2=array();
    if(count($results)>0){
            foreach ($results as $rows){
                if($rows->periodo=='2022-1')
                {
                    $data_grado1[]=$rows;
                }else{
                    $data_grado2[]=$rows;
                }

             }
         }
    return array('data_grado1'=>$data_grado1,'data_grado2'=>$data_grado2,'sql'=>$sql);
	
   }
   
     public function get_regional($id_evaluacion,$id_nivel)
	{
    $db = \Config\Database::connect();
    $sql=' SELECT  1 as region,ev.periodo,a.id_alumno,CONCAT(a.apellidos," ",a.nombres) as nombre,col.nom_colegio,a.seccion,a.grado,ea.nota,ug.nom_ugel,ev.nombre_evaluacion,ea.id_evaluacion,col.area,col.id_gestion ';
    $sql.=' ,a.sexo,ev.escala1,ev.escala2,ev.escala3 ';
    $sql.=' FROM examen_alumnos ea ';
    $sql.=' INNER JOIN alumnos a ON a.id_alumno=ea.id_alumno';
    $sql.=' INNER JOIN colegios col ON col.id_colegio=a.id_colegio';
    $sql.=' INNER JOIN ugel ug on col.id_ugel=ug.id_ugel';
    $sql.=' INNER JOIN evaluaciones ev ON ev.id_evaluacion=ea.id_evaluacion';
    $sql.=' WHERE col.active=1 ';
	$sql.= (isset($id_nivel) && $id_nivel!="")?" AND col.id_nivel=".$id_nivel." ":""; 
    $sql.= (isset($id_evaluacion) && $id_evaluacion!="")?" AND ev.id_evaluacion IN(".$id_evaluacion.") ":"";
    $query   = $db->query($sql);        
    $results = $query->getResult();
    $data_grado1=array();
    if(count($results)>0){
            foreach ($results as $rows){
                if($rows->periodo=='2022-1')
                {
                    $data_grado1[]=$rows;
                }else{
                    $data_grado2[]=$rows;
                }

             }
         }
    return array('data_grado1'=>$data_grado1,'data_grado2'=>$data_grado2,'query'=>$sql);
	
   }
	
	
	
}