<?php
namespace App\Controllers\Auth;

use CodeIgniter\Controller;
use Config\Email;
use Config\Services;
use App\Models\UserModel;
use App\Models\LogsModel;

class LoginController extends Controller
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

    //--------------------------------------------------------------------

	/**
	 * Displays login form or redirects if user is already logged in.
	 */
	public function login()
	{
		if ($this->session->isLoggedIn) {
			return redirect()->to('account');
		}

		return view('auth/auth/login');
	}

    //--------------------------------------------------------------------

	/**
	 * Attempts to verify user's credentials through POST request.
	 */
	public function attemptLogin()
	{
		// validate request
		$rules = [
			'name'		=> 'required|min_length[5]',
			'password' 	=> 'required|min_length[5]',
		];

		if (! $this->validate($rules)) {
			return redirect()->to('login')->withInput()->with('errors', $this->validator->getErrors());
		}

		// check credentials
		$users = new UserModel();
		$name_user=intval($this->request->getPost('name'));
		if($name_user==0){ $name_user=$this->request->getPost('name'); }
		
		$filter_user=['name'=>$name_user,'active'=>1];
		/*$user = $users->where('name',$name_user )->first();*/
		$user = $users->where($filter_user)->first();
		$mensaje_error='';
		$mensaje_error.='Estimados docentes, el tiempo para registrar los resultados ha finalizado, les agradecemos a todos por su atención y compromiso con este proyecto.';
		$mensaje_error.='<br>Atte. La Gerencia';
		
		if ( is_null($user) || ! password_verify($this->request->getPost('password'), $user['password_hash']) ) 
		{
			return redirect()->to('login')->withInput()->with('error',$mensaje_error);
		}

		// check activation
		if ($user['active']==0) {
			return redirect()->to('login')->withInput()->with('error', 'usuario no activo');
		}
		$sql_menu="SELECT a.`id_menu`,a.`ruta`,a.`alias`,a.`class_icon`,a.`class_id_menu`,b.`id_perfil` FROM menu a INNER JOIN permisos_perfiles b
		ON a.`id_menu`=b.`menu_id` WHERE id_perfil=".$user['idperfil']."";
		$query_menu= $db->query($sql_menu);
        $result_menu = $query_menu->getResult();

		// login OK, save user data to session
		$this->session->set('isLoggedIn', true);
		$this->session->set('userData', [
            'id' 		=> $user["id"],
            'cod_colegio' => $user["cod_colegio"],
            'name' 		=> $user["name"],
            'firstname' => $user["firstname"],
            'lastname' 	=> $user["lastname"],
            'email' 	=> $user["email"],
            'new_email' => $user["new_email"],
            'idperfil' 	=> $user["idperfil"],
            'accesos_menu' 	=> $result_menu
        ]);

        // save login info to user login logs for tracking
        // get user agent
        $agent = $this->request->getUserAgent();
        // load logs model
		$logs = new LogsModel();
		// logs data
		$userlog = [
			'date'	=> date("Y-m-d"),
			'time'	=> date("H:i:s"),
			'reference'	=> $user["id"],
			'name'	=> $user["name"],
			'ip'	=> $this->request->getIPAddress(),
			'browser'	=> $agent->getBrowser(),
			'status'	=> 'Success' 
		];
		// logs to database
		$logs->save($userlog);
        return redirect()->to('account');
	}

    //--------------------------------------------------------------------

	/**
	 * Log the user out.
	 */
	public function logout()
	{
		$this->session->remove(['isLoggedIn', 'userData']);

        return redirect()->to('login');
	}

}
