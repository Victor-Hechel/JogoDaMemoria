var pares = [];
var posicionados = [];
var tabuleiro = [];
var gameConfig = JSON.parse(localStorage.getItem("gameConfig"));
var selecionadas = [];
var estado;
var viradas = 0;


var mediasCarregadas = 0;

var intervalo;

$(function(){

	$(document).on('click', '#posGame1', function(){
		comecaJogo();
	});

	$(document).on('click', '#posGame2', function(){
		carregaParesJogo(gameConfig.categoria, gameConfig.tipo_pares).then(function(data){
			var chaves = Object.keys(data);
            var pares = [];

            for (var i = 0; i < chaves.length; i++) {
            	pares[i] = data[chaves[i]];
            }

            localStorage.setItem("pares", JSON.stringify(pares));
            comecaJogo();
		});
	});
	
    $(document).on("click", ".card-content .col", function(){
    	if (selecionadas.length == 2) {
    		limpa(estado);
    	}
        joga($(this.firstChild)[0]);
    });

    $(document).on("click", ".btnInfo", function(){
    	carregaModal($(this).attr("data-id"));
    	$("#info").openModal();
    });



	function limpaTabuleiro(){
		$('h4').text("Jogo da Memória");
		$('.card-action').remove();
		$('.card-content').html("");
	}

	function embaralhaPares(){
		var pares_temp = JSON.parse(localStorage.getItem("pares"));


	    for (let i = 0; i < gameConfig.tamanho;i++) {
	        let indice = Math.floor(Math.random()*pares_temp.length);
	        pares[i] = pares_temp[indice];
	        pares_temp.splice(indice, 1);

	    }
	}

	function addLoader(){
		const spinner = "<div class='center-align'><div class='preloader-wrapper small active'>" +
						"<div class='spinner-layer'><div class='circle-clipper left'>" +
	      				"<div class='circle'></div></div><div class='gap-patch'>" +
	        			"<div class='circle'></div></div><div class='circle-clipper right'>" +
	        			"<div class='circle'></div></div></div></div></div>";

		$(".card-content").html(spinner);
	}

	function preCarregar(){
		const preloaders = document.getElementById("preloaders");
		preloaders.innerHTML = "";
	    for (var i = 0; i < pares.length; i++) {
	        preloaders.innerHTML += "<img src='" + pares[i].img + "'>";
	        preloaders.innerHTML += "<video src='" + pares[i].vid + "'></video>";
	    }
	    intervalo = setInterval(isComplete, 300);
	}

	function isComplete(){
		const children = document.getElementById("preloaders").children;
		for (let i = 0; i < children.length; i++) {
			if (children[i].complete) {
				mediasCarregadas++;
			}

			if (mediasCarregadas == pares.length*2) {
				montar();
			}
		}
	}
	
	function comecaJogo(){
		limpaTabuleiro();
		addLoader();
		embaralhaPares();
		preCarregar();
	}



	comecaJogo();


    function montar(){

    	clearInterval(intervalo);
    	mediasCarregadas = 0;

    	//var change = "<table>";

	    var linhas, colunas,change = "", tipoCol;


	    switch(gameConfig.tamanho){
	        case "6":  linhas = 3;
	                   colunas = 4;
	                   tipoCol = 3; break;
	        case "10": linhas = 3;
	                   colunas = 8; break;
	        case "12": linhas = 3;
	                   colunas = 10;
	    }    
	    
	    var count = 0;
	    //vetor para saber quantas vezes cada par foi posicionado
	    posicionados = [];

	    var num_pos = 0;

	    var total = colunas * linhas;
	    for (let i = 0; i < linhas; i++) {
	    	change += "<div class='row'>";
	    	//change += "<tr>";
	    	for (let j = 0; j < colunas; j++) {
				change += "<div class='col s"+tipoCol+"'><div class='posicoes' virado=false></div></div>";
				//change += "<td><div class='posicoes' virado=false></div></td>";
	    	}
	    	//change += "</tr>";
	    	change += "</div>";
	    }

	    $(".card-content").html(change);

	    
	    var posicoes = document.getElementsByClassName("posicoes");
	    
	    var vezes = 0;
	    while(count < gameConfig.tamanho){
	        var random_num = parseInt(Math.random()*(gameConfig.tamanho*2));
	        var pos = posicoes[random_num];
	        if (pos.innerHTML === "") {
	            pos.setAttribute("data-id", count);
	            if (vezes ==  0){
	                pos.setAttribute("data-ext", 0);
	            	pos.innerHTML = "<img class='responsive-img' src='covers/image_cover.jpg'>";
	            }else{
	                pos.setAttribute("data-ext", 1);
	            	pos.innerHTML = "<img class='responsive-img' src='covers/video_cover.png'>";
	            }
	            tabuleiro[random_num] = pares[count];
	            vezes++;
	        }
	        if (vezes == 2) {
	            vezes = 0;
	            count++;
	        }
	    }
    }

    function joga(element){
    	const height = $(element).parent().height();
	    var numero = $(element).attr("data-id");
	    if ($(element).attr("virado") == 'false' && 
	    	($(element).attr("data-ext") != $(selecionadas[0]).attr("data-ext") || selecionadas.length == 0)){
	        var item = element.children[0];
	        var ext = element.getAttribute("data-ext");
	        if (ext == 0) {
	            item.src = pares[numero].img;

	            $(item).removeClass("responsive-img");

	            item.onload = function(){
		        	element.style.height = height + "px";
		        };
	        }else{

	        	$(element).parent().height(height);
	        	$(element).height(height);

	            element.innerHTML = "<video class='carta responsive-video' src='" + pares[numero].vid + "' controls autoplay muted></video>";
	        }
	        
	       	
	        $(element).attr("virado", true);
	        selecionadas[selecionadas.length] = element;
	        if (selecionadas.length === 2){
	            if ($(selecionadas[0]).attr("data-id") !== $(selecionadas[1]).attr("data-id")){
	            	$(".card").css("background-color", "red");
	            	estado = false;
	            }else{
	                viradas++;
	                $(".card").css("background-color", "green");
	                estado = true;
	            	for (var i = 0; i < 2; i++) {
	                	selecionadas[i].parentElement.innerHTML += "<div class='fixed-action-btn absoluto btnInfo' data-id="+$(selecionadas[i]).attr('data-id')+">" +
									    			 "<a class='btn-floating btn-small waves-effect'>"+
									      			 " <i class='material-icons'>menu</i></a></div>";
	            	}
	                if (viradas === pares.length){
	                	limpa(true);
	                    venceu();
	                    viradas = 0;
	                }
	            }
	        }
	    }
	}

	function limpa(estado){
		$(".card").first().css("background-color", "#042A2B");
		if (estado == false) {	
		    for (var i = 0; i < selecionadas.length; i++) {
		    	var element = $(selecionadas[i]);
		        element.attr("virado", false);
		        if (element.attr("data-ext") == '0') {
		        	element.html("<img class='carta' width='"+ $(element).width()+"' height='"+$(element).height()+"' src='covers/image_cover.jpg'>"); 
				}else{
					element.html("<img class='carta' width='"+ $(element).width()+"' height='"+$(element).height()+"' src='covers/video_cover.png'>");  
				}
		    }
		}
		selecionadas=[];

	}

	function carregaModal(id){
		const par = pares[id];
		$(".modal h4").text(par.nome);
		$(".modal h5").text("Categoria: "+par.categoria);
		$(".modal img").attr("src", par.img);
		$(".modal video").attr("src", par.vid);

		var alfabeto = $("#alfabeto");
	
		alfabeto.empty();
		
		for(var i = 0; i < par.nome.length; i++){
			alfabeto.append("<img class='col s3 alfabeto' src='alfabeto/" + par.nome[i] + ".png'>");
		}
	}

	function venceu(){
	    document.getElementsByTagName("h4")[0].innerHTML = "Você Venceu!";

	    var add = "<div class='card-action'><div class='row'><div class='col s12'>" +
				  "<button type='button' class='btn waves-effect' id='posGame1'>Jogar com os mesmos pares</button></div></div>" +
				  "<div class='row'><div class='col s12'><button type='button' class='btn waves-effect' id='posGame2'>Jogar com outros pares</button></div></div>" +
				  "<div class='row'><div class='col s12'>";

	    if (firebase.auth().currentUser != null) {
	    	add += "<a href='menu.html#jogo' class='btn waves-effect'>Trocar dificuldade</a>";
	    }else{
	    	add += "<a href='jogoForm.html' class='btn waves-effect'>Trocar dificuldade</a>";
	    }
	    
	    add += "</div></div></div>";

	    	    
	    $(".card-content").append(add);
	}
});