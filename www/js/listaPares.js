var chave_ref = null;
var usuario_atual = null;
var paresAtuais = [];

$(function(){


	firebase.auth().onAuthStateChanged(function(user){
		if(user != null){
			var database = firebase.database();
			usuario_atual = firebase.auth().currentUser.uid;

			var ref = database.ref("users").child(usuario_atual).child("meusPares").orderByKey().limitToFirst(1);

			//carrega o primeiro par
			ref.once('value', function(data){
				if (data.val() != null) {
					//chave referência para carregar os próximos pares
					chave_ref = Object.keys(data.val())[0];
					carregaPares();
				}else{
					//caso não tenha nenhum par ele mostra uma mensagem dizendo para inserir
					addInserirParesMessage();
				}
			});
		}else{
			//caso não esteja logado volta para o login
			window.location.href = "index.html";
		}

	});


/*	
	$('#botao').on('click', function(){
		$.getJSON("/offsets/"+rowNum(), lista);
	});
*/

	$(document).on('click', '.remover', function(){
		remove(this);
	});

/*	$(document).on('click', '.editar', function(){
		const id = $(this).parents().eq(3).attr("id");
		window.location.href = "editarPar.html";
	});
*/
	$(document).on('click', '#carregar', function(){
		$(this).parents().eq(1).remove();
		carregaPares();
	});

});

function carregaPares(){
	const database = firebase.database();
	//carrega três pares a partir daquele carregado no começo
	const ref = database.ref("users").child(usuario_atual).child("meusPares").orderByKey().limitToFirst(3).startAt(chave_ref);

	ref.once('value', function(data){
		var datas = data.val();
		if(datas != null){
			let chaves = Object.keys(datas);
			//caso tenha carregado 3 diz pra mostrar 2 senão mostra todos
			if (chaves.length == 3) {
				var tamanho = 2;
			}else{
				var tamanho = chaves.length;
			}
			$(".center-align").remove();

			for (let i = 0; i < tamanho; i++) {
				let completos = 0;
				let chave = chaves[i];

				adicionarParNaLista(datas[chave], chave);

			}

			//caso tenha conseguido carregar 3 pares mostra a mensagem para carregar mais pares
			if (chaves.length == 3) {
				let table = document.getElementsByClassName("card-content")[0];
				table.innerHTML += "<div class='row'><div class='col s12'><button id='carregar' class='btn waves-effect'>Carregar mais pares</button></div></div>";
				chave_ref = chaves[2];
			}

		}else{
			//caso o usuário não tenha pares
			if (datas == null) {
				$("#conteudo").append("<h4 class='text-center'>Você não possui pares</h4>");
			}
		}	
	});
}


function verificaParesRestantes(){
	if (Object.keys(paresAtuais).length == 0) {
		addInserirParesMessage();
	}
}

//mostra a mensagem para inserir pares
function addInserirParesMessage(){
	$(".center-align").remove();
	let table = document.getElementById("aviso");
	table.innerHTML = "<span class='card-title center'><h4>Você não possui nenhum par!</h4></span>"+
					  "<div class='row'><div class='input-field col s12'>"+
					  "<a class='btn waves-effect waves-light' onclick='clicaCadastrarPar()' name='action'>Inserir novos</a>"+
					  "</div></div>";
}

function adicionarParNaLista(data, chave){

	//verifica se o par está na lista
	if (!estaNaLista(chave)) {

		//caso n houvessem pares tira o aviso para inserir
		if (paresAtuais.length == 0) {
			document.getElementById("aviso").innerHTML = "";
		}

		paresAtuais[chave] = data;

		//adiciona no final da lista o par adicionado		
		document.getElementById("pares").innerHTML +=   "<div class='row item' id='"+chave+"'><div class='col s12'><div class='row'><div class='col s11'>" +
												        "<h5>"+data.nome+"<br><h6>Categoria: "+data.categoria+"</h6></h5></div><div class='col s1 relativo'>" + 
												  	    "<div class='fixed-action-btn down click-to-toggle absoluto'>" +
													    "<a class='btn-floating btn-large waves-effect'><i class='material-icons'>menu</i></a><ul>" + 
													    "<li><a class='btn-floating waves-effect btnExcluir' data-id='"+chave+"'><i class='material-icons'>delete_forever</i></a></li>" + 
													    "<li><a class='btn-floating waves-effect btnEditar' data-id='"+chave+"'><i class='material-icons'>mode_edit</i></a></li>" +
												 	    "</ul></div></div></div><div class='row'><div class='file-field input-field col s12'>" + 
												        "<img class='responsive-img' src='"+data.img+"'></div><div class='file-field input-field col s12'>" + 
												        "<video class='responsive-video' src='"+data.vid+"' controls muted></video></div></div></div></div>";
	}

	
}

function estaNaLista(chave){
	const chaves = Object.keys(paresAtuais);

	for (let i = 0; i < chaves.length; i++) {
		if(chaves[i] == chave)
			return true
	}
	return false;
}

//leva para a parte de cadastrar par
function clicaCadastrarPar(){
	$("a[href='#cadastrarPar']").click();
}