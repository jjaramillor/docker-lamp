<?php
namespace App\Controllers\Auth;

use CodeIgniter\Controller;
use Config\Email;
use Config\Services;
use App\Models\Examen_alumnoModel;
use function PHPUnit\Framework\returnArgument;


class Examen_alumnoController extends Controller
{

	/**
	 * Access to current session.
	 *
	 * @var \CodeIgniter\Session\Session
	 */
	protected $session;

	/**
	 * Authentication settings.
	 */
	protected $config;
    

	public function __construct()
	{
		// start session
		$this->session = Services::session();
	}


    public function ins_detalle_examen()
	{
        //inserta table detalle examen alumnos
        //actualiza tabla examen alumnos
		if(!$this->request->isAjax() )
		{
			redirect('404');
			exit();
		}	
		//ins_idalumno_idevaluacion_idpregunta		
		$datos_ins = $this->request->getPost('datos_ins');
		$id_examen = $this->request->getPost('idexamen');
		$nota = $this->request->getPost('nota');
		$id_user = $this->request->getPost('ussu');
		$valorsel = $this->request->getPost('val_sel');

        $examenAlumnoModel = new Examen_alumnoModel();
        $datainsertUpadate = $examenAlumnoModel->insertDetalleExamen($datos_ins,$id_examen,$nota,$id_user,$valorsel);



		
		
	}

	public function ins2_examen_detalle()
	{
        //inserta table detalle examen alumnos
        //actualiza tabla examen alumnos
		if(!$this->request->isAjax() )
		{
			redirect('404');
			exit();
		}

		//$db      = \Config\Database::connect();
		$datos_ins = $this->request->getPost('datos_ins');
		$id_examen = $this->request->getPost('idexamen');
		$nota = $this->request->getPost('nota');
		$id_user = $this->request->getPost('ussu');
		$valorsel = $this->request->getPost('val_sel');

        $examenAlumnoModel = new Examen_alumnoModel();
        $datainsert = $examenAlumnoModel->update2ExamenyDetalle($datos_ins,$id_examen,$nota,$id_user,$valorsel);

            print_r($datainsert); return false;

		    /*
		     * $builder = $db->table('examen_alumnos');
	    	$builder->insert($data);
			$tot_affect=$db->affectedRows();
			if($tot_affect>0)
			{
				$id_examen=$db->insertID();
			
				$data_det = [
					'id_examen' => $id_examen,
					'id_pregunta'  => $id_pregunta,
					'opcion_alias'  => $valorsel,
					'created_date' =>date('Y-m-d H:i:s'),
					'user_created' =>$id_user
				];

				$builder2 = $db->table('examen_alumnos_det');			
				$builder2->insert($data_det);
				$id_detalle = $db->insertID();
				$tot_affect=$db->affectedRows();
				if($tot_affect>0 && $id_examen>0)
				{
					echo $id_alumno."_".$id_examen."_".$id_detalle;
					return false;
				}
				else
				{
					echo "0"; return false;
				}
			}
			else
			{
					echo "0"; return false;
			}
			

		 if($id_examen>0)// id_examen >0
		{
            try {

                $examenModel=new Examen_alumnoModel();
                $getRule = $examenModel->getRule('updateExamenDetalle');
                $examenModel->setValidationRules($getRule);
                $datos_upd = [
                    'nota'  	=> $nota,
                    'updated_date'  	=>date('Y-m-d H:i:s'),
                    'user_updated' 	=> $id_user
                ];
                $this->db->trans_begin();
                $res_transaccion="";
                $examenModel->update($id_examen,$datos_upd);
                $tot_affectExamen=$db->affectedRows();
                $arraydetalle=['id_examen' => $id_examen, 'id_pregunta' => $id_pregunta];
                $builder1 = $db->table('examen_alumnos_det');
                $builder1->select('id_detalle');
                $builder1->where($arraydetalle);
                $total_array = $builder1->get()->getResult();
                $total=count($total_array);
                if($total==0) {
                    $data = [
                        'id_examen' => $id_examen,
                        'id_pregunta'  => $id_pregunta,
                        'opcion_alias'  => $valorsel,
                        'created_date' =>date('Y-m-d H:i:s'),
                        'user_created' =>$id_user
                    ];
                    $builder = $db->table('examen_alumnos_det');
                    $builder->insert($data);
                    $tot_affect=$db->affectedRows();
                    $id_detalle = $db->insertID();
                    if($tot_affect>0 && $id_detalle>0 && $tot_affectExamen>0)
                    {   $res_transaccion=$id_alumno."_".$id_examen."_".$id_detalle;
                    }
                    else
                    {  $res_transaccion="0";
                    }
                }
                else
                {    $res_transaccion= "0";
                }
                if ($this->db->trans_status() === FALSE){
                    $this->db->trans_rollback();
                    echo "0"; return false;
                }
                else
                {
                    $this->db->trans_commit();
                    echo $res_transaccion; return false;
                }
               /if($examenModel->update($id_examen,$datos_upd))
                {
                    $array=['id_examen' => $id_examen, 'id_pregunta' => $id_pregunta];
                    $db      = \Config\Database::connect();
                    $builder1 = $db->table('examen_alumnos_det');
                    $builder1->select('id_detalle');
                    $builder1->where($array);
                    $total_array = $builder1->get()->getResult();
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
                        $builder = $db->table('examen_alumnos_det');
                        $builder->insert($data);
                        $id_detalle = $db->insertID();
                        $tot_affect=$db->affectedRows();
                        if($tot_affect>0 && $id_detalle>0)
                        {
                            echo $id_alumno."_".$id_examen."_".$id_detalle;
                            return false;
                        }
                        else
                        { echo "0"; return false; }
                    }
                    else
                    {  echo "0";
                        return false;
                    }
                }
                echo '0';
                return false;
            }catch (Exception $e) {
                print_r($e->getMessage());
                return false;
            }
		}*/
		
	
	}

