// ==UserScript==
// @name        TmServices
// @namespace   HabilidadesReais
// @include     *://trophymanager.com/players/*
// @exclude     *://trophymanager.com/players/compare/*
// @version     1
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==
var
    /*
    	CONFIGURAÇÕES DO SCRIPT
    	*/

    urlJogadoresService = "http://tmservices.hol.es/jogadores",
    //urlJogadoresService = "http://localhost:8080/jogadores",
    PRECISAO = 2,
    MENU_OUTRAS_POSICOES = 'SIM',
    MOSTRAR_TREINOS = 'SIM',
    SALVAR_HABILIDADES = 'SIM',
    //SALVAR_HABILIDADES = 'NAO',
    // O menu de melhoria só funciona se o  SALVAR_HABILIDADES estiver habilitado
    MENU_MELHORIA_ULTIMO_TREINO = 'SIM',

    //Ajusta a larguras dos menus
    OTIMIZAR_LARGURA_DOS_MENUS = 'SIM',

    /*
    se estiver SIM na opção acima pode-se configurar manualmente a largura de cada menu
    */
    LARGURA_COLUNA_ESQUERDA = 199,
    LARGURA_COLUNA_CENTRAL = 574,
    LARGURA_COLUNA_DIREITA = 199;

/*
	FIM DAS CONFIGURAÇÕES DO SCRIPT
	*/

var modal_inner = unsafeWindow.modal_inner
var global_content = unsafeWindow.global_content
var get_loading_img = unsafeWindow.get_loading_img
var make_button = unsafeWindow.make_button
var modal = unsafeWindow.modal

var CLUBE_ID = unsafeWindow.SESSION["main_id"]
var TIME_B_ID = unsafeWindow.SESSION["b_team"]

var PESOS_DAS_HABILIDADES = {
    'FC': {
        'SOMA': 6.508097062131509,
        'WEIGHTINGS': [0.493917051093474, 0.370423904816088, 0.532148929996192, 0.0629206658586336, 0.0904950078155216, 0.415494774080483, 0.54106107545574, 0.4681811460958, 0.158106484131194, 0.461125738338018, 0.83399612271067, 0.999828328674183, 0.827171977606305, 0.253225855459207],
        'REC': [13.2762119, 19.5088591]
    }, // FC
    'OMC': {
        'SOMA': 9.357163037706982,
        'WEIGHTINGS': [0.656437768926678, 0.617260722143117, 0.656569986958435, 0.637410545206289, 0.55148452726771, 0.922379789905246, 0.790553566121791, 0.999688557334153, 0.426203575603164, 0.778770912265944, 0.652374065121788, 0.662264393455567, 0.73120100926333, 0.274563618133769],
        'REC': [18.1255351, 27.8974544]
    }, //  OMC    
    'OMLR': {
        'SOMA': 8.20206503838352,
        'WEIGHTINGS': [0.483341947292063, 0.494773052635464, 0.799434804259974, 0.628789194186491, 0.633847969631333, 0.681354437033551, 0.671233869875345, 0.536121458625519, 0.849389745477645, 0.684067723274814, 0.389732973354501, 0.499972692291964, 0.577231818355874, 0.272773352088982],
        'REC': [15.6304867, 24.54323]
    }, //  OMLR
    'MC': {
        'SOMA': 8.901272667912865,
        'WEIGHTINGS': [0.578431939417021, 0.778134685048085, 0.574726322388294, 0.71400292078636, 0.635403391007978, 0.822308254446722, 0.877857040588334, 0.864265671245476, 0.433450219618618, 0.697164252367046, 0.412568516841575, 0.586627586272733, 0.617905053049757, 0.308426814834866],
        'REC': [17.6955092, 26.8420884]
    }, // MC
    'MLR': {
        'SOMA': 8.063046398023332,
        'WEIGHTINGS': [0.497429376361348, 0.545347364699553, 0.788280917110089, 0.578724574327427, 0.663235306043286, 0.772537143243647, 0.638706135095199, 0.538453108494387, 0.887935381275257, 0.572515970409641, 0.290549550901104, 0.476180499897665, 0.526149424898544, 0.287001645266184],
        'REC': [16.6189141, 23.9940623]
    }, //  MLR   
    'DMLR': {
        'SOMA': 7.810869537173832,
        'WEIGHTINGS': [0.582074038075056, 0.420032202680124, 0.7887541874616, 0.726221389774063, 0.722972329840151, 0.737617252827595, 0.62234458453736, 0.466946909655194, 0.814382915598981, 0.561877829393632, 0.367446981999576, 0.360623408340649, 0.390057769678583, 0.249517737311268],
        'REC': [15.5835325, 23.2813871]
    }, //  DMLR
    'DMC': {
        'SOMA': 7.837776179365685,
        'WEIGHTINGS': [0.55838825558912, 0.603683502357502, 0.563792314670998, 0.770425088563048, 0.641965853834719, 0.675495235675077, 0.683863478201804, 0.757342915150728, 0.473070797767482, 0.494107823556837, 0.397547163237438, 0.429660916538242, 0.56364174077388, 0.224791093448809],
        'REC': [15.8932675, 23.1801296]
    }, //  DMC
    'DC': {
        'SOMA': 6.464855417441622,
        'WEIGHTINGS': [0.653962303361921, 0.330014238020285, 0.562994547223387, 0.891800163983125, 0.871069095865164, 0.454514672470839, 0.555697278549252, 0.42777598627972, 0.338218821750765, 0.134348455965202, 0.796916786677566, 0.048831870932616, 0.116363443378865, 0.282347752982916],
        'REC': [14.866375, 18.95664]
    }, //  DC
    'DLR': {
        'SOMA': 7.683003120241933,
        'WEIGHTINGS': [0.565605120229193, 0.430973382039533, 0.917125432457378, 0.815702528287722, 0.99022325015212, 0.547995876625372, 0.522203232914265, 0.309928898819518, 0.837365352274204, 0.483822472259513, 0.656901420858592, 0.137582588344562, 0.163658117596413, 0.303915447383549],
        'REC': [15.980742, 22.895539]
    }, //  DLR
    'GK': {
        'SOMA': 5.832000000000001,
        'WEIGHTINGS': [0.5, 0.333, 0.5, 1, 0.5, 1, 0.5, 0.5, 0.333, 0.333, 0.333]
    }
};
{
    PESOS_DAS_HABILIDADES['OML'] = PESOS_DAS_HABILIDADES['OMLR']
    PESOS_DAS_HABILIDADES['OMR'] = PESOS_DAS_HABILIDADES['OMLR']
    PESOS_DAS_HABILIDADES['DML'] = PESOS_DAS_HABILIDADES['DMLR']
    PESOS_DAS_HABILIDADES['DMR'] = PESOS_DAS_HABILIDADES['DMLR']
    PESOS_DAS_HABILIDADES['DL'] = PESOS_DAS_HABILIDADES['DLR']
    PESOS_DAS_HABILIDADES['DR'] = PESOS_DAS_HABILIDADES['DLR']
    PESOS_DAS_HABILIDADES['ML'] = PESOS_DAS_HABILIDADES['MLR']
    PESOS_DAS_HABILIDADES['MR'] = PESOS_DAS_HABILIDADES['MLR']
}

