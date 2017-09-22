function carregaParesJogo(categoria, tipo_pares){
	return new Promise(function(resolve, reject){
		const auth = firebase.auth();
        const database = firebase.database();
        const storage = firebase.storage();

        var userId = 0;

        if (auth.currentUser != null) {
            userId = auth.currentUser.uid;
        }


        //caso esteja logado e selecione o nível
        if (tipo_pares == "0") {
            const ref = database.ref().child("users").child(userId).child("meusPares").orderByChild('categoria').equalTo(categoria);
            ref.once('value', function(data){
                var retorno = [];
                var datas = data.val();
                if (datas != null) {
                    let chaves = Object.keys(datas);
                    for (let i = 0; i < chaves.length; i++) {
                        let objeto = datas[chaves[i]];
                        retorno[chaves[i]] = objeto;
                    }
                }
                resolve(retorno);
            });
        }

        //caso não esteja logado e selecione o nível
        if (tipo_pares == "1") {
            let ref = database.ref().child("pares").orderByChild("categoria").equalTo(categoria);
            ref.once('value', function(data){
                var datas = data.val();
                var retorno = [];
                if (datas != null) {
                    var chaves = Object.keys(datas);
                    for (var i = 0; i < chaves.length; i++) {
                        if (auth.currenUser == null || userId != datas[chaves[i]].user) {
                            retorno[chaves[i]] = datas[chaves[i]];
                        }
                    }
                }
                resolve(retorno);
            });
        }

    });

}