	public function up_detalle_examen()
	{

		if(!$this->request->isAjax() )
		{
			redirect('404');
			exit();
		}
		$db      = \Config\Database::connect();
		$datos_ins = $this->request->getPost('datos_ins');
		$id_examen = $this->request->getPost('idexamen');
		$nota = $this->request->getPost('nota');
		$id_user = $this->request->getPost('ussu');
		$valorsel = $this->request->getPost('val_sel');
		$id_pregunta = $this->request->getPost('id_pregunta');
        $examenAlumnoModel = new Examen_alumnoModel();
        $dataupdate = $examenAlumnoModel->upDetalleExamen($datos_ins,$id_examen,$nota,$id_user,$valorsel,$id_pregunta);

        print_r($dataupdate); return false;


		/*if($id_examen>0)
		{
			$examenModel=new Examen_alumnoModel();
			$getRule = $examenModel->getRule('updateExamenDetalle');
			$examenModel->setValidationRules($getRule);
			
			$datos_upd = [
				'nota'  	=> $nota,
				'updated_date'  	=>date('Y-m-d H:i:s'),
				'user_updated' 	=> $id_user			
			];		
			$examenModel->update($id_examen,$datos_upd);
			$array=['id_detalle' => $id_detalle];
			$db      = \Config\Database::connect();
			$builder1 = $db->table('examen_alumnos_det');
			$builder1->selectCount('id_detalle');
			$builder1->where($array);
			$total_array = $builder1->get()->getResultArray();
			$total_dat=$total_array[0]['id_detalle'];
			//$builder1->freeResult();
				
			if($total_dat==0)
			{
				$data = [
					'id_examen' => $id_examen,
					'id_pregunta'  => $id_pregunta,
					'opcion_alias'  => $valorsel,
					'created_date' =>date('Y-m-d H:i:s'),
					'user_created' =>$id_user
				];	
				$builder = $db->table('examen_alumnos_det');			
				$builder->insert($data);
				$tot_affect=$db->affectedRows();
				echo $tot_affect;
				return false;
			}
			else{

				$data = [
					'opcion_alias' => $valorsel,
					'updated_date'  => date('Y-m-d H:i:s'),
					'user_updated'  => $id_user
				];		
				$builder = $db->table('examen_alumnos_det');		
				$builder->where('id_examen = '.$id_examen.' AND id_pregunta='.$id_pregunta.'');
				$builder->update($data);
				$tot_affect=$db->affectedRows();
				echo $tot_affect;
				return false;	
				
			}
			
						
			
		}
		else // id_examen >0
		{
			echo '0';
			return false;
		}*/

	}



}