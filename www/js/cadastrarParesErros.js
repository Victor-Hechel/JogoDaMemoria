//script para genrenciar as mensagens de erro dos pares
function mostrarErro(erro, id){
	const elemento = $("."+id); 
	if (!temMensagem(elemento)) {
		const elementoMensagemErro = "<p class='inputError'>" + erro + "</p>";
		$(elementoMensagemErro).hide().appendTo(elemento).slideDown('normal');
		changeInputColorToError(id);
	}else{
		elemento.children().first().html(erro);
	}
}

function temMensagem(elemento){
	if (elemento.html() == "") {
		return false;
	}else{
		return true;
	}
}

function changeInputColorToError(id){
	$("#"+id).css("border-color", "#f44336");
}

function changeInputColorToSuccess(id){
	$("#"+id).css("border-color", "#4CAF50");
}

function retirarErro(id){
	const elemento = $("." + id).html("");
	changeInputColorToSuccess(id);
}