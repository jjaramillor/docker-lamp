<?php
namespace App\Controllers\Auth;

use CodeIgniter\Controller;
use Config\Email;
use Config\Services;
use App\Models\ColegioModel;
use App\Models\AreaModel;
use App\Models\UserModel;



class AccountController extends Controller
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
       // helper('periodos');
    }

    //--------------------------------------------------------------------

	/**
	 * Displays account settings.
	 */
    public function genera_periodos() {
        $periodos_gen=['2023-2','2023-1','2022-2','2022-1'];
        return $periodos_gen;
    }
    public function validaAcceso($menu_valid,$session_acceso)
    {
        $valid='0';
        foreach ($session_acceso as $index=>$valk)
        {
            if($menu_valid=="/".$valk->ruta)
            {
                return '1'; break;
            }

        }
        return '2';
    }
    public  function noacceso()
    {

        $perfil=$this->session->userData['idperfil'];
        $cod_colegio=$this->session->userData['cod_colegio'];
        if (! $this->session->isLoggedIn) {
            return redirect()->to('logout');
        }

        return view('auth/acceso_nofound',[
        'userData' => $this->session->userData,
			'perfil' => $perfil
		]);
    }
	public function account()
	{

		if (! $this->session->isLoggedIn) {
			return redirect()->to('logout');
		}
        $rutaMenu = $this->request->getPath();
        $data['periodos']= $this->genera_periodos();
		$perfil=$this->session->userData['idperfil'];
		$cod_colegio=$this->session->userData['cod_colegio'];
		$data_colegio=[];
		$areas_nivel=[];
		$data_ugel=[];
		$areaModel = new AreaModel();
		$areas_nivel = $areaModel->where('active',1)->findAll();
        $accPer=0;
		if($perfil==1)
		{
			$db = \Config\Database::connect();
			$query =$db->table('colegios')->select('id_colegio,id_nivel,cod_local,nom_colegio,id_ugel');
		    $query->where('active',1);			
			$data_colegio   = $query->get()->getResult();

			$query2 =$db->table('ugel')->select('id_ugel,nom_ugel');
		    $query2->where('active',1)->orderBy('id_ugel','ASC');			
			$data_ugel   = $query2->get()->getResult();
            $accPer=1;
			
		}
		else if($perfil==2)
		{
			$condiciones=['active'=>1,'cod_local'=>(int)$cod_colegio];
			$colegiosModel = new ColegioModel();			
			$data_colegio = $colegiosModel->where($condiciones)			
				  ->findAll();
		   

		}
		else if($perfil==3)
		{
			$condiciones=['active'=>1,'cod_modular'=>(int)$cod_colegio];
			$colegiosModel = new ColegioModel();

			$data_colegio = $colegiosModel->where($condiciones)			
				  ->findAll();			
		}
		else
		{
			return redirect()->to('logout');
			
		}
        $rutaMenu = $this->request->getPath();
        $validMenu=$this->validaAcceso($rutaMenu,$this->session->userData['accesos_menu']);
        if($validMenu!='1')
        {
            return redirect()->to('noacceso');
        }
		
		return view('auth/starter', [
			'userData' => $this->session->userData,
			'perfil' => $perfil,
			'data_colegio'=>$data_colegio,
			'areas_nivel'=>$areas_nivel,		
			'data_ugel'=>$data_ugel,
			'periodoAct'=>$data['periodos'],
            'permiso_per'=>$accPer
		]);

		
	}

	public function get_areas_grado()
	{

		
		if( $this->request->isAjax() )
		{
			$id_colegio = $this->request->getPost('id_colegio');
            $periodo = $this->request->getPost('periodo');
			$areaModel = new AreaModel();
			$datacursos = $areaModel->get_datos_grado($id_colegio,$periodo);
				
			header('Content-Type: application/json');
			 echo json_encode($datacursos);
				
		}
		else
		{
			redirect('404');
		}
        
                   

	}
	
	public function students()
	{
		if (! $this->session->isLoggedIn) {
			return redirect()->to('logout');
		}

		return view('auth/starter2', [
			'userData' => $this->session->userData,
		]);
	}

	//--------------------------------------------------------------------

	/**
	 * Displays profile page.
	 */
	public function profile()
	{
		if (! $this->session->isLoggedIn) {
			return redirect()->to('logout');
		}

		return view('auth/profile2', [
			'userData' => $this->session->userData,
		]);
	}
	
	//--------------------------------------------------------------------

	/**
	 * Updates regular account settings.
	 */
	public function updateProfile()
	{
		// update user, validation happens in model
		if (! $this->session->isLoggedIn) {
			return redirect()->to('logout');
		}
		return redirect()->to('logout');
		$perfil=$this->session->userData['idperfil'];
		
		$users = new UserModel();
		$getRule = $users->getRule('updateProfile');
		$users->setValidationRules($getRule);

		$user = [
			'id'  	=> $this->session->get('userData.id'),
			'name' 	=> $this->request->getPost('name'),
			'firstname' 	=> $this->request->getPost('firstname'),
			'lastname' 	=> $this->request->getPost('lastname'),
			'email' 	=> $this->request->getPost('email')
		];

		if (! $users->save($user)) {
			return redirect()->back()->withInput()->with('errors', $users->errors());
        }
        // update session data
        $this->session->push('userData', $user);

        return redirect()->to('profile')->with('success', lang('se actualizo correctamente'));
	}

    //--------------------------------------------------------------------

	/**
	 * Updates regular account settings.
	 */
	public function updateAccount()
	{
		return redirect()->to('logout');
		// update user, validation happens in model
		
		
		$users = new UserModel();
		$getRule = $users->getRule('updateAccount');
		$users->setValidationRules($getRule);

		$user = [
			'id'  	=> $this->session->get('userData.id'),
			'name' 	=> $this->request->getPost('name')
		];

		if (! $users->save($user)) {
			return redirect()->back()->withInput()->with('errors', $users->errors());
        }

        // update session data
        $this->session->push('userData', $user);

        return redirect()->to('account')->with('success', lang('Auth.updateSuccess'));
	}

    //--------------------------------------------------------------------

	/**
	 * Handles password change.
	 */
	public function changePassword()
	{
		return redirect()->to('logout');
		// validate request
		$rules = [
			'password' 	=> 'required|min_length[5]',
			'new_password' => 'required|min_length[5]',
			'new_password_confirm' => 'required|matches[new_password]'
		];

		if (! $this->validate($rules)) {
			return redirect()->to('profile')->withInput()
				->with('errors', $this->validator->getErrors());
		}

		// check current password
		$users = new UserModel();

		$user = $users->find($this->session->get('userData.id'));

		if (
			! $user ||
			! password_verify($this->request->getPost('password'), $user['password_hash'])
		) {
			return redirect()->to('profile')->withInput()->with('error', lang('Auth.wrongCredentials'));
		}

		// update user's password
		$updatedUser['id'] = $this->session->get('userData.id');

		$updatedUser['password'] = $this->request->getPost('new_password');

		$users->save($updatedUser);

		// redirect to account with success message
		return redirect()->to('profile')->with('success', lang('Auth.passwordUpdateSuccess'));
	}

    //--------------------------------------------------------------------

	/**
	 * Deletes user account.
	 */
	public function deleteAccount()
	{
		return redirect()->to('logout');
		// check current password
		$users = new UserModel();
		
		$user = $users->find($this->session->get('userData.id'));

		if (
			! $user ||
			! password_verify($this->request->getPost('password'), $user['password_hash'])
		) {
			return redirect()->back()->withInput()->with('error', lang('Auth.wrongCredentials'));
		}

		// delete account from DB
		$users->delete($this->session->get('userData.id'));

		// log out user
		$this->session->remove(['isLoggedIn', 'userData']);

		// redirect to register with success message
		return redirect()->to('register')->with('success', lang('Auth.accountDeleted'));
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
	///reportes
	public function reporte()
	{
		if (! $this->session->isLoggedIn) {
			return redirect()->to('logout');
		}
        $data['periodos']= $this->genera_periodos();

		$niveles=[];
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
		}elseif($idperfil=='3'){
			$nombre_perfil="DOCENTE";
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
		
		if($idperfil=='1')
		{
			$query2 =$db->table('ugel')->select('id_ugel,nom_ugel');
			$query2->where('active',1)->orderBy('id_ugel','ASC');
			$data_ugel   = $query2->get()->getResult();
			
		}
		elseif($idperfil=='2')
		{
			$query =$db->table('colegios')->select('id_colegio,id_nivel,cod_local,nom_colegio')->orderBy('nom_colegio','ASC');
			$query->where(['active'=>1,'cod_local'=>$cod_colegio]);
			$data_colegio   = $query->get()->getResult();
		}
		else
		{
			return redirect()->to('logout');
		}
        $rutaMenu = $this->request->getPath();
        $validMenu=$this->validaAcceso($rutaMenu,$this->session->userData['accesos_menu']);
        if($validMenu!='1')
        {
            return redirect()->to('noacceso');
        }
		
		
		return view('auth/reporte', 
		[
			'userData' => $this->session->userData,
			'data_colegio'=>$data_colegio,
			'nombre_perfil'=>$nombre_perfil,
			'displa_none'=>$displa_none,
			'niveles'=>$niveles,
			'data_ugel'=>$data_ugel,
			'periodoAct'=>$data['periodos']
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
        $data['periodo'] = $this->genera_periodos();
		$nombre_perfil="";$displa_none="";
		$idperfil=$this->session->userData['idperfil'];
		$cod_colegio=$this->session->userData['cod_colegio'];
		$niveles=[];
		if($idperfil=='1'){
			$nombre_perfil="ADMINISTRADOR DE SISTEMA";
			$niveles=['1'=>'primaria','2'=>'secundaria'];
			$displa_none="";
		}elseif($idperfil=='2'){
			$nombre_perfil="DIRECTOR";
			$displa_none="display:none;";
			
		}elseif($idperfil=='3'){
			$nombre_perfil="DOCENTE";
			$displa_none="display:none;";
		}
		////////////
		$data_colegio=[];
		$data_ugel=[];
		$db = \Config\Database::connect();
		
		if($idperfil=='1'){
			$query2 =$db->table('ugel')->select('id_ugel,nom_ugel');
			$query2->where('active',1)->orderBy('id_ugel','ASC');
			$data_ugel   = $query2->get()->getResult();
			
		}elseif($idperfil=='2'){
			
			$query =$db->table('colegios')->select('id_colegio,id_nivel,cod_local,nom_colegio');
			$query->where(['active'=>1,'cod_local'=>$cod_colegio]);
			$data_colegio   = $query->get()->getResult();
		}
		else
		{
			return redirect()->to('logout');
		}
        $rutaMenu = $this->request->getPath();
        $validMenu=$this->validaAcceso($rutaMenu,$this->session->userData['accesos_menu']);
        if($validMenu!='1')
        {
            return redirect()->to('noacceso');
        }

		return view('auth/reporte-preguntas', 
		[
			'userData' => $this->session->userData,
			'data_colegio'=>$data_colegio,
			'nombre_perfil'=>$nombre_perfil,
			'displa_none'=>$displa_none,
			'niveles'=>$niveles,
			'data_ugel'=>$data_ugel,
            'periodoAct'=>$data['periodo']
		]);
	}
	public function reporte_capacidades()
	{
		if (! $this->session->isLoggedIn) {
			return redirect()->to('logout');
		}
        $data['periodo'] = $this->genera_periodos();
		$nombre_perfil="";$displa_none="";
		$idperfil=$this->session->userData['idperfil'];
		$cod_colegio=$this->session->userData['cod_colegio'];
		$niveles=[];
		if($idperfil=='1'){
			$nombre_perfil="ADMINISTRADOR DE SISTEMA";
			$displa_none="";
			$niveles=['1'=>'primaria','2'=>'secundaria'];
		}elseif($idperfil=='2'){
			$nombre_perfil="DIRECTOR";
			$displa_none="display:none;";			
		}elseif($idperfil=='3'){
			$nombre_perfil="DOCENTE";
			$displa_none="display:none;";
		}
		////////////
		$data_colegio=[];
		$data_ugel=[];
		$db = \Config\Database::connect();
		
		if($idperfil=='1'){			
			
			$query2 =$db->table('ugel')->select('id_ugel,nom_ugel');
			$query2->where('active',1)->orderBy('id_ugel','ASC');		
			$data_ugel   = $query2->get()->getResult();
			
		}elseif($idperfil=='2'){
			
			$query =$db->table('colegios')->select('id_colegio,id_nivel,cod_local,nom_colegio');			
			$query->where('cod_local',$cod_colegio);
			$data_colegio   = $query->get()->getResult();
		}else
		{
			
			return redirect()->to('logout');
		}
        $rutaMenu = $this->request->getPath();
        $validMenu=$this->validaAcceso($rutaMenu,$this->session->userData['accesos_menu']);
        if($validMenu!='1')
        {
            return redirect()->to('noacceso');
        }
		return view('auth/reporte-capacidades', 
		[
			'userData' => $this->session->userData,
			'data_colegio'=>$data_colegio,
			'nombre_perfil'=>$nombre_perfil,
			'displa_none'=>$displa_none,
			'niveles'=>$niveles,
			'idperfil'=>$idperfil,
			'data_ugel'=>$data_ugel,
            'periodoAct'=>$data['periodo']
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
			$id_nivel = $this->request->getPost('id_nivel');
			$periodo = $this->request->getPost('periodo');
			//return $colegio;
			$cursosModel = new AreaModel();
			$datacursos = $cursosModel->get_valor($id_valor,$id_valor_1,$tabla,$columnas,$columna_filter,$columna_filter_1,$inner_join,$colegio_id,$id_nivel,$periodo);
				
			 header('Content-Type: application/json');
			 echo json_encode($datacursos);
				
		}else{
			redirect('404');
		}
	}
	
	public function get_capacidades()
	{
		
		if( $this->request->isAjax() ){
			$id_ugel = $this->request->getPost('id_ugel');
			$colegio = $this->request->getPost('colegio');
			$niveles = $this->request->getPost('niveles');
			$area = $this->request->getPost('area');
			$grado = $this->request->getPost('grado');
			$seccion = $this->request->getPost('seccion');
			$cursosModel = new AreaModel();
			$datacursos = $cursosModel->get_capacidades($id_ugel,$colegio,$niveles,$area,$grado,$seccion); 	
			 header('Content-Type: application/json');
			 echo json_encode($datacursos);
				
		}else{
			redirect('404');
		}
	}
	
	public function get_detalle()
	{
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
	
	public function reporte_notas()
	{
		if (! $this->session->isLoggedIn) {
			return redirect()->to('logout');
		}
        $data['periodo'] =$this->genera_periodos();
		$nombre_perfil="";$displa_none="";
		$idperfil=$this->session->userData['idperfil'];
		$cod_colegio=$this->session->userData['cod_colegio'];
		if($idperfil=='1'){
			$nombre_perfil="ADMINISTRADOR DE SISTEMA";
			$displa_none="";
		}elseif($idperfil=='2'){
			$nombre_perfil="DIRECTOR";
			$displa_none="display:none;";
		}elseif($idperfil=='3'){
			$nombre_perfil="DOCENTE";
			$displa_none="display:none;";
		}
		////////////
		$data_colegio=[];
		$db = \Config\Database::connect();
		$query =$db->table('colegios')->select('id_colegio,id_nivel,cod_local,nom_colegio');
		if($idperfil=='1'){
			$query->where('active',1);
		}elseif($idperfil=='2'){
			$query->where('cod_local',$cod_colegio);
		}elseif($idperfil=='3'){
			$query->where('cod_local',$cod_colegio);
		}
		$data_colegio   = $query->get()->getResult();
		/////
		$query2 =$db->table('ugel')->select('id_ugel,nom_ugel');
	    $query2->where('active',1);
	    $data_ugel   = $query2->get()->getResult();
        $rutaMenu = $this->request->getPath();
        $validMenu=$this->validaAcceso($rutaMenu,$this->session->userData['accesos_menu']);
        if($validMenu!='1')
        {
            return redirect()->to('noacceso');
        }
		return view('auth/reporte-notas', 
		[
			'userData' => $this->session->userData,
			'data_colegio'=>$data_colegio,'nombre_perfil'=>$nombre_perfil,'displa_none'=>$displa_none,
			'data_ugel'=>$data_ugel,
            'periodoAct'=>$data['periodo']

        ]);
	}
	public function get_notas(){
		if( $this->request->isAjax() ){
			$ugel = $this->request->getPost('ugel');
			$colegio = $this->request->getPost('colegio');
			$niveles = $this->request->getPost('niveles');
			$area = $this->request->getPost('area');
			$grado = $this->request->getPost('grado');
			$seccion = $this->request->getPost('seccion');
			$cursosModel = new AreaModel();
			$datacursos = $cursosModel->get_notas($ugel,$colegio,$niveles,$area,$grado,$seccion);
			 header('Content-Type: application/json');
			 echo json_encode($datacursos);
				
		}else{
			redirect('404');
		}
	}
	public function reporte_avance()
	{
		if (! $this->session->isLoggedIn) {
			return redirect()->to('logout');
		}
        $data['periodo'] = $this->genera_periodos();
		$nombre_perfil="";$displa_none="";
		$idperfil=$this->session->userData['idperfil'];
		$cod_colegio=$this->session->userData['cod_colegio'];
		if($idperfil=='1'){
			$nombre_perfil="ADMINISTRADOR DE SISTEMA";
			$displa_none="";
		}elseif($idperfil=='2'){
			$nombre_perfil="DIRECTOR";
			$displa_none="display:none;";
		}elseif($idperfil=='3'){
			$nombre_perfil="DOCENTE";
			$displa_none="display:none;";
		}
		////////////
		$data_colegio=[];
		$db = \Config\Database::connect();
		$query =$db->table('colegios')->select('id_colegio,id_nivel,cod_local,nom_colegio');
		if($idperfil=='1'){
			$query->where('active',1);
		}elseif($idperfil=='2'){
			$query->where('cod_local',$cod_colegio);
		}elseif($idperfil=='3'){
			$query->where('cod_local',$cod_colegio);
		}
		$data_colegio   = $query->get()->getResult();
		/////
		$query2 =$db->table('ugel')->select('id_ugel,nom_ugel');
	    $query2->where('active',1);
	    $data_ugel   = $query2->get()->getResult();
        $rutaMenu = $this->request->getPath();
        $validMenu=$this->validaAcceso($rutaMenu,$this->session->userData['accesos_menu']);
        if($validMenu!='1')
        {
            return redirect()->to('noacceso');
        }
		return view('auth/reporte-avance', 
		[
			'userData' => $this->session->userData,
			'data_colegio'=>$data_colegio,'nombre_perfil'=>$nombre_perfil,'displa_none'=>$displa_none,
			'data_ugel'=>$data_ugel,
            'periodoAct'=>$data['periodo']
		]);
	}
	public function get_avance(){
		
		
		if( $this->request->isAjax()){
			$ugel = $this->request->getPost('ugel');
			$colegio = $this->request->getPost('colegio');
			$cursosModel = new AreaModel();
			$datacursos = $cursosModel->get_avance($ugel,$colegio);
			 header('Content-Type: application/json');
			 echo json_encode($datacursos);
				
		}else{
			redirect('404');
		}
	}
	public function reporte_avance_niveles(){
		if (! $this->session->isLoggedIn) {
			return redirect()->to('logout');
		}
        $data['periodo'] = $this->genera_periodos();
		$nombre_perfil="";$displa_none="";
		$idperfil=$this->session->userData['idperfil'];
		$cod_colegio=$this->session->userData['cod_colegio'];
		if($idperfil=='1'){
			$nombre_perfil="ADMINISTRADOR DE SISTEMA";
			$displa_none="";
		}elseif($idperfil=='2'){
			$nombre_perfil="DIRECTOR";
			$displa_none="display:none;";
		}elseif($idperfil=='3'){
			$nombre_perfil="DOCENTE";
			$displa_none="display:none;";
		}
		////////////
		$data_colegio=[];
		$db = \Config\Database::connect();
		/////
		$query2 =$db->table('ugel')->select('id_ugel,nom_ugel');
	    $query2->where('active',1);
	    $data_ugel   = $query2->get()->getResult();
        $rutaMenu = $this->request->getPath();
        $validMenu=$this->validaAcceso($rutaMenu,$this->session->userData['accesos_menu']);
        if($validMenu!='1')
        {
            return redirect()->to('noacceso');
        }
		return view('auth/reporte-avance-niveles', 
		[
			'userData' => $this->session->userData,'nombre_perfil'=>$nombre_perfil,'displa_none'=>$displa_none,
			'data_ugel'=>$data_ugel,
            'periodoAct'=>$data['periodo']
		]);
	}
	public function reporte_avance_areas()
	{
		if (! $this->session->isLoggedIn) {
			return redirect()->to('logout');
		}
        $data['periodo'] = $this->genera_periodos();
		$nombre_perfil="";$displa_none="";
		$idperfil=$this->session->userData['idperfil'];
		$cod_colegio=$this->session->userData['cod_colegio'];
		if($idperfil=='1'){
			$nombre_perfil="ADMINISTRADOR DE SISTEMA";
			$displa_none="";
		}elseif($idperfil=='2'){
			$nombre_perfil="DIRECTOR";
			$displa_none="display:none;";
		}elseif($idperfil=='3'){
			$nombre_perfil="DOCENTE";
			$displa_none="display:none;";
		}
		////////////
		$data_colegio=[];
		$db = \Config\Database::connect();
		$query =$db->table('colegios')->select('id_colegio,id_nivel,cod_local,nom_colegio');
		if($idperfil=='1'){
			$query->where('active',1);
		}elseif($idperfil=='2'){
			$query->where('cod_local',$cod_colegio);
		}elseif($idperfil=='3'){
			$query->where('cod_local',$cod_colegio);
		}
		$data_colegio   = $query->get()->getResult();
		/////
		$query2 =$db->table('ugel')->select('id_ugel,nom_ugel');
	    $query2->where('active',1);
	    $data_ugel   = $query2->get()->getResult();
        $rutaMenu = $this->request->getPath();
        $validMenu=$this->validaAcceso($rutaMenu,$this->session->userData['accesos_menu']);
        if($validMenu!='1')
        {
            return redirect()->to('noacceso');
        }
		return view('auth/reporte-avance-areas', 
		[
			'userData' => $this->session->userData,
			'data_colegio'=>$data_colegio,'nombre_perfil'=>$nombre_perfil,'displa_none'=>$displa_none,
			'data_ugel'=>$data_ugel,
            'periodoAct'=>$data['periodo']
		]);
	}
	public function get_avance_areas(){
		if( $this->request->isAjax()){
			$ugel = $this->request->getPost('ugel');
			$colegio = $this->request->getPost('colegio');
			$cursosModel = new AreaModel();
			$datacursos = $cursosModel->get_avance_areas($ugel,$colegio);
			 header('Content-Type: application/json');
			 echo json_encode($datacursos);
				
		}else{
			redirect('404');
		}
	}
	
	public function reporte_escala_microregion(){
		if (! $this->session->isLoggedIn) {
			return redirect()->to('logout');
		}
        $data['periodo'] = $this->genera_periodos();
		$nombre_perfil="";$displa_none="";
		$idperfil=$this->session->userData['idperfil'];
		$cod_colegio=$this->session->userData['cod_colegio'];
		$filter_micro=['active'=>1];
		if($idperfil=='1'){
			$nombre_perfil="ADMINISTRADOR DE SISTEMA";
			$displa_none="";
		}
		elseif($idperfil=='5'){
			$nombre_perfil="REPORTE MICROREGION";
			$displa_none="";
			$filter_micro=['active'=>1,'idregion'=>$cod_colegio];
		}
		else
		{
			return redirect()->to('logout');
		}
		////////////
		$data_colegio=[];
		$db = \Config\Database::connect();
		
		$query1 =$db->table('microregion')->select('idregion,nombre_micro');
	    $query1->where($filter_micro);
	    $data_micro  = $query1->get()->getResult();
        $rutaMenu = $this->request->getPath();
        $validMenu=$this->validaAcceso($rutaMenu,$this->session->userData['accesos_menu']);
        if($validMenu!='1')
        {
            return redirect()->to('noacceso');
        }
		return view('auth/reporte-escala-microregion', 
		[
			'userData' => $this->session->userData,
			'nombre_perfil'=>$nombre_perfil,
			'displa_none'=>$displa_none,			
			'data_micro'=>$data_micro,
            'periodoAct'=>$data['periodo']
		]);
	}
	
	public function get_microregion(){
		if( $this->request->isAjax()){
			$ugel = $this->request->getPost('ugel');			
			$id_evaluacion = $this->request->getPost('id_evaluacion');
			$id_nivel = $this->request->getPost('nivel');
			$microregion = $this->request->getPost('micro_regi');
			$periodo = $this->request->getPost('periodo');

			$cursosModel = new AreaModel();
			$datacursos = $cursosModel->get_microregion($ugel,$id_evaluacion,$id_nivel,$microregion,$periodo);
			 header('Content-Type: application/json');
			 echo json_encode($datacursos);
				
		}else{
			redirect('404');
		}
	}
	
	public function reporte_escala_region()
	{
		if (! $this->session->isLoggedIn) {
			return redirect()->to('logout');
		}
        $data['periodo'] = $this->genera_periodos();
		$nombre_perfil="";$displa_none="";
		$idperfil=$this->session->userData['idperfil'];
		$cod_colegio=$this->session->userData['cod_colegio'];
		if($idperfil=='1'){
			$nombre_perfil="ADMINISTRADOR DE SISTEMA";
			$displa_none="";
		}
		else
		{
			return redirect()->to('logout');
		}

        $rutaMenu = $this->request->getPath();
        $validMenu=$this->validaAcceso($rutaMenu,$this->session->userData['accesos_menu']);
        if($validMenu!='1')
        {
            return redirect()->to('noacceso');
        }
		$data_colegio=[];
		$db = \Config\Database::connect();
		return view('auth/reporte-escala-region', 
		[
			'userData' => $this->session->userData,
            'nombre_perfil'=>$nombre_perfil,
            'displa_none'=>$displa_none,
            'periodoAct'=>$data['periodo']
		]);
	}
	
    public function get_regional()
	{
		$id_evaluacion = $this->request->getPost('id_evaluacion');
			$id_nivel = $this->request->getPost('nivel');			
						
			$cursosModel = new AreaModel();
			$datacursos = $cursosModel->get_regional($id_evaluacion,$id_nivel);
			 header('Content-Type: application/json');
			 echo json_encode($datacursos);
			 
		/*if( $this->request->isAjax()){						
			
				
		}else{
			redirect('404');
		}*/
	}
	
	public function reporte_de_escala(){
		
		if (! $this->session->isLoggedIn) {
			return redirect()->to('logout');
		}
        $data['periodo'] = $this->genera_periodos();
		$filter_ugel=['active'=>1];
		$nombre_perfil="";$displa_none="";
		$idperfil=$this->session->userData['idperfil'];
		$cod_colegio=$this->session->userData['cod_colegio'];
		
		if($idperfil=='1'){
			$nombre_perfil="ADMINISTRADOR DE SISTEMA";
			$displa_none="";
		}
		elseif($idperfil=='4'){
			$nombre_perfil="REPORTE POR UGEL";
			$displa_none="";
			$filter_ugel=['active'=>1,'id_ugel'=>$cod_colegio];
		}
		else
		{
			return redirect()->to('logout');
		}
        $rutaMenu = $this->request->getPath();
        $validMenu=$this->validaAcceso($rutaMenu,$this->session->userData['accesos_menu']);
        if($validMenu!='1')
        {
            return redirect()->to('noacceso');
        }
		$data_colegio=[];
		$db = \Config\Database::connect();
		/////
		$query2 =$db->table('ugel')->select('id_ugel,nom_ugel');
	    $query2->where($filter_ugel);
	    $data_ugel   = $query2->get()->getResult();
		///
		return view('auth/reporte-de-escala', 
		[
			'userData' => $this->session->userData,
			'nombre_perfil'=>$nombre_perfil
			,'displa_none'=>$displa_none,
			'data_ugel'=>$data_ugel,
            'periodoAct'=>$data['periodo']
		]);
	}
	public function get_escala(){
		if( $this->request->isAjax()){
			$ugel = $this->request->getPost('ugel');			
			$id_evaluacion = $this->request->getPost('id_evaluacion');
			$id_nivel = $this->request->getPost('nivel');
			$cod_local = $this->request->getPost('cod_local');
						
			$cursosModel = new AreaModel();
			$datacursos = $cursosModel->get_escala($ugel,$cod_local,$id_evaluacion,$id_nivel);
			 header('Content-Type: application/json');
			 echo json_encode($datacursos);
				
		}else{
			redirect('404');
		}
	}

}
