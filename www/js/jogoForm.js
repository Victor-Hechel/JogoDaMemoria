$(function(){

	var processando = false;

	firebase.auth().onAuthStateChanged(function(user){

		carregaCategorias($("select[name='categorias']"));

	});


	$(document).on("click", "#jogar", function(){

		if (!processando) {
			proocessando = true;
			this.innerHTML = "<div class='preloader-wrapper small active'><div class='spinner-layer '>"+
      						  "<div class='circle-clipper left'><div class='circle'></div></div><div class='gap-patch'>"+
        					  "<div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div>"+
      					 	  "</div></div></div>";

			const categoria = $("select[name='categorias']").val();
			const tamanho = $("select[name='tamanhos']").val();
			const tipo_pares = $("select[name='tipo_pares']").val();

	        carregaParesJogo(categoria, tipo_pares).then(function(data){
		        if (data) {
		            if (Object.keys(data).length < tamanho) {
		            	const error = {
		            		code: 'game/poucos-pares'
		            	}
		                showErrorMessage(error);
		                $("#jogar").text("Jogar");
		                processando = false;
		            }else{

		                const gameConfig = {
		                	categoria: categoria,
		                	tamanho: tamanho,
		                	tipo_pares: tipo_pares
		                }

		                var chaves = Object.keys(data);
		                var pares = [];

		                for (var i = 0; i < chaves.length; i++) {
		                	pares[i] = data[chaves[i]];
		                }

		                localStorage.setItem("pares", JSON.stringify(pares));
		                localStorage.setItem("gameConfig", JSON.stringify(gameConfig));

		            	window.location.href = "jogo.html";
		            }
		        }else{
		            processando = false;
		            this.innerHTML = "Jogar";
		        }
   			});
	    }
	});
});