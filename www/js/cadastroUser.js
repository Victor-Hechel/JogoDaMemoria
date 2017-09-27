$(function(){

	$.validator.setDefaults({
        errorClass: 'invalid',
        errorPlacement: function (error, element) {
            element.next("label").attr("data-error", error.contents().text());
        }
    });

	$("#myForm").validate({
		rules: {
			nome: {
				required: true,
				minlength: 5,
				maxlength: 50,
				//nome: true
			},
			email: {
				required: true,
				email: true
			},
			nascimento: {
				required: true
			},
			senha: {
				minlength: 6,
				maxlength: 20,
				required: true
			},
			senha2: {
				equalTo: "#senha",
				required: true
			}

		},
		messages: {
            nome:{
                required: "Digite seu nome",
                minlength: "Nome inválido, deve ter no mínimo 5 caracteres",
                maxlength: "Nome inválido, deve ter no máximo 50 caracteres",
                //nome: "nops"
            },
            email:{
            	required: "Digite seu email",
            	email: "Email não é válido"
            },
            nascimento: {
            	required: "Insira sua data de nascimento"
            },
            senha: {
            	minlength: "Senha inválida, deve ter no mínimo 6 caracteres",
            	maxlength: "Senha inválida, deve ter no máximo 20 caracteres",
            	required: "Digite sua senha"
            },
            senha2: {
            	required: "Digite sua senha novamente",
            	equalTo: "Senhas não são iguais"
            }

        },
	});


	$(document).on("click", "#submit", function(){

		const validator = $( "#myForm" ).validate();

		if (validator.form()) {
			const nome = $("#nome").val();
			const nascimento = $("#nascimento").val();
			const email = $("#email").val();
			const senha = $("#senha").val();
			const senha2 = $("#senha2").val();


			const auth = firebase.auth();

			$("#submit").html("<div class='preloader-wrapper small active'><div class='spinner-layer '>"+
      						  "<div class='circle-clipper left'><div class='circle'></div></div><div class='gap-patch'>"+
        					  "<div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div>"+
      					 	  "</div></div></div>");

			auth.createUserWithEmailAndPassword(email, senha).then(function(user){
				const database = firebase.database();

				const refCategoria = database.ref("categorias");

				refCategoria.on('value', function(data){
					const userObj = {
						nome: nome,
						nascimento: nascimento,
						email: email,
						minhasCategorias: data.val()
					};

					const databaseRef = database.ref().child("users").child(user.uid);
					databaseRef.set(userObj);
					//window.location.href = "menu.html";

				});

			}).catch(function(error){
				if (error.code == "auth/email-already-in-use") {
					$("#submit").html("Criar conta");
					showErrorMessage(error);
				}
			});

		}

	});

	firebase.auth().onAuthStateChanged(function(user){
		if (user) {
			window.location.href = "menu.html";
		}else{
			window.location.href = "index.html";
		}
	});
});