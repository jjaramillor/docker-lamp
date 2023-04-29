<?php namespace App\Models;
namespace App\Models;

use CodeIgniter\Model;
use function PHPUnit\Framework\returnArgument;

class Examen_alumnoModel extends Model
{
    protected $table      = 'examen_alumnos';
    protected $primaryKey = 'id_examen';

    protected $useAutoIncrement = true;
    protected $returnType = 'array';
	protected $useSoftDeletes = false;

   	// this happens first, model removes all other fields from input data
	protected $allowedFields = [
		'nom_examen','id_alumno', 'id_evaluacion', 'nota', 'user_created', 
		'user_updated'
	];


	protected $useTimestamps = true;
	protected $createdField  = 'created_date';
	protected $updatedField  = 'updated_date';
	protected $dateFormat  	 = 'datetime';

	protected $validationRules = [];

	// we need different rules for registration, account update, etc
	protected $dynamicRules = [
	   'insertExamenDetalle' => [
			'id_alumno' 		=> 'required|min_length[1]',
			'id_evaluacion' 		=> 'required|min_length[1]',
			'nota' 				=> 'required|min_length[1]'
		],
		'updateExamenDetalle' => [
			'id_examen'	=> 'required',
			'nota'	=> 'required|min_length[1]'
		]	
		
	];

	protected $validationMessages = [];
	protected $skipValidation = false;
    //--------------------------------------------------------------------
    /**
     * Retrieves validation rule
     */

