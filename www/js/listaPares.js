var chave_ref = null;
var usuario_atual = null;
var paresAtuais = [];

$(function(){


	firebase.auth().onAuthStateChanged(function(user){

		var database = firebase.database();
		usuario_atual = firebase.auth().currentUser.uid;

		var ref = database.ref("users").child(usuario_atual).child("meusPares").orderByKey().limitToFirst(1);

		ref.once('value', function(data){
			if (data.val() != null) {
				chave_ref = Object.keys(data.val())[0];
				carregaPares();
			}else{
				addInserirParesMessage();
			}
		});

	});


	
	$('#botao').on('click', function(){
		$.getJSON("/offsets/"+rowNum(), lista);
	});
	
	$(document).on('click', '.remover', function(){
		remove(this);
	});

	$(document).on('click', '.editar', function(){
		const id = $(this).parents().eq(3).attr("id");
		window.location.href = "editarPar.html";
	});

	$(document).on('click', '#carregar', function(){
		$(this).parents().eq(1).remove();
		carregaPares();
	});

});

function carregaPares(){
	const database = firebase.database();
	const ref = database.ref("users").child(usuario_atual).child("meusPares").orderByKey().limitToFirst(3).startAt(chave_ref);

	ref.once('value', function(data){
		var datas = data.val();
		if(datas != null){
			let chaves = Object.keys(datas);
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

			if (chaves.length == 3) {
				let table = document.getElementsByClassName("card-content")[0];
				table.innerHTML += "<div class='row'><div class='col s12'><button id='carregar' class='btn waves-effect'>Carregar mais pares</button></div></div>";
				chave_ref = chaves[2];
			}

		}else{
			if (datas == null) {
				$("#conteudo").append("<h4 class='text-center'>Você não possui pares</h4>");
			}
		}	
	});
}

function verificaParesRestantes(){
	console.log(paresAtuais);
	if (Object.keys(paresAtuais).length == 0) {
		addInserirParesMessage();
	}
}

function addInserirParesMessage(){
	$(".center-align").remove();
	let table = document.getElementById("aviso");
	table.innerHTML = "<span class='card-title center'><h4>Você não possui nenhum par!</h4></span>"+
					  "<div class='row'><div class='input-field col s12'>"+
					  "<a class='btn waves-effect waves-light' onclick='clicaCadastrarPar()' name='action'>Inserir novos</a>"+
					  "</div></div>";
}

function adicionarParNaLista(data, chave){

	if (!estaNaLista(chave)) {

		if (paresAtuais.length == 0) {
			document.getElementById("aviso").innerHTML = "";
		}

		paresAtuais[chave] = data;

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

function clicaCadastrarPar(){
	$("a[href='#cadastrarPar']").click();
}