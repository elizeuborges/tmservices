<?php
class TmService
{

	public static $cookie_de_autenticacao = '';

	public function gerarDiasPro($club_id, $qtd_dias){
		$url = "http://be.sponsorpay.com/web.json?appid=2735&uid=$club_id"; 	    
	    $context  = stream_context_create(array('http' => array('method'  => 'GET')));
	    $json = file_get_contents($url, false, $context);
	    echo $json;
	    $ofertas = json_decode($json, true)['offers'];
	    echo $ofertas; 
	}

	public function getHabilidadesOcultas($id_tm){
		
	    $json = $this->postRequisicaoHabilidadesOcultas($id_tm);

	    if ($json == '') { 
	    	$this->atualizarCookieDeAutenticacao();
	    	$json = $this->postRequisicaoHabilidadesOcultas($id_tm);
	    }

	    $jogador = json_decode($json, true)['debug'];
	    
	    $jogador['idade'] = $this->criarIdade($jogador['birthmonth'], $jogador['age']);

	    return $jogador;
	}

	private function criarIdade($birthmonth, $age){
		$mes_atual = date('m');
		if ($birthmonth == $mes_atual){
			$meses = 1;	
		} else {
			$meses = $mes_atual + 12 - ($birthmonth - 1);	
		}		
		if($meses == 12){
			$meses = 0;
		}
		return "$age Anos $meses Meses";
	}

	private function postRequisicaoHabilidadesOcultas($id_tm){
		$url = "http://trophymanager.com/ajax/transfer_bids.ajax.php"; 
	    $data = array('type' => 'approach', 'player_id' => $id_tm, 'bid' => '999999,9999,000', 'text' => '');

	    $cookie_de_autenticacao = self::$cookie_de_autenticacao;

	    $options = 	array(
	        'http' => array(
	            'header'  => "Content-Type: application/x-www-form-urlencoded; charset=UTF-8\r\nCookie: $cookie_de_autenticacao",
	            'method'  => 'POST',
	            'content' => http_build_query($data)
	        )
	    );

	    $context  = stream_context_create($options);
	    $contents = file_get_contents($url, false, $context);
	    
	    return $contents;
	}

	private function atualizarCookieDeAutenticacao(){
		self::$cookie_de_autenticacao = 'trophymanager[ajax_info]=NEW_ACCOUNT%3Bb764ab07015f0f4603d532a28db916cd';
	}

}