	public function getRule(string $rule)
	{
		return $this->dynamicRules[$rule];
	}
    public  function insertDetalleExamen($datos_ins,$id_examen,$nota,$id_user,$valorsel){
        $datos_up=explode('_',$datos_ins);
        $id_alumno=$datos_up[0];
        $id_evaluacion=$datos_up[1];
        $id_pregunta=$datos_up[2];

        $examenModel=new Examen_alumnoModel();
        $getRule = $examenModel->getRule('updateExamenDetalle');
        $examenModel->setValidationRules($getRule);
        $res_transaccion="";
        try{
            if($id_examen!='0')
            {
                $datos_upd = [
                    'nota'  	=> $nota,
                    'updated_date'  	=>date('Y-m-d H:i:s'),
                    'user_updated' 	=> $id_user
                ];
                $this->db->transStart();
                $this->db->transStrict(false);
                $examenModel->update($id_examen,$datos_upd);

                $where_query=['id_examen'=>$id_examen,'id_pregunta'=>$id_pregunta];
                $total_array =  $this->db->table('examen_alumnos_det')->select('id_detalle')->where($where_query)->get()->getResult();
                $id_detalle=0;
                $total=count($total_array);
                $res_transaccion="";
                if($total==0)
                {
                    try{

                        $data = [
                            'id_examen' => $id_examen,
                            'id_pregunta'  => $id_pregunta,
                            'opcion_alias'  => $valorsel,
                            'created_date' =>date('Y-m-d H:i:s'),
                            'user_created' =>$id_user
                        ];
                        $this->db->table('examen_alumnos_det')->insert($data);
                        $id_detalle =$this->db->insertID();
                        if($id_detalle>0)
                        {
                            $res_transaccion= $id_alumno."_".$id_examen."_".$id_detalle;
                            $where_det=['id_detalle'=>$id_detalle];
                            $this->insertHisto($id_examen,$id_detalle);

                        }
                        else
                        {
                            $res_transaccion= "0";
                        }
                        //$tot_affect=$db->affectedRows();
                        if ($this->db->transStatus() === false) {
                            $this->db->transRollback();
                            return "0";
                            return false;
                        } else {
                            //Todas las consultas se hicieron correctamente.
                            $this->db->transCommit();
                            return $res_transaccion ;
                            return false;
                        }

                    }catch (Exception $e) {
                        return $e->getMessage();
                        return false;
                    }


                }
                else if($total>0)
                {

                    try{
                        $data = [
                            'opcion_alias' => $valorsel,
                            'updated_date'  => date('Y-m-d H:i:s'),
                            'user_updated'  => $id_user
                        ];
                         $this->db->table('examen_alumnos_det')->where($where_query)->update($data);
                        $id_detalle =$this->db->insertID();

                        if($id_detalle>0)
                        {
                            $this->insertHisto($id_examen,$id_detalle);
                            $res_transaccion= $id_alumno."_".$id_examen."_".$id_detalle;
                        }
                        else
                        {   $res_transaccion= "0";  }

                        if ($this->db->transStatus() === false) {
                            $this->db->transRollback();
                            return "0";
                            return false;
                        } else {
                            //Todas las consultas se hicieron correctamente.
                            $this->db->transCommit();
                            return $res_transaccion ;
                            return false;
                        }

                    }catch (Exception $e) {
                        return $e->getMessage() ;
                        return false;
                    }


                }
                else
                {  return "0";  return false; }

            }
            else
            { return "0";  return false; }
        }
        catch (Exception $e) {
            return $e->getMessage() ;
            return false;
        }


    }
    public  function upDetalleExamen($datos_ins,$id_examen,$nota,$id_user,$valorsel,$id_pregunta){

        $datos_up=explode('_',$datos_ins);
        $id_alumno=$datos_up[0];
        $id_detalle=$datos_up[2];
        $total_dat=0;
        $tot_affect=0;
        //1 caso id_examen>0 entonces insertar en ambas tablas
        try {
            $res_transaccion="";
            if($id_examen>0)
            {
                $this->db->transStart();
                $this->db->transStrict(false);
                $examenModel           = new \App\Models\Examen_alumnoModel();
                $getRule = $examenModel->getRule('updateExamenDetalle');
                $examenModel->setValidationRules($getRule);

                    $datos_upd = [
                        'nota'  	=> $nota,
                        'updated_date'  	=>date('Y-m-d H:i:s'),
                        'user_updated' 	=> $id_user
                    ];
                    $examenModel->update($id_examen,$datos_upd);

                        $where_det=['id_detalle' => $id_detalle];
                        $total_array =  $this->db->table('examen_alumnos_det')->select('id_detalle')->where($where_det)->get()->getResult();
                        $total=count($total_array);
                        if($total==0 && $id_detalle>0)
                        {
                                $data = [
                                    'id_examen' => $id_examen,
                                    'id_pregunta'  => $id_pregunta,
                                    'opcion_alias'  => $valorsel,
                                    'created_date' =>date('Y-m-d H:i:s'),
                                    'user_created' =>$id_user
                                ];
                              $dataInsert = $this->db->table('examen_alumnos_det')->insert($data);
                                if($dataInsert){
                                    $res_transaccion=1;
                                }
                        }
                        else {

                            $data = [
                                'opcion_alias' => $valorsel,
                                'updated_date'  => date('Y-m-d H:i:s'),
                                'user_updated'  => $id_user
                            ];
                            $where_query=['id_examen'=>$id_examen,'id_pregunta'=>$id_pregunta];
                            $ResExDet =  $this->db->table('examen_alumnos_det')
                                ->select('id_detalle')->where($where_query)
                                ->limit(1)->get()->getResult();
                            if(count($ResExDet)>0)
                            {
                                $id_detalle=0;
                                foreach ($ResExDet as $rows)
                                {  $id_detalle=$rows->id_detalle;

                                }
                                $where_query2=['id_detalle'=>$id_detalle,'id_pregunta'=>$id_pregunta];
                                $updateDet= $this->db->table('examen_alumnos_det')->where($where_query2)->update($data);
                                if($updateDet)
                                {
                                    $res_transaccion=1;
                                }
                            }



                        }
                if($res_transaccion==1)
                {
                    $this->insertHisto($id_examen,$id_detalle);
                 }
                if($this->db->transStatus() === false) {

                    $this->db->transRollback();
                    return "0";
                    return false;
                } else {
                    //Todas las consultas se hicieron correctamente.
                    $this->db->transCommit();
                    return $res_transaccion;
                    return false;

                }
            }
            else
            {
                echo '0';
                return false;
            }
        }
        catch (Exception $e) {
            print_r($e->getMessage()) ;
            return false;
        }

    }