var positionNames = ["dc", "dl", "dmc", "dml", "mc", "ml", "omc", "oml", "fc"];
var positionFullNames = {
    'gk': "Goleiro",
    'fc': "Atacante",
    'omc': "Meia Ofensivo Central",
    'omr': "Meia Ofensivo Direito",
    'oml': "Meia Ofensivo Esquerdo",
    'mc': "Meio-Campista Central",
    'ml': "Meio-Campista Esquerdo",
    'mr': "Meio-Campista Direito",
    'dml': "Volante Esquerdo",
    'dmr': "Volante Direito",
    'dmc': "Volante Central",
    'dc': "Zagueiro Central",
    'dl': "Zagueiro Direito",
    'dr': "Zagueiro Esquerdo"
}

var especialidade = {
    '1': 'Força',
    '2': 'Resistência',
    '3': 'Velocidade',
    '4': 'Marcação',
    '5': 'Desarme',
    '6': 'Empenho',
    '7': 'Posicionamento',
    '8': 'Passe',
    '9': 'Cruzamento',
    '10': 'Técnica',
    '11': 'Cabeceio',
    '12': 'Finalização',
    '13': 'Chute Longo',
    '14': 'Bola parada',
    '15': 'Habilidade Manual',
    '16': 'Mano-a-mano',
    '17': 'Reflexos',
    '18': 'Habilidade Aérea',
    '19': 'Salto',
    '20': 'Comunicação',
    '21': 'Chute',
    '22': 'Arremesso',
}

var nomesEmIngles = {
    'Força': 'strength',
    'Resistência': 'stamina',
    'Velocidade': 'pace',
    'Marcação': 'marking',
    'Desarme': 'tackling',
    'Empenho': 'workrate',
    'Posicionamento': 'positioning',
    'Passe': 'passing',
    'Cruzamento': 'crossing',
    'Técnica': 'technique',
    'Cabeceio': 'heading',
    'Finalização': 'finishing',
    'Chute Longo': 'longshots',
    'Bola parada': 'setpieces',
    'Habilidade Manual': 'handling',
    'Mano-a-mano': 'oneonones',
    'Reflexos': 'reflexes',
    'Habilidade Aérea': 'arialability',
    'Salto': 'jumping',
    'Comunicação': 'communication',
    'Chute': 'kicking',
    'Arremesso': 'throwing',
    'Probabilidade de Lesão': 'injuryproneness',
    'Profissionalismo': 'professionalism',
    'Agressividade': 'aggression',
    'Adaptabilidade': 'adaptability'
}

var treinoNormal = {
    1: 'Treinos Técnicos',
    2: 'Treinos de Ginástica',
    3: 'Treinos Táticos',
    4: 'Treinos de Finalização',
    5: 'Treinos de Defesa',
    6: 'Treinos de Ala',
    7: 'Treinos de Goleiro'
}

var treinoCustomizado = {
    1: 'Força, Empenho, Resistência',
    2: 'Marcação, Desarme',
    3: 'Cruzamento, Velocidade',
    4: 'Passe, Técnica, Bola parada',
    5: 'Cabeceio, Posicionamento',
    6: 'Finalização, Chute Longo'
}

var TD_ASI
var TD_SALARIO
var TD_IDADE
var LABEL_MAX_VALUE
var TABELA_JOGADOR
var ID_DO_JOGADOR = unsafeWindow.SUBPAGE
var JOGADOR_JSON
var BOX_OPCOES

var indiceOdd = true

printaErro = function(erro) {
    $('#cookies_disabled_message').css("display", "block")
    $('#cookies_disabled_message .notice_box').html("Erro no script. Erro:[" + erro + "]").click(function() {
        alert(erro.stack)
    })
    console.error(erro)
};

criaElementoComClasse = function(element, classe, style, id) {
    var elemento = document.createElement(element)
    elemento.setAttribute("class", classe);
    elemento.setAttribute("style", style);
    if (id != undefined)
        elemento.setAttribute("id", id);
    return elemento;
};

buildMaxPrice = function() {
    var box = document.getElementsByClassName('column3_a')[0].getElementsByClassName('box')[1].getElementsByClassName('box_body')[0];
    var content = box.getElementsByClassName('std align_center transfer_box')[0];
    var span;
    var conteudo = content.firstChild.innerHTML;

    if (conteudo == undefined) {
        span = criaElementoComClasse('span', 'box_sub_header align_center', 'padding:2px;margin:2px;font-weight: bold;display: inline-block;')
        content.insertBefore(span, content.firstChild);
    } else {
        span = content.firstChild
    }
    return span
};

getAndbuildMaxPrice = function() {
    try {
        GM_xmlhttpRequest({
            synchronous: true,
            method: "POST",
            url: "http://trophymanager.com/ajax/transferlist_player.ajax.php",
            data: 'type=get&player_id=' + getIdDoJogador() + '+&bid_id=0',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            onload: function(response) {
                LABEL_MAX_VALUE = buildMaxPrice()
                var resposta = JSON.parse(response.responseText);
                setMaxValue(resposta['max_price_string'])
            }
        });
    } catch (e) {
        printaErro("Erro ao carregar preço máximo de venda:" + e);
    }
    return LABEL_MAX_VALUE
};

