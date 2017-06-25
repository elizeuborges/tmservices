<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use GuzzleHttp\Client as Client;

require '../vendor/autoload.php';

spl_autoload_register(function ($classname) {
    require ("classes/" . $classname . ".php");
});

$PRODUCAO = false;

$config['displayErrorDetails'] = true;
$config['db']['host']   = Configuracoes::$host;
$config['db']['user']   = Configuracoes::$user;
$config['db']['pass']   = Configuracoes::$password;
$config['db']['dbname'] = Configuracoes::$name;

$app = new \Slim\App(["settings" => $config]);

$container = $app->getContainer();

$container['logger'] = function($c) {
    $logger = new \Monolog\Logger('my_logger');
    $file_handler = new \Monolog\Handler\StreamHandler("../.logs/app.log");
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

$container['http_client'] = function($container) {
    $client = new Client();
    return $client;
};

$container['jogadorDao'] = function($container) {
    $jogadorDao = new JogadorDao($container);
    return $jogadorDao;
};

$container['tmServices'] = function($container) {
    $tmService = new TmService($container);
    return $tmService;
};

$app->get('/jogadores', function (Request $request, Response $response) {
    $jogadores = $this->jogadorDao->getJogadores($request->getQueryParams());
    echo json_encode($jogadores);
});

$app->get('/jogadores/idadessalvas/{id_tm}', function (Request $request, Response $response) {
    $id_tm = $request->getAttribute('id_tm');
    $idadessalvas = $this->jogadorDao->getIdadesSalvas($id_tm);        
    return $response->withJson($idadessalvas);   
});

$app->get('/jogadores/habilidades/{id_tm}', function (Request $request, Response $response) {
    $id_tm = $request->getAttribute('id_tm');
    $jogador = $this->tmServices->getHabilidadesOcultas($id_tm);
	/*
    if(array_key_exists('idade', $request->getQueryParams()))
    {
        $response = $response->withHeader('Cache-Control', 'public, max-age=31536000'); 
    } 
    */
    return $response->withJson($jogador);   
});

$app->post('/jogadores', function (Request $request, Response $response) {
    $data = $request->getBody()->read($request->getContentLength());
    $json = json_decode($data, true);
    $tmServices = $this->tmServices;
    $tmServices->replicarJogador($json);    
    $jogador = new Jogador($json); 
    return $tmServices->salvarJogador($jogador);
});

$app->post('/jogadores/replica', function (Request $request, Response $response) {
    $this->logger->info("Recebido requisição de replica");
    $data = $request->getBody()->read($request->getContentLength());
    $this->logger->info("Recebido replica");
    $json = json_decode($data, true);
    $tmServices = $this->tmServices;  
    $jogador = new Jogador($json); 
    return $tmServices->salvarJogador($jogador);
});


$app->run();    