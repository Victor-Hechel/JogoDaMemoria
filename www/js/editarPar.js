$(function(){
	var clicadoEditar = null;

	$(document).on("click", ".btnEditar", function(){
		clicadoEditar = $(this).attr("data-id");
		prepararModal();
    	$("#modalEditar").openModal();
    });

    function prepararModal(){
    	const obj = paresAtuais[clicadoEditar];
    	$("#editPalavra").val(obj["nome"]);
    	carregaCategorias($("#editCategorias"));

    	$("#editCategorias").val(obj.categoria);

    	$(".modal img").attr("src", obj["img"]);
    	$(".modal video").attr("src", obj["vid"]);
    }

	$(document).on("change", ".modal input[type='file']", function() {
	  	$(".modal "+$(this).attr("data-for")).attr("src", URL.createObjectURL(this.files[0]));
	});


	var valida;
	var processo = false;

	$(document).on("blur", "#editPalavra", verificaNome);

	$(document).on("click", "#editar", function(){
		const submit = $(this);
		if (submit.text() == "Editar Par") {

			this.innerHTML =  "<div class='preloader-wrapper small active'><div class='spinner-layer'>"+
      						  "<div class='circle-clipper left'><div class='circle'></div></div><div class='gap-patch'>"+
        					  "<div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div>"+
      					 	  "</div></div></div>";

			if(verifica()){
				const auth = firebase.auth();
				const database = firebase.database();

				const oldObj = paresAtuais[clicadoEditar];

				var data = {
					nome: $("#editPalavra").val(),
					categoria: $("#editCategorias").val(),
					img: null,
					vid: null,
					user: auth.currentUser.uid
				};

				const storage = firebase.storage();

				const fotoFile = document.getElementById("editFoto").files[0];
				const videoFile = document.getElementById("editVideo").files[0];


				var complete = 0;

				if (fotoFile == undefined) {
					data.img = oldObj.img;
					complete++;
					terminaEditar(data);
				}else{
					const storageRef = storage.ref("pares/" + auth.currentUser.uid + "/imagens/"+ clicadoEditar);

					const task = storageRef.put(document.getElementById("editFoto").files[0]);


					task.on('state_changed', function(){}, function(){}, function(){
						complete++;
						const url = task.snapshot.downloadURL;
						data["img"] = url;
						if (complete == 2) {
							terminaEditar(data);
						}
					});
				}

				
				if (videoFile == undefined) {
					data.vid = oldObj.vid;
					complete++;
					terminaEditar(data);
				}else{
					const storageRef = storage.ref("pares/" + auth.currentUser.uid + "/videos/"+clicadoEditar);

					const taskVideo = storageRef.put(document.getElementById("editVideo").files[0]);

					taskVideo.on('state_changed', function(){}, function(){}, function(){
						complete++;
						data["vid"] = taskVideo.snapshot.downloadURL;
						if(complete == 2){
							terminaEditar(data);
		
						}
					});
				}

				
			}else{
				submit.text("Editar Par");
			}
		}

		
	});

	function terminaEditar(data){
		let updates = {};
		console.log(data);
		updates["pares/"+clicadoEditar] = data;
		updates["users/"+data.user+"/meusPares/"+clicadoEditar] = data;
		paresAtuais[clicadoEditar] = data;
		firebase.database().ref().update(updates);
		changeItem(data);
		$("#editar").text("Editar Par");
		$('#modalEditar').closeModal();
	}

	function changeItem(data){
		$("#"+clicadoEditar+" h5").text(data.nome);
		$("#"+clicadoEditar+" h6").text("Categoria: " + data.categoria);
		$("#"+clicadoEditar+" img").attr("src" + data.img);
		$("#"+clicadoEditar+" video").attr("src" + data.vid);

	}

	function verificaNome(){
		var element = $("#editPalavra");
		var nome = element.val();

		if (nome.length == 0 || nome.length > 30) {
			mostrarErro("Tamanho inválido", "editPalavra");
			return false;
		}
		
		for (var i = 0; i < nome.length; i++) {
			var code = nome.toLowerCase().charCodeAt(i);
			if (!((code >= 97 && code <= 122) || (code >= 128 && code <= 136) || (code >= 160 && code <= 163) || (code == 32) ||
				(code >= 224 && code <= 227) || (code >= 231 && code <= 237) || (code >= 242 && code <= 245) || (code >= 249 && code <= 251))) {
				mostrarErro("Palavra inválida", "editPalavra");
				return false;
			}
		}
		const user = firebase.auth().currentUser;
		const ref = firebase.database().ref().child("users").child(user.uid).child("meusPares").orderByChild("nome").equalTo(nome);

		ref.on('value', function(data){
			valida = true;
			var datas = data.val();
			if (datas == null || Object.keys(datas)[0] == clicadoEditar) {
				retirarErro("editPalavra");
				return true;
			}else{
				mostrarErro("Par já existe!", "editPalavra");
				valida = false;
			}

			return valida;

		}

		, function(error){
			console.log(error);
		});
			
	}
	

	function verifica(){
		verificaNome();
		const foto = document.getElementById("editFoto").files[0];
		const video = document.getElementById("editVideo").files[0];
		console.log(valida);
		if (valida) {
			return true;
		}
		return false;
	}

});