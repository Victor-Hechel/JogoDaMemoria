$(function(){
	video = null;
	imagem = null;

	function verificaSource(elemento){
		const preview = $("#" + elemento.attr("data-for"));
		if (!temSource(preview)){
			esconde(preview);
			return false;
		}else{
			mostra(preview);
			return true;
		}
	}

	function temSource(elemento){
		if (elemento.src == "") {
			return false;
		}
		return true;
	}

	function esconde(elemento){
		$(elemento).hide();
	}

	function mostra(elemento){
		$(elemento).show();
	}

	$(document).on("change", "input[type='file']", function() {
		var source = $(this);
		if (verificaSource(source)) {
			//foto = e.target.files[0];
	  		$("#"+source.attr("data-for")).attr("src", URL.createObjectURL(this.files[0]));
	  	}
	});


	var valida;
	var processo = false;

	$(document).on("change", "#palavra", verificaNome);

	$(document).on("click", "#submit", function(){
		const submit = $("#submit");
		if (submit.text() == "Enviar Par") {

			this.innerHTML = "<div class='preloader-wrapper small active'><div class='spinner-layer '>"+
      						  "<div class='circle-clipper left'><div class='circle'></div></div><div class='gap-patch'>"+
        					  "<div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div>"+
      					 	  "</div></div></div>";


			if(verifica()){
				const auth = firebase.auth();
				const database = firebase.database();
				const ref = database.ref("users/"+firebase.auth().currentUser.uid + "/meusPares");
				var data = {
					nome: $("#palavra").val(),
					categoria: $("#categorias").val(),
					img: null,
					vid: null,
					user: null
				};
				console.log(firebase.auth().currentUser);
				var myRef = ref.push(data);

				const storage = firebase.storage();

				var storageRef = storage.ref("pares/" + auth.currentUser.uid + "/imagens/"+myRef.key);

				var task = storageRef.put(document.getElementById("foto").files[0]);

				var complete = 0;

				data.user = auth.currentUser.uid;

				task.on('state_changed', function(){}, function(){}, function(){
					complete++;
					const url = task.snapshot.downloadURL;
					console.log(url);
					data["img"] = url;
					if (complete == 2) {
						//database.ref().child("novos").child(myRef.key).set(data);
						let updates = {};
						updates["pares/"+myRef.key] = data;
						updates["users/"+auth.currentUser.uid+"/meusPares/"+myRef.key] = data;
						database.ref().update(updates);
						submit.text("Enviar Par");
						cleanForm();
						adicionarParNaLista(data, myRef.key);
						$("a[href='#meusPares']").click();					
					}
				});

				storageRef = storage.ref("pares/" + auth.currentUser.uid + "/videos/"+myRef.key);

				const taskVideo = storageRef.put(document.getElementById("video").files[0]);

				taskVideo.on('state_changed', function(){}, function(){}, function(){
					complete++;
					data["vid"] = taskVideo.snapshot.downloadURL;
					if(complete == 2){
						//database.ref().child("novos").child(myRef.key).set(data);
						let updates = {};
						updates["pares/"+myRef.key] = data;
						updates["users/"+auth.currentUser.uid+"/meusPares/"+myRef.key] = data;
						database.ref().update(updates);
						submit.text("Enviar Par");
						cleanForm();
						adicionarParNaLista(data, myRef.key);
						$("a[href='#meusPares']").click();					
					}
				});
			}else{
				submit.text("Enviar Par");
			}
		}

		
	});

	function verificaNome(){
		var element = $("#palavra").first();
		var nome = element.val();

		if (nome.length == 0 || nome.length > 30) {

			mostrarErro("Tamanho inválido", "palavra");
			return false;
		}
		
		for (var i = 0; i < nome.length; i++) {
			var code = nome.toLowerCase().charCodeAt(i);
			if (!((code >= 97 && code <= 122) || (code >= 128 && code <= 136) || (code >= 160 && code <= 163) || (code == 32) ||
				(code >= 224 && code <= 227) || (code >= 231 && code <= 237) || (code >= 242 && code <= 245) || (code >= 249 && code <= 251))) {
				mostrarErro("Palavra inválida", "palavra");

				return false;
			}
		}
		const user = firebase.auth().currentUser;
		const ref = firebase.database().ref().child("users").child(user.uid).child("meusPares").orderByChild("nome").equalTo(nome);

		ref.once('value', function(data){
			valida = true;
			var datas = data.val();
			if (datas == null) {
				retirarErro("palavra");
				return true;
			}else{
				mostrarErro("Par já existe!", "palavra");
				valida = false;
			}

			ref.off();

			return valida;

		}

		, function(error){
			console.log(error);
		});
			
	}

	function verifica(){
		verificaNome();
		const foto = document.getElementById("foto").files[0];
		const video = document.getElementById("video").files[0];
		if (foto != null && video != null && valida) {
			return true;
		}
		return false;
	}

	function cleanForm(){
		$('#cadastroForm').each (function(){
		  this.reset();
		});
		esconde($("#fotoPreview"));
		esconde($("#videoPreview"));
	}

});