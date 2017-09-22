$(function(){
	const auth = firebase.auth();

	auth.signOut();

	$(document).on("click", "#submit", function(){
		const email = $("#login").val();
		const senha = $("#senha").val();


		auth.signInWithEmailAndPassword(email, senha).catch(function(err){
		
			if (err) {
				console.log(err);
				showErrorMessage(err);
			}
		});

	});

	auth.onAuthStateChanged(function(user){
		if (user) {
			console.log("hell yeah");
			window.location.href = "menu.html";
		}else{
			console.log("deu ruim");
		}
	});
});