getTabelaJogador = function() {
    if (TABELA_JOGADOR == undefined) {
        TABELA_JOGADOR = document.getElementsByClassName('float_left info_table zebra')[0]
    }
    return TABELA_JOGADOR
};

getASI = function() {
    if (TD_ASI == undefined) {
        TD_ASI = getTabelaJogador().getElementsByTagName('tr')[6].getElementsByTagName('td')[0]
    }
    return TD_ASI
};

setASI = function(asi) {
    getASI().innerHTML = asi
};

getSalario = function() {
    if (TD_SALARIO == undefined) {
        TD_SALARIO = getTabelaJogador().getElementsByTagName('tr')[4].getElementsByTagName('td')[0].getElementsByTagName('span')[0]
    }
    return TD_SALARIO
};

setSalario = function(salario) {
    getSalario().innerHTML = salario
};

getIdadeElement = function() {
    if (TD_IDADE == undefined) {
        var linhaIdade = getTabelaJogador().getElementsByTagName('tr')[2];
        TD_IDADE = linhaIdade.getElementsByTagName('td')[0];
    } else {
        if (TD_IDADE.getElementsByTagName('option')[0] != undefined) {
            TD_IDADE = TD_IDADE.getElementsByTagName('option')[0]
        }
    }
    return TD_IDADE
};

getIdade = function(){
    return getIdadeElement().innerHTML
}

getMaxValue = function() {
    if (LABEL_MAX_VALUE == undefined) {
        LABEL_MAX_VALUE = getAndbuildMaxPrice()
    }
    return LABEL_MAX_VALUE
};

setMaxValue = function(maxValue) {
    var maxprice = maxValue == undefined 
    	? 'Preço máximo não salvo' : 
    		maxValue.indexOf('Jogador com menos de 18 anos') < 0 && maxValue.indexOf('Preço máximo não salvo') < 0 
    		? 'Preço máximo: ' + maxValue.replace('Preço máximo:', '') : maxValue
    getMaxValue().innerHTML = maxprice
};

criaMenu = function(content, menuPai, textTitulo, id) {

    var box_head_id,
        box_body_id,
        box_footer_id

    if (id != undefined) {
        box_head_id = "box_head_" + id
        box_body_id = "box_body_" + id
        box_footer_id = "box_footer_" + id
    }

    var box_head = criaElementoComClasse('div', 'box_head', '', box_head_id)
    var titulo = criaElementoComClasse('h2', 'std', '')
    titulo.innerHTML = textTitulo
    box_head.appendChild(titulo)

    var box_body = criaElementoComClasse('div', 'box_body', '', box_body_id)
    box_body.appendChild(criaElementoComClasse('div', 'box_shadow', ''))

    var content_menu = criaElementoComClasse('div', 'content_menu', '')
    content_menu.appendChild(content)

    box_body.appendChild(content_menu)

    var box_footer = criaElementoComClasse('div', 'box_footer', '', box_footer_id)
    box_footer.appendChild(document.createElement('div'))

    menuPai.appendChild(box_head);
    menuPai.appendChild(box_body)
    menuPai.appendChild(box_footer)

    return content_menu
};

criaLinha = function(coluna1, coluna2) {

    var th = criaElementoComClasse('th', '', '')
    th.innerHTML = coluna1

    var td = criaElementoComClasse('td', '', 'width: 30px;')
    td.innerHTML = coluna2

    var tr = criaElementoComClasse('tr', indiceOdd ? 'odd' : '', '')
    indiceOdd = indiceOdd ? false : true;

    tr.appendChild(th)
    tr.appendChild(td)

    return tr;
};

criaTabela = function(id) {
    var tabela = criaElementoComClasse('table', 'info_table zebra', '', id)
    return tabela;
};

ajustaTamanhoDosMenus = function() {
    if (OTIMIZAR_LARGURA_DOS_MENUS.toUpperCase() == 'SIM') {
        document.getElementsByClassName('column1')[0].setAttribute("style", "width: " + LARGURA_COLUNA_ESQUERDA + "px;");
        document.getElementsByClassName('column2_a')[0].setAttribute("style", "width: " + LARGURA_COLUNA_CENTRAL + "px;");
        document.getElementsByClassName('column3_a')[0].setAttribute("style", "width: " + LARGURA_COLUNA_DIREITA + "px;");
    }
};

getIdDoJogador = function() {
	return ID_DO_JOGADOR
};


postRequisicaoDeHabilidades = function(idade, acao) {
    var idDoJogador = getIdDoJogador()
    var sync = true    
    var url = urlJogadoresService + "/habilidades/" + idDoJogador + "?idade="+idade
	console.log("URL de busca das habilidades: "+url)
    GM_xmlhttpRequest({
        synchronous: sync,
        method: "GET",
        url: url,        
        onload: acao
    });
};

ehPosicaoDoJogador = function(posicao, posicoesDoJogador) {
    var retorno = false;
    for (var i = 0; i < posicoesDoJogador.length; i++) {
        if (posicoesDoJogador[i] == posicao) retorno = true;
        if (posicao.indexOf('l') != -1) {
            if (posicao.replace('l', 'r') == posicoesDoJogador[i]) retorno = true;
        } else if (posicao.indexOf('r') != -1) {
            if (posicao.replace('r', 'l') == posicoesDoJogador[i]) retorno = true;
        }
    }
    return retorno;
};

