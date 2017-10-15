$(function(){

	firebase.auth().onAuthStateChanged(function(user){

		carregaCategorias($("#categorias"));		

	});

	$(document).on("click", "#addCategoria", function(){
		$('#modalCategoria').openModal();
	});

	$(document).on("blur", "#categoria", function(){
		verificaCategoria();
	});

	$(document).on("click", "#modalCategoria button", function(){
		verificaCategoria().then(function(data){
			if (data) {
				const database = firebase.database();
				const auth = firebase.auth();
				const ref = database.ref().child("users").child(auth.currentUser.uid).child("minhasCategorias");
				const obj = {categoria: $("#categoria").val(),
							 oficial: false};
				ref.push(obj);
				$("#modalCategoria").closeModal();
			}
		});
	});

	function verificaCategoria(){

		var element = $("#categoria").first();
		var categoria = element.val();

		//faz validação da categoria que o usuário deseja cadastrar
		const promise = new Promise(function(resolve, reject){
			if (categoria.length == 0 || categoria.length > 20) {

				mostrarErro("Tamanho inválido", "categoria");
				resolve(false);
				return;
			}
			
			for (var i = 0; i < categoria.length; i++) {
				var code = categoria.toLowerCase().charCodeAt(i);
				if (!((code >= 97 && code <= 122) || (code >= 128 && code <= 136) || (code >= 160 && code <= 163) || (code == 32) ||
					(code >= 224 && code <= 227) || (code >= 231 && code <= 237) || (code >= 242 && code <= 245) || (code >= 249 && code <= 251))) {
					mostrarErro("Categoria inválida", "categoria");

					resolve(false);
					return;
				}
			}
			const user = firebase.auth().currentUser;
			const ref = firebase.database().ref().child("users").child(user.uid).child("minhasCategorias").orderByChild("categoria").equalTo(categoria);

			ref.on('value', function(data){
				var datas = data.val();
				if (datas == null) {
					retirarErro("categoria");
					resolve(true);
					return;
				}else{
					mostrarErro("Categoria já existe!", "categoria");
					resolve(false);
					return;
				}

				resolve(true);
				return;

			});

		});

		return promise;
		
	}
});

function carregaCategorias(element){

	const promise = new Promise(function(resolve, reject){

		const database = firebase.database();
		const auth = firebase.auth();

		var ref = database.ref();

		//caso o usuário não esteja logado vai carregar as categorias padrão
		if (auth.currentUser == null) {
			ref = ref.child("categorias");
		//caso o usuário esteja vai carregar os padrões + os do próprio usuário		
		}else{
			ref = ref.child("users").child(auth.currentUser.uid).child("minhasCategorias");
		}

		//carrega as categorias
		ref.on("child_added", function(data){
			const obj = data.val();
			element.append($("<option>", {
				value: obj.categoria,
				text: obj.categoria
			}));
			element.material_select();
			resolve(true);
		});
	});
	return promise;
}