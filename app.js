
class Despesa{
	constructor(ano, mes, dia, tipo, descricao, valor){
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for(let i in this){
			if(this[i] == undefined || this[i] == '' || this[i] == null){
				return false
			}
		}
		return true
	}
}

class Bd{

	constructor(){
		let id = localStorage.getItem('id')
		
		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId(){
		let proximoId = localStorage.getItem('id') 
		return parseInt(proximoId) + 1
	}

	gravar(d){
		let id = this.getProximoId()
		localStorage.setItem(id, JSON.stringify(d))
		localStorage.setItem('id', id)
	}

	recuperarTodosOsRegistros(){
		//array de despesas 
		let despesas = Array()

		let id = localStorage.getItem('id')
		
		// recuperando todas as despesas cadastradas em localStorage
		for(let i = 1; i <= id; i++){
			//recuperad despesa 
			let despesa = JSON.parse(localStorage.getItem(i))

			//existem a possibilidade de haver indices que foram pulados/removidos
			//neste caso nos vamos pular esses indices
			if(despesa === null){
				continue
			}
			despesa.id = i 
			despesas.push(despesa)
		}

		return despesas 
	}

	pesquisar(despesa){
		let despesasFiltradas = Array()
		despesasFiltradas = this.recuperarTodosOsRegistros()
		console.log(despesasFiltradas)
		console.log(despesa)

		//ano
		if(despesa.ano != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}
		//mes
		if(despesa.mes != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}
		//dia
		if(despesa.dia != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}
		//tipo
		if(despesa.tipo != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}
		//descricao
		if(despesa.descricao != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}
		//valor
		if(despesa.valor != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		return despesasFiltradas
	}

	remover(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd()


function cadastrarDespesa(){

	let ano = document.getElementById('ano') // recomendado
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value,
		mes.value,
		dia.value,
		tipo.value, 
		descricao.value,
		valor.value
	)

	let modalCaixa = document.getElementById("modal-caixa")
	let titulo = modalCaixa.getElementsByClassName('modal-title')[0]
	let mensagem = modalCaixa.getElementsByClassName('modal-body')[0]
	let txtBotao = modalCaixa.getElementsByClassName('btn')[0]

	if(despesa.validarDados()){
		bd.gravar(despesa)
		$('#modal-caixa').modal('show')	

		 titulo.innerHTML = "Sucesso na Gravação"
		 mensagem.innerHTML = "O cadastro foi efetuado com sucesso"
		 txtBotao.innerHTML = "Concluir"
		 txtBotao.className = "btn btn-success"
		 titulo.className = "modal-title text-success"

		 ano.value = ''
		 mes.value = ''
		 dia.value = ''
		 tipo.value = ''
		 descricao.value = ''
		 valor.value = ''
	}
	else{
		$('#modal-caixa').modal('show')
		titulo.innerHTML = "Erro na Gravação"
		mensagem.innerHTML = "Existem campos obrigatórios que não foram preenchidos"
		txtBotao.innerHTML = "Voltar e Corrigir"
		txtBotao.className = "btn btn-danger"
		titulo.className = "modal-title text-danger"
	}

}


function carregaListaDespesas(despesas = Array(), filtro = false){
	if(despesas.length == 0 && filtro == false){
		despesas = bd.recuperarTodosOsRegistros()
	}
	
	let listaDespesas = document.getElementById("listasDespesas")
	listaDespesas.innerHTML = ""
	//percorrer o array depsspesas listando cada despesa deforma dinamica 

	despesas.forEach(function(d){
		// criando a linha (tr)
		let linha = listaDespesas.insertRow()
		// Criar colunas(td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

		//ajustar tipo
		switch(d.tipo) {
			case '1': d.tipo = 'Alimentação'
				break
			case '2': d.tipo = 'Educação'
				break
			case '3': d.tipo = 'Lazer'
				break
			case '4': d.tipo = 'Saúde'
				break
			case '5': d.tipo = 'Transporte'
				break
		}

		linha.insertCell(1).innerHTML =  d.tipo
		linha.insertCell(2).innerHTML =  d.descricao
		linha.insertCell(3).innerHTML =  d.valor

		//criar botao de exclusao 
		let btn = document.createElement("button")
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = `id_despesa_${d.id}` 
		btn.onclick = function(){
			//remover a despesa 
			if(confirm('Clique em Okay se deseja realmente EXCLUIR')) {
				let id = this.id.replace('id_despesa_', '')
				bd.remover(id)
				window.location.reload()
			}
		}

		linha.insertCell(4).append(btn)
	})
}	


function pesquisarDespesa(){
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	let despesas = bd.pesquisar(despesa)
	carregaListaDespesas(despesas, true)

}