criaTabelaDasOutrasHabilidades = function(asi, skillArray, positionArray, melhorRec) {

    var tabela = criaTabela()
    var recs = []

    for (var i = 0; i < positionNames.length; i++) {
        var posicao = positionNames[i];

        if (ehPosicaoDoJogador(posicao, positionArray)) continue;

        var rec = getRealRec(posicao, asi, skillArray).toFixed(PRECISAO);
        var tr = criaLinha(positionFullNames[posicao], rec);
        recs[i] = [rec, tr]
    }

    recs.sort(function(a, b) {
        return (a[0] - b[0]) * -1
    })

    recs.forEach(function(entry) {
        var tr = entry[1];
        tr.setAttribute("class", recs.indexOf(entry) % 2 == 0 ? "" : "odd")
        if (entry[0] > melhorRec) {
            tr.setAttribute("style", "color:#CF0;");
        }
        tabela.appendChild(tr)
    })

    var boxMenu = document.getElementsByClassName('column1')[0].getElementsByClassName('box')[0];

    criaMenu(tabela, boxMenu, 'Outras Posiçoes')

    criaMenuDosPesosDasHabilidades(positionArray);

};

criaTabelaDosPesosDasHabilidades = function(tabelaDiv, posicao) {
    var posicao = posicao
    var tabela = criaTabelaParaPosicao(posicao)
    tabelaDiv.innerHTML = '';
    tabelaDiv.appendChild(tabela)
};

posicaoRepetidaOuGoleiro = function(posicao) {
    var posicoes = new Array('GK', 'DL', 'DR', 'DML', 'DMR', 'ML', 'MR', 'OML', 'OMR')
    return posicao == 'GK'
};

criaMenuDosPesosDasHabilidades = function(posicoes) {

    try {

        var boxMenu = document.getElementsByClassName('column3_a')[0].getElementsByClassName('box')[1];
        var divPai = criaElementoComClasse('div', '', '')

        criaMenu(divPai, boxMenu, 'Pesos das Habilidades')

        var tabsOuter = criaElementoComClasse('div', 'tabs_outer', 'padding-bottom:0px;')
        divPai.appendChild(tabsOuter)

        var tabelaDiv = criaElementoComClasse('div', '', 'padding-bottom:0px;')
        divPai.appendChild(tabelaDiv)

        var select = criaSelect(function(event) {
            criaTabelaDosPesosDasHabilidades(tabelaDiv, event.currentTarget.value)
        })

        select.setAttribute('style', 'color: rgb(255, 255, 255); width: inherit;');

        var i = 0
        for (var posicao in PESOS_DAS_HABILIDADES) {
            if (posicaoRepetidaOuGoleiro(posicao)) {
                continue;
            }
            var option = document.createElement('option');
            option.setAttribute('value', posicao);
            option.innerHTML = posicao
            select.appendChild(option);
        }

        tabsOuter.appendChild(select)

        criaTabelaDosPesosDasHabilidades(tabelaDiv, posicoes[0].toUpperCase())
        select.value = posicoes[0].toUpperCase()
    } catch (e) {
        console.log(e)
    }
};

criaTabelaParaPosicao = function(posicao) {

    var weightings = PESOS_DAS_HABILIDADES[posicao.toUpperCase()]['WEIGHTINGS'];
    var tabela = criaTabela()
    var habilidadePeso = []

    for (var j = 0; j < weightings.length; j++) {
        var tr = criaLinha(especialidade[(1 + j).toString()], parseFloat(weightings[j]).toFixed(4));
        habilidadePeso[j] = [weightings[j], tr]
    }

    habilidadePeso.sort(function(a, b) {
        return (a[0] - b[0]) * -1
    })

    habilidadePeso.forEach(function(entry) {
        var tr = entry[1];
        tr.setAttribute("class", habilidadePeso.indexOf(entry) % 2 == 0 ? "" : "odd")
        tabela.appendChild(tr)
    })

    return tabela;
};

isHabilidadeEspecial = function(habilidade) {
    return habilidade == 'adaptability' ||
        habilidade == 'aggression' ||
        habilidade == 'professionalism' ||
        habilidade == 'injuryproneness'
};

makeMenuEvolucaoHabilidades = function(jogadorUltimoTreino) {

    $('.column1 .box #box_head_melhorias').remove()
    $('.column1 .box #box_body_melhorias').remove()
    $('.column1 .box #box_footer_melhorias').remove()

    var tabela = criaTabela("melhorias")
    var jogador = getJogador()
    var total = 0
    
    if(jogador['idade'] == jogadorUltimoTreino['idade']){
    	return
    }

    for (entry in nomesEmIngles) {
        var habilidade = jogador[nomesEmIngles[entry]]
        if (habilidade == undefined || habilidade == 0 || isHabilidadeEspecial(nomesEmIngles[entry])) {
            continue;
        }
        var melhoria = jogador[nomesEmIngles[entry]] - jogadorUltimoTreino[nomesEmIngles[entry]]
        total += melhoria
        var tr = criaLinha(entry, parseFloat(melhoria).toFixed(2))
        tabela.appendChild(tr)
    }

    var tr = criaLinha('Total', parseFloat(total).toFixed(2))
    tabela.appendChild(tr)

    var boxMenu = document.getElementsByClassName('column1')[0].getElementsByClassName('box')[0];
    console.log(jogador['idade'])
    console.log(jogadorUltimoTreino['idade'])
    var diferencaDeIdade = getDiferencaDeTreinos(jogador['idade'], jogadorUltimoTreino['idade'])
    var titulo = diferencaDeIdade == 1 ? 'Melhorias no último treino' : 'Melhorias nos últimos ' + diferencaDeIdade + ' treinos'
    criaMenu(tabela, boxMenu, titulo, "melhorias")

};

ajustaTamanhoDoNomeDoClube = function(tabela) {
    if (!OTIMIZAR_LARGURA_DOS_MENUS) {
        var linkDoNome = tabela.getElementsByTagName('a')[0];
        var nome = linkDoNome.innerHTML;
        if (nome.length > 16) {
            nome = nome.substring(0, 16)
        }
        linkDoNome.innerHTML = nome
    }
};

