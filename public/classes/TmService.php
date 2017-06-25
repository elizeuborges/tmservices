<?php
class TmService
{
	public function __construct($container)
    {
        $this->jogadorDao = $container->jogadorDao;
        $this->logger = $container->logger;
        $this->http_client = $container->http_client;
    }

	public function salvarJogador($jogador)
	{		
		$dao = $this->jogadorDao;
        if($dao->jogadorJaFoiSalvoEssaSemana($jogador)){            
            $dao->deletar($jogador);
        }                                  
        $jogador = $dao->salvar($jogador);
        $retorno = var_export($jogador, true);
	}

	public function replicarJogador($jogador)
	{
		$url = Configuracoes::$slave_server."/jogadores/replica";
		$this->logger->info("Replicando jogador para $url");
		$this->http_client->request("POST", $url, [ 'json' => $jogador ]);
		$this->logger->info("Jogador replicado");
	}

	public function getHabilidadesOcultas($id_tm)
	{		
	    $json = $this->postRequisicaoHabilidadesOcultas($id_tm);
	    $jogador = json_decode($json, true)['debug'];  
	    $jogador['idade'] = $this->criarIdade($jogador['birthmonth'], $jogador['age']);
	    $jogador['id_tm'] = $jogador['id'];
	    return $jogador;
	}

	private function criarIdade($birthmonth, $age)
	{
		$mes_atual = date('m');
		if ($birthmonth == $mes_atual)
		{
			$meses = 1;	
		} else 
		{
			$meses = $mes_atual + 12 - ($birthmonth - 1);	
		}		
		if($meses == 12)
		{
			$meses = 0;
		}
		return "$age Anos $meses Meses";
	}

	private function postRequisicaoHabilidadesOcultas($id_tm)
	{
		$url = "http://trophymanager.com/ajax/transfer_bids.ajax.php"; 
	    $data = array('type' => 'approach', 'player_id' => $id_tm, 'bid' => '999999,9999,000', 'text' => '');
	    $cookie_de_autenticacao = Configuracoes::$cookie_de_autenticacao;
	    $options = 	array(
	        'http' => array(
	            'header'  => "Content-Type: application/x-www-form-urlencoded; charset=UTF-8\r\nCookie: trophymanager[ajax_info]=$cookie_de_autenticacao",
	            'method'  => 'POST',
	            'content' => http_build_query($data)
	        )
	    );
	    $context  = stream_context_create($options);
	    $contents = file_get_contents($url, false, $context);	    
	    return $contents;
	}

}