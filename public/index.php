<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require 'vendor/autoload.php';

spl_autoload_register(function ($classname) {
    require ("classes/" . $classname . ".php");
});

$PRODUCAO = false;

$config['displayErrorDetails'] = true;
$config['db']['host']   = "localhost";
$config['db']['user']   = "u407297195_user";
$config['db']['pass']   = "heF4amtG0VuH";
$config['db']['dbname'] = "u407297195_tm";

$app = new \Slim\App(["settings" => $config]);

$container = $app->getContainer();

$container['Logger'] = function($c) {
    $logger = new \Monolog\Logger('my_logger');
    $file_handler = new \Monolog\Handler\StreamHandler("logs/app.log");
    $logger->pushHandler($file_handler);
    return $logger;
};

// Add dependencies
$container['db'] = function ($container) {
    $settings = $container['settings']['db'];
    $pdo = new PDO("mysql:host=" . $settings['host'] . ";dbname=" . $settings['dbname'], $settings['user'], $settings['pass']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
};

$app->get('/jogadores', function (Request $request, Response $response) {
    $dao = new JogadorDao($this->db);
    $jogadores = $dao->getJogadores($request->getQueryParams());
    echo json_encode($jogadores);
});

$app->get('/jogadores/idadessalvas/{id_tm}', function (Request $request, Response $response) {
    $id_tm = $request->getAttribute('id_tm');
    $dao = new JogadorDao($this->db);        
    $idadessalvas = $dao->getIdadesSalvas($id_tm);        
    return $response->withJson($idadessalvas);   
});

$app->get('/jogadores/habilidades/{id_tm}', function (Request $request, Response $response) {
    $tmservices = new TmService();
    $id_tm = $request->getAttribute('id_tm');
    $jogador = $tmservices->getHabilidadesOcultas($id_tm);
	if(array_key_exists('idade', $request->getQueryParams())){
        $idade = $request->getQueryParams()['idade'];                
		$response = $response->withHeader('Cache-Control', 'public, max-age=31536000'); 
    } 
    return $response->withJson($jogador);   
});

$app->post('/jogadores', function (Request $request, Response $response) {
    try {
        $data = $request->getBody()->read($request->getContentLength());
        $json = json_decode($data, true);
        $jogador = new Jogador($json);
        $dao = new JogadorDao($this->db);
        if($dao->jogadorNaoFoiSalvoEssaSemana($jogador)){
            $jogador = $dao->salvar($jogador);
        }
        $retorno = var_export($jogador, true);
    } catch (Exception $exc){
        $this->Logger->addInfo($exc);
        $retorno = $response->withStatus(400)
                            ->withJson(["error" => $exc->getMessage()]);
    }
    return $retorno;
});

$app->run();    