calculaEadicionaRecReal = function(jogadorJson) {

    var table = document.getElementsByClassName("column2_a")[0].getElementsByClassName("float_left info_table zebra")[0].getElementsByTagName('tbody')[0]
    table.getElementsByTagName('tr')[0].getElementsByTagName('td')[0].setAttribute('rowspan', 11)

    ajustaTamanhoDoNomeDoClube(table)

    var positionArray = jogadorJson['favposition'].split(',');
    var skillArray = buildSkillArray(jogadorJson);

    var tdAsi = getASI()

    var asi = parseFloat(tdAsi.innerHTML.indexOf(',') > -1 ? tdAsi.innerHTML.replace(",", "") : tdAsi.innerHTML.replace(".", ""));
    console.log("ASI: " + asi)
    console.log("Posições: " + positionArray)
    var melhorRec = 0;
    for (var i = 0; i < positionArray.length; i++) {
        var rec = getRealRec(positionArray[i], asi, skillArray);
        table.appendChild(criaLinha(positionFullNames[positionArray[i]], rec.toFixed(PRECISAO)))
        melhorRec = rec > melhorRec ? rec : melhorRec;
    }

    if (positionArray[0] == 'gk') return;

    criaTabelaDasOutrasHabilidades(asi, skillArray, positionArray, melhorRec)
};

getRealRec = function(posicaoLowerCase, asi, skillArray) {

    var posicao = posicaoLowerCase.toUpperCase()

    var weightings = PESOS_DAS_HABILIDADES[posicao]['WEIGHTINGS'];
    var REC = PESOS_DAS_HABILIDADES[posicao]['REC'];
    var somaWeightings = PESOS_DAS_HABILIDADES[posicao]['SOMA'];
    var potenciaAsi = 0;
    var skillSun = 0;
    var remainder = 0;
    var score = 0;
    var somaF = 0;
    var numeroDeHabilidades = skillArray.length;

    var somaDasHabilidades = 0;
    for (var j = 0; j < numeroDeHabilidades; j++) {
        var habilidade = parseFloat(skillArray[j]);
        somaF += (habilidade * weightings[j]);
        somaDasHabilidades += habilidade;
    }

    var recReal;
    if (posicao == "GK") {
        skillSun = Math.pow(asi, 0.143) / 0.02979;
        remainder = skillSun - somaDasHabilidades;
        score = somaF + (remainder * somaWeightings / numeroDeHabilidades);
        recReal = (score * 1.27 - 15) / 22.3;
    } else {
        skillSun = Math.pow(asi, 1 / 6.99194) / 0.02336483;
        remainder = skillSun - somaDasHabilidades;
        score = somaF + (remainder * somaWeightings / numeroDeHabilidades);
        recReal = (score - REC[0]) / REC[1];
    }

    return recReal;
};

buildSkillArray = function(jogador) {
    var skillArray = [];

    skillArray[0] = jogador['strength'];
    skillArray[1] = jogador['stamina'];
    skillArray[2] = jogador['pace'];

    if (jogador['handling'] == "0.0" || jogador['oneonones'] == "0.0" || jogador['arialability'] == "0.0") {
        skillArray[3] = jogador['marking'];
        skillArray[4] = jogador['tackling'];
        skillArray[5] = jogador['workrate'];
        skillArray[6] = jogador['positioning'];
        skillArray[7] = jogador['passing'];
        skillArray[8] = jogador['crossing'];
        skillArray[9] = jogador['technique'];
        skillArray[10] = jogador['heading'];
        skillArray[11] = jogador['finishing'];
        skillArray[12] = jogador['longshots'];
        skillArray[13] = jogador['setpieces'];
    } else {
        skillArray[3] = jogador['handling'];
        skillArray[4] = jogador['oneonones'];
        skillArray[5] = jogador['reflexes'];
        skillArray[6] = jogador['arialability'];
        skillArray[7] = jogador['jumping'];
        skillArray[8] = jogador['communication'];
        skillArray[9] = jogador['kicking'];
        skillArray[10] = jogador['throwing'];
    }
    return skillArray;
};

getBoxOpcoes = function() {
    if (BOX_OPCOES == undefined) {
        BOX_OPCOES = $('.column3_a').find('.box_body').find('.std');
    }
    return BOX_OPCOES
};

salvarHabilidades = function(jogador, fonload){
	jogador['name'] = $('title').text().substring(0, $('title').text().indexOf(' -'))
    jogador['idade'] = getIdade()
    jogador['salario'] = getSalario().innerHTML.replace(',', '').replace(',', '.')
    jogador['asi'] = getASI().innerHTML
    jogador['club_id'] = jogador['klub'] != undefined ? jogador['klub'] : jogador['club_id']
    jogador['player_id'] = jogador['id'] != undefined ? jogador['id'] : jogador['player_id']
    jogador['country'] = jogador['nationalitet'] != undefined ? jogador['nationalitet'] : jogador['player_country']

    if (jogador['asi'].indexOf('.') < 0) {
        jogador['asi'] = jogador['asi'] / 1000
    }
    jogador['max_price'] = getMaxValue().innerHTML == undefined ? null : getMaxValue().innerHTML.replace('Preço máximo:', '')

    if (jogador['id_tm'] == undefined) {
        jogador['id_tm'] = jogador['id']
        jogador['id'] = null
    }

    console.log(JSON.stringify(jogador))

    GM_xmlhttpRequest({
        method: "POST",
        url: urlJogadoresService,
        data: JSON.stringify(jogador),
        headers: {
            'Content-Type': 'application/json',
        },
        onload: fonload                   
    })
}

meuJogador = function(){
	var meuJogador = false
	var clubeDoJogador = $('td a').prop('href').replace('http://trophymanager.com/club/', '').replace('/', '');
	if ((clubeDoJogador == CLUBE_ID || clubeDoJogador == TIME_B_ID)) {
        meuJogador = true;
    }
    return meuJogador
}

