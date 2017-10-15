$(function(){
	//objeto de autenticação de usuarios do Firebase
	const auth = firebase.auth();

	//auth.signOut();

	$(document).on("click", "#submit", function(){
		const email = $("#login").val();
		const senha = $("#senha").val();


		auth.signInWithEmailAndPassword(email, senha).catch(function(err){
		
			if (err) {
				showErrorMessage(err);
			}
		});

	});


	//verifica se o usuário está logado
	auth.onAuthStateChanged(function(user){
		//se entrar no if está logado
		if (user) {
			window.location.href = "menu.html";
		}
	});
});