    public function update2ExamenyDetalle($datos_ins,$id_examen,$nota,$id_user,$valorsel)
    {

        $datos_up = explode('_', $datos_ins);
        $id_alumno = $datos_up[0];
        $id_evaluacion = $datos_up[1];
        $id_pregunta = $datos_up[2];

        $total_dat = 0;
        $tot_affect = 0;
        //1 caso id_examen=0 entonces insertar en ambas tablas
        $condiciones = ['id_alumno' => $id_alumno, 'id_evaluacion' => $id_evaluacion];

        $Examen_alumnoModel           = new \App\Models\Examen_alumnoModel();
        $existe = $Examen_alumnoModel->where($condiciones)->first();

        //1 caso id_examen=0 entonces insertar en ambas tablas
        if ($id_examen == 0 && empty($existe)) {

            $data = [
                'nota' => $nota,
                'id_alumno' => $id_alumno,
                'id_evaluacion' => $id_evaluacion,
                'created_date' => date('Y-m-d H:i:s'),
                'user_created' => $id_user
            ];
            try {

                $this->db->transStart();
                $this->db->transStrict(false);
                $this->db->table('examen_alumnos')->insert($data);
                $id_examen = $this->db->insertID();
                $res_transaccion = "";
                    $data_det = [
                        'id_examen' => $id_examen,
                        'id_pregunta' => $id_pregunta,
                        'opcion_alias' => $valorsel,
                        'created_date' => date('Y-m-d H:i:s'),
                        'user_created' => $id_user
                    ];
                    $this->db->table('examen_alumnos_det')->insert($data_det);
                    $id_detalle = $this->db->insertID();
                    if ($id_detalle > 0 && $id_examen>0) {
                        $res_transaccion = $id_alumno . "_" . $id_examen . "_" . $id_detalle;
                        $this->insertHisto($id_examen,$id_detalle);

                    } else {
                        $res_transaccion = "0";

                    }


                if ($this->db->transStatus() === false) {

                    $this->db->transRollback();
                    return "0";
                    return false;
                } else {
                    //Todas las consultas se hicieron correctamente.
                    $this->db->transCommit();
                    return $res_transaccion;
                    return false;

                }

            } catch (Exception $e) {
                return $e->getMessage();
                return false;
            }

        }
        else if($id_examen>0)
        {

            try {

                   $getRule = $Examen_alumnoModel->getRule('updateExamenDetalle');
                    $Examen_alumnoModel->setValidationRules($getRule);
                        $datos_upd = [
                            'nota'  	=> $nota,
                            'updated_date'  	=>date('Y-m-d H:i:s'),
                            'user_updated' 	=> $id_user
                        ];
                        $this->db->transStart();
                        $this->db->transStrict(false);
                        $res_transaccion="";
                            $Examen_alumnoModel->update($id_examen,$datos_upd);
                            $arraydetalle=['id_examen' => $id_examen, 'id_pregunta' => $id_pregunta];
                            $total_array = $this->db->table('examen_alumnos_det')
                            ->select('id_detalle')
                            ->where($arraydetalle)->get()->getResult();
                            $total=count($total_array);
                            if($total==0)
                            {
                                $data = [
                                    'id_examen' => $id_examen,
                                    'id_pregunta'  => $id_pregunta,
                                    'opcion_alias'  => $valorsel,
                                    'created_date' =>date('Y-m-d H:i:s'),
                                    'user_created' =>$id_user
                                ];
                                $this->db->table('examen_alumnos_det')->insert($data);
                                $id_detalle = $this->db->insertID();
                                    if($id_detalle>0)
                                    {
                                       $this->insertHisto($id_examen,$id_detalle);
                                        $res_transaccion=$id_alumno."_".$id_examen."_".$id_detalle;
                                    }
                                    else
                                    {  $res_transaccion="0";
                                    }

                            }
                            else
                            {    $res_transaccion= "0";

                            }
                            if ($this->db->transStatus() === false){
                                $this->db->transRollback();
                                return "0"; return false;
                            }
                            else
                            {
                                $this->db->transCommit();
                                return $res_transaccion; return false;
                            }


                }catch (Exception $e) {
                    return $e->getMessage();
                    return false;
                }
        }

    }

    public function insertHisto($id_examen,$id_detalle){

        if($id_examen>0){
            $where_exa=['id_examen'=>$id_examen];
            $dataExamenAlum=$this->db->table('examen_alumnos')->where($where_exa)->get()->getResult();
            if(count($dataExamenAlum)>0)
            {

                foreach ($dataExamenAlum as $rows)
                {
                    $dataExam=[
                        'id_examen' => $id_examen,
                        'id_alumno'  => $rows->id_alumno,
                        'id_evaluacion'  => $rows->id_evaluacion,
                        'nota' =>$rows->nota,
                        'created_date' =>$rows->created_date,
                        'updated_date' =>$rows->updated_date,
                        'user_created' =>$rows->user_created,
                        'user_updated' =>$rows->user_updated,
                        'active' =>$rows->active
                    ];
                    $this->db->table('hist_examen_alumnos')->insert($dataExam);
                }
            }
        }
        if($id_detalle>0){
            $where_det=['id_detalle'=>$id_detalle];
            $dataDetalle=$this->db->table('examen_alumnos_det')->where($where_det)->get()->getResult();
            if(count($dataDetalle)>0)
            {
                foreach ($dataDetalle as $rows)
                {
                    $dataDet=[
                        'id_detalle'=>$rows->id_detalle,
                        'id_examen' => $rows->id_examen,
                        'id_pregunta'  => $rows->id_pregunta,
                        'opcion_alias'  => $rows->opcion_alias,
                        'created_date' =>$rows->created_date,
                        'updated_date' =>$rows->updated_date,
                        'user_created' =>$rows->user_created,
                        'user_updated' =>$rows->user_updated
                    ];
                    $this->db->table('hist_examen_alumnos_det')->insert($dataDet);
                }
            }
        }

    }


}
    