buildBotaoDeSalvarHabilidades = function(jaFoiSalvoEstaSemana) {
    var boxbody = getBoxOpcoes()[1]

    var button = criaElementoComClasse('span', 'button', 'width:170px')
    var borderButton = criaElementoComClasse('span', 'button_border', "width:168px; padding: 0;")

    borderButton.innerHTML = 'Salvar habilidades'
    button.appendChild(borderButton);

    if (document.getElementsByClassName('dark rounded align_left').length > 0) {
        boxbody.insertBefore(button, boxbody.firstChild);
        var note = document.getElementsByClassName('dark rounded align_left')[0]
        boxbody.removeChild(note)
        boxbody.insertBefore(note, boxbody.firstChild);
    } else {
        boxbody.insertBefore(button, boxbody.firstChild);
    }

    var icon = criaElementoComClasse('img', '', "position:relative;top:3px;width:17px; padding-right:4px;")
    
    if (jaFoiSalvoEstaSemana) {
        icon.setAttribute('src', 'http://static.trophymanager.com/pics/mini_green_check.png')
        borderButton.setAttribute('title', 'Este jogador já foi salvo esta semana')
    } else {
    	icon.setAttribute('src', 'http://trophymanager.com/pics/small_red_x.png')
        borderButton.setAttribute('title', 'Este jogador ainda não salvo esta semana')
    }
    icon.setAttribute('style', 'position:relative;top:1px;width:10px; padding-right:4px;')        
    borderButton.insertBefore(icon, borderButton.firstChild)

    button.addEventListener('click', function() {
        icon.setAttribute('style', 'position:relative;top:3px;width:17px; padding-right:4px;')
        icon.setAttribute('src', 'http://static.trophymanager.com/pics/big_loading.gif')

        if (!borderButton.contains(icon)) {
            borderButton.insertBefore(icon, borderButton.firstChild)
        }

        postRequisicaoDeHabilidades(getIdade(), function(response) {
            try {

                var jogador = JSON.parse(response.responseText)
                salvarHabilidades(jogador, function(response) {
	            	icon.setAttribute('src', 'http://static.trophymanager.com/pics/mini_green_check.png')
	            	icon.setAttribute('style', 'position:relative;top:1px;width:10px; padding-right:4px;')
        	        borderButton.setAttribute('title', 'Jogador salvo com sucesso')
		        }
		        );                
            } catch (e) {
                printaErro("Erro ao salvar jogador:" + e.message);
                button.setAttribute('class', 'button');
                icon.setAttribute('src', 'http://trophymanager.com/pics/small_red_x.png')
            }

        });

    })

    if (!jaFoiSalvoEstaSemana && meuJogador()) {
        button.click();
    }

};

buildRecStar = function(td, habilidade) {
    var img = td.getElementsByTagName("img")[0];
    if (img == undefined) {
        img = document.createElement('img');
    }
    img.setAttribute("src", habilidade == 20 ? "/pics/star.png" : "/pics/star_silver.png");
    img.setAttribute("alt", habilidade);
    img.setAttribute("title", habilidade);
    td.innerHTML = "";
    td.appendChild(img);
};

appendHabilidade = function(td, habilidade) {
    var paddingTd = 0

    if (habilidade == 20) {
        buildRecStar(td, habilidade)
    } else if (habilidade >= 19) {
        buildRecStar(td, habilidade)
        var sup = criaElementoComClasse('sup', '', 'font-size:8.5px;')
        var decimais = "0" + habilidade.toString().substring(habilidade.toString().indexOf('.'));

        sup.innerHTML = "+" + decimais;
        td.appendChild(sup);
        paddingTd = 0
    } else {
        td.innerHTML = habilidade;
    }
    td.setAttribute("style", "padding-left: " + paddingTd + "px; width:75px; ");
};

getSinal = function(valor) {
    return valor > 0.9999 ? "+" : ""
};

getNumeroDeTreinos = function(idade) {
    var anos = parseInt(idade.substring(0, idade.indexOf('A') - 1))
    var meses = parseInt(idade.substring(idade.indexOf('s') + 2, idade.indexOf('M') - 1))
    return anos * 12 + meses
};

getDiferencaDeTreinos = function(idade1, idade2) {
    return getNumeroDeTreinos(idade1) - getNumeroDeTreinos(idade2)
};

buildCelulaDeComparacaoDeIdades = function(jogadorJson, outroJogador, td, nomeHabilidadeEmIngles) {
    td.innerHTML = '/'

    var diferenca = jogadorJson[nomeHabilidadeEmIngles] - outroJogador[nomeHabilidadeEmIngles]
    var small = (OTIMIZAR_LARGURA_DOS_MENUS.toUpperCase() == 'SIM') ? '' : 'small'
    var habilidade1 = criaElementoComClasse('span', small, '')
    appendHabilidade(habilidade1, outroJogador[nomeHabilidadeEmIngles])
    td.appendChild(habilidade1)
    td.insertBefore(habilidade1, td.firstChild)

    var habilidade2 = criaElementoComClasse('span', small, '')
    appendHabilidade(habilidade2, jogadorJson[nomeHabilidadeEmIngles])
    td.appendChild(habilidade2)

    if (jogadorJson['idade'] == undefined) {
        jogadorJson['idade'] = getIdade()
    }
    var numeroDeTreinos = "?"

    if (jogadorJson['idade'] != undefined && outroJogador['idade'] != undefined) {
        numeroDeTreinos = getDiferencaDeTreinos(jogadorJson['idade'], outroJogador['idade'])
    }
    td.setAttribute('title', getSinal(diferenca) + diferenca.toFixed(1) + ' em ' + numeroDeTreinos + ' treinos')
};

convertAsi = function(asi) {
    var fAsi = parseFloat(asi)
    if (fAsi < 0.9999) {
        return fAsi.toFixed(3) * 1000
    } else {
        return fAsi.toFixed(3)
    }
};

buildComparacaoDeAsi = function(jogadorJson, outroJogador) {
    var asiCell = getASI()
    var asiJogador1 = jogadorJson['asi']
    var asiJogador2 = outroJogador['asi']

    var asi1 = criaElementoComClasse('span', '', '')
    asi1.innerHTML = convertAsi(asiJogador2)

    var asi2 = criaElementoComClasse('span', '', '')
    asi2.innerHTML = convertAsi(asiJogador1)

    asiCell.innerHTML = '/'

    asiCell.insertBefore(asi1, asiCell.firstChild)
    asiCell.appendChild(asi2)

    var diferencaAsi = (asiJogador1 - asiJogador2)

    var sup = criaElementoComClasse('sup', '', 'font-size:8.5px;')
    var sinal = convertAsi(diferencaAsi) > 0 ? "+" : ""
    sup.innerHTML = ' (' + sinal + convertAsi(diferencaAsi) + ')';
    asiCell.appendChild(sup);
};

