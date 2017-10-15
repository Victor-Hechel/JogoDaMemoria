$(function(){
	var clicado = null;
	//abre o Modal ao clicar em excluir
	$(document).on("click", ".btnExcluir", function(){
		clicado = $(this).attr("data-id");
    	$('#modalDelete').openModal();
    });

	//Exclui o par e remove da lista
    $(document).on("click", "#excluir", function(){
    	const pai = $("#"+clicado);

		const database = firebase.database();
		const user = firebase.auth().currentUser.uid;
		const storage = firebase.storage();

		const imagemRef = storage.ref("pares/" + user + "/imagens/"+ clicado);
		const videoRef = storage.ref("pares/" + user + "/videos/" +clicado);

		var contagem = 0;

		imagemRef.delete().then(function(){
			contagem++;
			if (contagem == 2){
				pai.hide(250, function(){
					pai.remove();
					database.ref("pares/" + clicado).remove();
					database.ref("users/" + user + "/meusPares/" + clicado).remove();
					removeElemento(clicado);
					verificaParesRestantes();
				});
			}
		});

		videoRef.delete().then(function(){
			contagem++;
			if (contagem == 2){
				pai.hide(250, function(){
					pai.remove();
					database.ref("pares/" + clicado).remove();
					database.ref("users/" + user + "/meusPares/" + clicado).remove();
					removeElemento(clicado);
					verificaParesRestantes();
				});
			}
		});
    });

    $(document).on("click", "#resetExcluir", function(){
    	clicado = null;
    });

    function removeElemento(chave){
    	delete paresAtuais[chave];
    }
});