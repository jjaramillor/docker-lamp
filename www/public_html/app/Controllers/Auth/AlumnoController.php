<?php
namespace App\Controllers\Auth;

use CodeIgniter\Controller;
use Config\Email;
use Config\Services;
use App\Models\AlumnoModel;



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
	}


    public function get_alumnos()
    {
        if( $this->request->isAjax() )
		{
			$id_colegio = $this->request->getPost('id_colegio');			
			$id_nivel = $this->request->getPost('nivel');
			$id_grado = $this->request->getPost('grado');
			$alumnoModel = new AlumnoModel();
			//$datacursos = $alumnoModel->get_alumnos($id_colegio,$id_nivel,$id_grado); 	
				
			//header('Content-Type: application/json');
			// echo json_encode($datacursos);
				
		}
		else
		{
			redirect('404');
		}
			


    }


}