buildHabilidadesEmDecimais = function(jogadorJson, outroJogador) {
    var tabela = document.getElementsByClassName('column2_a')[0].getElementsByClassName('skill_table zebra')[0].getElementsByTagName('tbody')[0]
    var tds = tabela.getElementsByClassName('align_center')
    var ths = tabela.getElementsByTagName('th')

    var j = 0
    var naoEhComparacao = jogadorJson == outroJogador || outroJogador == null

    for (var i = 0; i < tds.length; i++) {
        var habilidadeEmPortugues = ths[j].innerHTML
        if (habilidadeEmPortugues == undefined || habilidadeEmPortugues == '') {
            j++;
            habilidadeEmPortugues = ths[j].innerHTML
        }
        var nomeHabilidadeEmIngles = nomesEmIngles[habilidadeEmPortugues]
        if (naoEhComparacao) {
            appendHabilidade(tds[i], jogadorJson[nomeHabilidadeEmIngles])
            tds[i].setAttribute('title', '')
        } else {
            buildCelulaDeComparacaoDeIdades(jogadorJson, outroJogador, tds[i], nomeHabilidadeEmIngles)
        }
        j++;
    }

    if (!naoEhComparacao) {
        buildComparacaoDeAsi(jogadorJson, outroJogador)
        makeComparacaoDePrecoMaximo(jogadorJson, outroJogador)
    } else {
        setASI(convertAsi(jogadorJson['asi']))
        setMaxValue(jogadorJson['max_price'])
    }

};

makeComparacaoDePrecoMaximo = function(jogadorJson, outroJogador) {
    setMaxValue(outroJogador['max_price'])
};

appendOption = function(select, idade) {
    var option = document.createElement('option');
    option.setAttribute('value', idade);
    option.innerHTML = idade;
    select.appendChild(option);
};

criaSelect = function(onChange) {
    var select = criaElementoComClasse('select', 'ui-selectmenu ui-widget ui-state-default ui-selectmenu-dropdown ui-state-active ui-corner-top', 'color:#FFF;');
    select.addEventListener('change', onChange, false);
    return select;
};

carregaHabilidadesSalvas = function() {
 
    try {
        var idDoJogador = getIdDoJogador()

        GM_xmlhttpRequest({
            method: "GET",
            url: urlJogadoresService + "/idadessalvas/" + idDoJogador,
            headers: {
                "Accept": "application/json"
            },
            onload: function(response) {
                try {
                    var idadessalvas = JSON.parse(response.responseText)

                    console.log("Idades carregadas: "+ JSON.stringify(idadessalvas))

                    if (idadessalvas.length == 0) {
                        buildBotaoDeSalvarHabilidades(false)
                        return;
                    }

                    var tdIdade = getIdadeElement()
                    var idadeAtual = tdIdade.innerHTML;

                    var select = criaSelect(function() {
                    	var idadeSelecionada = select.value
                    	console.log("Selecionado idade: "+idadeSelecionada)
						var jogadorAtual = getJogador();
						console.log("Idade atual: "+jogadorAtual['idade'])
						
						if(jogadorAtual['idade'] == idadeSelecionada){
							buildHabilidadesEmDecimais(jogadorAtual);
							makeMenuEvolucaoHabilidades(jogadorAtual);
						} else {
							postRequisicaoDeHabilidades(idadeSelecionada, function(response) {
					            try {
					                var jogadorNaIdadeSelecionada = JSON.parse(response.responseText);
					                console.log(jogadorNaIdadeSelecionada)
					                console.log("\nJogador atual:\n" + jogadorAtual)				                
					                buildHabilidadesEmDecimais(jogadorAtual, jogadorNaIdadeSelecionada);
	                            	makeMenuEvolucaoHabilidades(jogadorNaIdadeSelecionada)
					            } catch (e) {
					                printaErro(e)
					            }
					        })
						}                   	
                    })

                    tdIdade.removeChild(tdIdade.firstChild)
                    tdIdade.appendChild(select);

                    var jaFoiSalvo = idadessalvas.indexOf(idadeAtual) > -1 
                    if(!jaFoiSalvo){
                    	idadessalvas.unshift(idadeAtual)	
                    }

                    idadessalvas.forEach(function(idade, index, array){
                        appendOption(select, idade)
                    })

                    buildBotaoDeSalvarHabilidades(jaFoiSalvo)

                } catch (e) {
                    printaErro(e);
                }

            }
        });
    } catch (e) {
        printaErro("Erro ao carregar jogador:" + e);
    }
};

getJogador = function() {    
    return JOGADOR_JSON
};

