<?php
namespace App\Controllers\Auth;

use CodeIgniter\Controller;
use Config\Email;
use Config\Services;
use App\Models\ColegioModel;
use App\Models\AreaModel;
use App\Models\UserModel;
use App\Models\EvaluacionpregModel;



class ReporteController extends Controller
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


    //--------------------------------------------------------------------

	public function __construct()
	{
		// start session
		$this->session = Services::session();
        //helper('periodos');
	}

    public function export_excel()
	{	

		$datos_excel=$this->request->getPost('datos_excel');
		$arquivo="prueba";
		
		header("Expires: Mon, 26 Jul 2227 05:00:00 GMT");
		header("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
		header("Cache-Control: no-cache, must-revalidate");
		header("Pragma: no-cache");
		header("Content-type: application/x-msexcel");
		header("Content-Disposition: attachment; filename=\"{$arquivo}\"");
		header("Content-Description: PHP Generado Data");
		// Envia contenido al archivo
		echo $datos_excel;
		return false;
	}
	
	public function getNotasColegio()
	{
	
		if(!$this->request->isAjax() )
		{
			redirect('404');
		}
		$cod_local = $this->request->getPost('cod_local');	
		$id_nivel = $this->request->getPost('id_nivel');
		$id_evaluacion = $this->request->getPost('id_evaluacion');
		$id_ugel = $this->request->getPost('id_ugel');
		$grado = $this->request->getPost('grado');
		$seccion = $this->request->getPost('seccion');
	
		$EvaluacionpregModel = new EvaluacionpregModel();
		$result_data = $EvaluacionpregModel->reporte_notas_colegio($id_ugel,$cod_local,$id_nivel,$id_evaluacion,$grado,$seccion);	
		
		return $result_data;
		
		
		
	}
    public function genera_periodos() {
        $periodos_gen=['2022-2','2022-1'];
        return $periodos_gen;
    }
	
	public function get_notas_colegio()
	{
		
		if (! $this->session->isLoggedIn) {
			return redirect()->to('logout');
		}
		/////////////
		$niveles=[];
        $data['periodo'] = $this->genera_periodos();
		$nombre_perfil="";$displa_none="";
		$idperfil=$this->session->userData['idperfil'];
		$cod_colegio=$this->session->userData['cod_colegio'];
		if($idperfil=='1'){
			$nombre_perfil="ADMINISTRADOR DE SISTEMA";
			$displa_none="";
			$niveles=['1'=>'primaria','2'=>'secundaria'];
		}elseif($idperfil=='2'){
			$nombre_perfil="DIRECTOR";
			$displa_none="display:none;";
		}
		else
		{
			return redirect()->to('logout');
		}
		////////////
		$data_colegio=[];
		$data_ugel=[];
		$db = \Config\Database::connect();
		
		if($idperfil=='1'){
			
		$query2 =$db->table('ugel')->select('id_ugel,nom_ugel');
	    $query2->where('active',1);
	    $data_ugel   = $query2->get()->getResult();
			
		}elseif($idperfil=='2'){
			$query =$db->table('colegios')->select('id_colegio,id_nivel,cod_local,nom_colegio');
			$query->where('cod_local',$cod_colegio);
			$data_colegio   = $query->get()->getResult();
		}
			
		return view('auth/reporte_notas_colegio', 
		[
			'userData' => $this->session->userData,
			'data_colegio'=>$data_colegio,
			'nombre_perfil'=>$nombre_perfil,
			'displa_none'=>$displa_none,
			'idperfil'=>$idperfil,
			'niveles'=>$niveles,
			'data_ugel'=>$data_ugel,
            'periodoAct'=>$data['periodo']
		]);
	}


	public function get_areas_grado()
	{
		
		//$id_colegio = $this->request->getPost('id_colegio');
		
		
		if( $this->request->isAjax() )
		{
			$id_colegio = $this->request->getPost('id_colegio');			
			$areaModel = new AreaModel();
			$datacursos = $areaModel->get_datos_grado($id_colegio); 	
				
			header('Content-Type: application/json');
			 echo json_encode($datacursos);
				
		}
		else
		{
			redirect('404');
		}
			
        
                   

	}	


	public function reporte()
	{
		if (! $this->session->isLoggedIn) {
			return redirect()->to('logout');
		}
		$perfil=$this->session->userData['idperfil'];
		
		$cod_colegio=$this->session->userData['cod_colegio'];
		$data_colegio=[];
		$db = \Config\Database::connect();
		$array_filter=['active'=>1];
		if($perfil==2)
		{
			$array_filter=['active'=>1,'cod_local'=>$cod_colegio];
		}		
		
		$query =$db->table('colegios')->select('id_colegio,id_nivel,cod_local,nom_colegio,id_ugel');
		$query->where($array_filter);
		$data_colegio   = $query->get()->getResult();

		$query2 =$db->table('ugel')->select('id_ugel,nom_ugel');
	    $query2->where('active',1);
	    $data_ugel   = $query2->get()->getResult();
	
		return view('auth/reporte', 
		[
			'userData' => $this->session->userData,
			'data_colegio'=>$data_colegio,
			'data_ugel'=>$data_ugel,
			'perfil'=>$perfil
		]);
	}
	public function get_datos()
	{
		
		if( $this->request->isAjax() ){
			$colegio = $this->request->getPost('colegio');
			$niveles = $this->request->getPost('niveles');
			$area = $this->request->getPost('area');
			$grado = $this->request->getPost('grado');
			$seccion = $this->request->getPost('seccion');
			$cursosModel = new AreaModel();
			$datacursos = $cursosModel->get_datos($colegio,$niveles,$area,$grado,$seccion); 
						
			 header('Content-Type: application/json');
			 echo json_encode($datacursos);
				
		}else{
			redirect('404');
		}
	}
	//
	public function reporte_preguntas()
	{
		if (! $this->session->isLoggedIn) {
			return redirect()->to('logout');
		}
		$data_colegio=[];
		$db = \Config\Database::connect();
		$query =$db->table('colegios')->select('id_colegio,id_nivel,cod_local,nom_colegio');
		$query->where('active',1);
		$data_colegio   = $query->get()->getResult();

		return view('auth/reporte-preguntas', 
		[
			'userData' => $this->session->userData,
			'data_colegio'=>$data_colegio
		]);
	}
	public function reporte_capacidades()
	{
		if (! $this->session->isLoggedIn) {
			return redirect()->to('logout');
		}
		$data_colegio=[];
		$db = \Config\Database::connect();
		$query =$db->table('colegios')->select('id_colegio,id_nivel,cod_local,nom_colegio');
		$query->where('active',1);
		$data_colegio   = $query->get()->getResult();

		return view('auth/reporte-capacidades', 
		[
			'userData' => $this->session->userData,
			'data_colegio'=>$data_colegio
		]);
	}
	public function get_valor()
	{
		
		
		if( $this->request->isAjax() ){
			$id_valor = $this->request->getPost('id_valor');
			$id_valor_1 = $this->request->getPost('id_valor_1');
			$tabla = $this->request->getPost('tabla');
			$columnas = $this->request->getPost('columnas');
			$columna_filter = $this->request->getPost('columna_filter');
			$columna_filter_1 = $this->request->getPost('columna_filter_1');
			$inner_join = $this->request->getPost('inner_join');
			$colegio_id = $this->request->getPost('colegio_id');
			//return $colegio;
			$cursosModel = new AreaModel();
			$datacursos = $cursosModel->get_valor($id_valor,$id_valor_1,$tabla,$columnas,$columna_filter,$columna_filter_1,$inner_join,$colegio_id); 	
				
		
			 header('Content-Type: application/json');
			 echo json_encode($datacursos);
				
		}else{
			redirect('404');
		}
	}
	public function get_capacidades()
	{
		
		
		if( $this->request->isAjax() ){
			$colegio = $this->request->getPost('colegio');
			$niveles = $this->request->getPost('niveles');
			$area = $this->request->getPost('area');
			$grado = $this->request->getPost('grado');
			$seccion = $this->request->getPost('seccion');
			$cursosModel = new AreaModel();
			$datacursos = $cursosModel->get_capacidades($colegio,$niveles,$area,$grado,$seccion); 	
			 header('Content-Type: application/json');
			 echo json_encode($datacursos);
				
		}else{
			redirect('404');
		}
	}
	public function get_detalle(){
		if( $this->request->isAjax() ){
			$colegio = $this->request->getPost('colegio');
			$niveles = $this->request->getPost('niveles');
			$area = $this->request->getPost('area');
			$grado = $this->request->getPost('grado');
			$seccion = $this->request->getPost('seccion');
			$valor1 = $this->request->getPost('valor1');
			$valor2 = $this->request->getPost('valor2');
			$valor3 = $this->request->getPost('valor3');
			$valor4 = $this->request->getPost('valor4');
			$valor5 = $this->request->getPost('valor5');
			$cursosModel = new AreaModel();
			$datacursos = $cursosModel->get_detalle($colegio,$niveles,$area,$grado,$seccion,$valor1,$valor2,$valor3,$valor4,$valor5); 	
			 header('Content-Type: application/json');
			 echo json_encode($datacursos);
				
		}else{
			redirect('404');
		}
	}
	
	public function get_duplicados()
	{
		return redirect()->to('logout');
		$db = \Config\Database::connect();
		$query =$db->table('dup6_limp');
		//$query->where('active',1);
		$data_dup   = $query->get()->getResult();
		$data_res=[];
		$preguntas=[];
		$id_examens_alum=[];
		$datos_t=[];
		foreach($data_dup as $dat)
		{	if($dat->id_pregunta<250)
			{
				$data_res[$dat->id_alumno][$dat->id_pregunta][$dat->id_detalle]=$dat->OPCION;
			$preguntas[$dat->id_pregunta]=$dat->id_pregunta;
			@$id_examens_alum[$dat->id_alumno][$dat->id_examen]=$dat->id_examen;
			$datos_t[$dat->id_alumno][$dat->id_detalle]=$dat->id_examen;
			}
			
		}
		
		return view('auth/duplicados', 
		[
			'userData' => $this->session->userData,
			'data_res'=>$data_res,
			'preguntas'=>$preguntas,
			'id_examens_alum'=>$id_examens_alum,
			'datos_t'=>$datos_t
		]);
		
	}
	
	public function get_notas_update()
	{
		//return redirect()->to('logout');
		
		$id_eval = $this->request->uri->getSegment(2);
	
		$EvaluacionpregModel = new EvaluacionpregModel();
		$result_data = $EvaluacionpregModel->get_notas_update($id_eval);	
		
		return view('auth/update_notas', 
		[
			'userData' => $this->session->userData,		
			'result_data'=>$result_data
		]);
		
	}
	
	public function get_prueba()
	{		
		$id_eval = $this->request->uri->getSegment(2);
		$id_ugel = $this->request->uri->getSegment(3);
		$EvaluacionpregModel = new EvaluacionpregModel();
		$result_data = $EvaluacionpregModel->get_omitidas($id_eval,$id_ugel);
				
		return view('auth/vista_pruebas', 
		[
			'datos' => $result_data,		
			'userData' => $this->session->userData		
			
		]);

		
	}

	public function get_grado()
	{
		
		if( $this->request->isAjax() )
		{
			$nivel = $this->request->getPost('nivel');
			$idcurso = $this->request->getPost('idcurso');
			$cursosModel = new AreaModel();
			$datacursos = $cursosModel->get_datos_grado($nivel,$idcurso); 	
				
			 //header('Content-Type: application/json');
			 //echo json_encode($datacursos);
			 echo json_encode(['datacursos'=>$datacursos]);
				
		}
		else
		{
			redirect('404');
		}
			
           
                   

	}

}
