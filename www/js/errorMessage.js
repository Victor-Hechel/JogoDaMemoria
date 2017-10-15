//script para gerenciar erros em geral
function showErrorMessage(error){
	const message = verificaErro(error.code);
	if($("#errorMessage").html() == ""){
		const elementMessage = "<div class='row'><div class='col s12'><div class='errorMessage'><h5>"+message+"</h5></div></div></div>";
		$(elementMessage).hide().appendTo("#errorMessage").slideDown('slow');
	}else{
		$(".errorMessage h5").html(message);
	}
	
}

function verificaErro(error){
	switch(error){
		case 'auth/invalid-email': return 'E-mail inválido';
		case 'auth/email-already-in-use': return 'E-mail já está sendo usado';
		case 'game/poucos-pares': return 'Pares insuficientes';
		case 'auth/wrong-password': return 'Senha incorreta';
		case 'auth/user-not-found': return 'Usuário não existe';
	}
}