buildHabilidadesOcultas = function(jogador) {

    var tabelaSkill = document.getElementById("hidden_skill_table");

    tabelaSkill.getElementsByTagName("td")[0].innerHTML = jogador['injuryproneness'];
    tabelaSkill.getElementsByTagName("td")[1].innerHTML = jogador['aggression'];
    tabelaSkill.getElementsByTagName("td")[2].innerHTML = jogador['professionalism'];
    tabelaSkill.getElementsByTagName("td")[3].innerHTML = jogador['adaptability'];

    var tr = document.createElement("tr");

    var th = criaElementoComClasse('th', 'th_first subtle', '')
    th.innerHTML = "Liderança";
    tr.appendChild(th);
    var td = criaElementoComClasse('td', 'align_center', '')
    td.innerHTML = jogador['charisma'];
    tr.appendChild(td);

    var th = criaElementoComClasse('th', 'th_first subtle', '')
    th.innerHTML = "Pontos de penalização";
    tr.appendChild(th);
    var td = criaElementoComClasse('td', 'align_center', '')
    td.innerHTML = jogador['strafpoint'];
    tr.appendChild(td);

    tr.setAttribute("class", "");
    tabelaSkill.appendChild(tr);

    var tr = document.createElement("tr");

    var th = criaElementoComClasse('th', 'th_first subtle', '')
    th.innerHTML = "Bost";
    tr.appendChild(th);
    var td = criaElementoComClasse('td', 'align_center', '')
    td.innerHTML = jogador['boost'];
    tr.appendChild(td);

    var th = criaElementoComClasse('th', 'th_first subtle', '')
    th.innerHTML = "Boost Age";
    tr.appendChild(th);
    var td = criaElementoComClasse('td', 'align_center', '')
    td.innerHTML = jogador['boost_age'];
    tr.appendChild(td);

    tr.setAttribute("class", "odd");
    tabelaSkill.appendChild(tr);

    var tr = document.createElement("tr");

    var th = criaElementoComClasse('th', 'th_first subtle', '')
    th.innerHTML = "Pico Físico";
    tr.appendChild(th);
    var td = criaElementoComClasse('td', 'align_center', '')
    td.innerHTML = jogador['peak_phy'];
    tr.appendChild(td);

    var th = criaElementoComClasse('th', 'th_first subtle', '')
    th.innerHTML = "Pico Técnico";
    tr.appendChild(th);
    var td = criaElementoComClasse('td', 'align_center', '')
    td.innerHTML = jogador['peak_tec'];
    tr.appendChild(td);

    tr.setAttribute("class", "");

    tabelaSkill.appendChild(tr);

    var tr = document.createElement("tr");

    var th = criaElementoComClasse('th', 'th_first subtle', '')
    th.innerHTML = "Pico Tático";
    tr.appendChild(th);
    var td = criaElementoComClasse('td', 'align_center', '')
    td.innerHTML = jogador['peak_tac'];
    tr.appendChild(td);

    var th = criaElementoComClasse('th', 'th_first subtle', '')
    th.innerHTML = "Talento";
    tr.appendChild(th);
    var td = criaElementoComClasse('td', 'align_center', '')
    td.innerHTML = jogador['talent'];
    tr.appendChild(td);

    tr.setAttribute("class", "odd");
    tabelaSkill.appendChild(tr);

    var tr2 = criaElementoComClasse('tr', 'odd', '')
    var th = criaElementoComClasse('th', 'th_first subtle', '')
    th.innerHTML = "Posição que está escalado";
    tr2.appendChild(th);
    var td = criaElementoComClasse('td', 'align_center', '')
    td.innerHTML = jogador['availability'];
    tr2.appendChild(td);

    var th = criaElementoComClasse('th', 'th_first subtle', '')
    th.innerHTML = "Especialidade";
    tr2.appendChild(th);
    var td = criaElementoComClasse('td', 'align_center', '')
    td.innerHTML = especialidade[$('.gk').length >= 1 ? parseInt(jogador['specialist']) + 11 : jogador['specialist']];
    tr2.appendChild(td);
    tr2.setAttribute("class", "");
    tabelaSkill.appendChild(tr2);

    if (jogador['training_custom'] == undefined) {
        var tr = document.createElement("tr");

        var th = criaElementoComClasse('th', 'th_first subtle', '')
        th.innerHTML = "Treinamento";
        th.setAttribute("colspan", "2");
        tr.appendChild(th);

        var th = criaElementoComClasse('td', 'odd', '')
        th.innerHTML = treinoNormal[jogador['training']]
        th.setAttribute("colspan", "2");
        tr.appendChild(th);

        tr.setAttribute("class", "odd");
        tabelaSkill.appendChild(tr);
    } else {
        var tr = document.createElement("tr");

        var th = criaElementoComClasse('td', 'align_center', '')
        th.setAttribute("colspan", "4");
        th.innerHTML = "Treinamento customizado"
        tr.appendChild(th);
        tr.setAttribute("class", "odd");
        tabelaSkill.appendChild(tr);

        var total = 0;
        var points = [10, 7, 6, 2];

        var treinos = jogador['training_custom']
        for (var i = 1; i <= treinos.length; i++) {
            var treino = parseInt(treinos.charAt(i - 1))
            for (var j = 0; j < treino; j++) {
                total += points[j];
            }

            var tr = document.createElement("tr");
            var th = criaElementoComClasse('th', 'th_first subtle', '')
            th.innerHTML = treinoCustomizado[i]
            th.setAttribute("colspan", "3");
            tr.appendChild(th);
            var td = criaElementoComClasse('td', 'align_center', '')
            td.innerHTML = treinos.charAt(i - 1)
            tr.appendChild(td);

            tr.setAttribute("class", i % 2 == 0 ? "odd" : "");
            tabelaSkill.appendChild(tr);
        }

        var tr = document.createElement("tr");
        var th = criaElementoComClasse('th', 'th_first subtle', '')
        th.innerHTML = 'Total'
        th.setAttribute("colspan", "3");
        tr.appendChild(th);

        var td = criaElementoComClasse('td', 'align_center', '')
        td.innerHTML = '' + total + '/102'
        tr.appendChild(td);

        tr.setAttribute("class", "");
        tabelaSkill.appendChild(tr);
    }

};

removeCoisasInuteis = function() {
    document.getElementsByClassName('box_body')[0].setAttribute("style", "padding-right:8px;");

    var hidenSkils = document.getElementsByClassName('hidden_skills_text align_center')[0]
    if (hidenSkils != undefined)
        hidenSkils.style.display = 'none';
};

tunarPaginaDosJogadores = function() {

    LABEL_MAX_VALUE = getAndbuildMaxPrice()

    ajustaTamanhoDosMenus()
    
    postRequisicaoDeHabilidades(getIdade(), function(response) {
        try {
            console.log(response.responseText)
            JOGADOR_JSON = JSON.parse(response.responseText);
            JOGADOR_JSON['asi'] = parseFloat(getASI().innerHTML.replace(',', '')) / 1000
            JOGADOR_JSON['max_price'] = LABEL_MAX_VALUE.innerHTML
            buildHabilidadesEmDecimais(JOGADOR_JSON)
            calculaEadicionaRecReal(JOGADOR_JSON)
            buildHabilidadesOcultas(JOGADOR_JSON)
            carregaHabilidadesSalvas()           
        } catch (e) {
            printaErro(e)
        }
    })

    removeCoisasInuteis()

};

function executarScript() {
    try {
        this.$ = this.jQuery = jQuery.noConflict(true);

        if (location.href.indexOf('players') > -1) {
            tunarPaginaDosJogadores();
        }
    } catch (e) {
        printaErro(e)
    }
    return 0;
};

(function() {
    executarScript();
})();