
class Despesa {

	
	constructor(ano, mes, dia, tipo, descricao, valor){
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	} 

	validarDados(){

		for ( let i in this){
			if( this[i] == undefined || this[i] == '' || this[i] == null){

				return false
			}

		}

		return true

	}


}

class Bd{

		constructor(){

			let id = localStorage.getItem('id') // procura por um id válido

			if(id === null){ // caso não encontrei nenhum id, ai da null e não zero

				localStorage.setItem('id', 0)

			}

		}


		getProximoId(){

			let proximoId = localStorage.getItem('id')
			return parseInt(proximoId) + 1 

		}

		gravar (d){

			

			let id = this.getProximoId()
			localStorage.setItem(id,JSON.stringify(d)) // converte o objeto despesa, vindo como D em json ..

			localStorage.setItem('id', id)

		}
		recuperarTodosRegistros(){

			
			let despesas = Array() // crio o array para guardar todos objetos do laço

			let id = localStorage.getItem('id') // pego o ultimo id
			

			for ( let i=1; i<= id; i++){

				let despesa = JSON.parse(localStorage.getItem(i))

				//verificar se existe um valor para o id.. imagine que foi excluido um registro..
				if (despesa === null){
					continue //faz volta o laço, com isso pular o indice nulo
				}
				
				despesas.push(despesa)
				
			}
			return despesas  // devolve o array de despesas para quem chamou
			

		}
		pesquisar(despesa){
			
			let pesquisaFiltrada = Array()
			pesquisaFiltrada = this.recuperarTodosRegistros()
			

			//fazendo os filtros
			if(despesa.ano != ''){
			pesquisaFiltrada = pesquisaFiltrada.filter( d => d.ano == despesa.ano)
			}


			if(despesa.mes != ''){
			pesquisaFiltrada = pesquisaFiltrada.filter( d => d.mes == despesa.mes)
			}

			if(despesa.dia != ''){
			pesquisaFiltrada = pesquisaFiltrada.filter( d => d.dia == despesa.dia)
			}
			

			if(despesa.tipo != ''){
			pesquisaFiltrada = pesquisaFiltrada.filter( d => d.tipo == despesa.tipo)
			}

			if(despesa.descricao != ''){
			pesquisaFiltrada = pesquisaFiltrada.filter( d => d.descricao == despesa.descricao)
			}

			if(despesa.valor != ''){
			pesquisaFiltrada = pesquisaFiltrada.filter( d => d.valor == despesa.valor)
			}
			// exibindo para confirmar
			return pesquisaFiltrada

		}


}


let bd = new Bd()

function cadastrarDespesas(){

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	//	console.log(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

	let despesa = new Despesa(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value, 
		valor.value

	)


	if (despesa.validarDados()){
		bd.gravar(despesa)  // função que vai usar o local storage..
		document.getElementById('titulo_modal').innerHTML = 'Registro efetuado com sucesso'
		document.getElementById('modal_titulo_div').className = "modal-header text-success" 
		document.getElementById('modal_conteudo').innerHTML = "Operação gravada com sucesso.."
		document.getElementById('modal_btn').innerHTML = "Voltar"
		document.getElementById('modal_btn').className = "btn btn-success"
		$('#modal_dialog').modal('show')
		ano.value = ''
		mes.value =''
		dia.value =''
		tipo.value =''
		descricao.value =''
		valor.value =''

	} else{
		//vamos usar um pouco do jquery aqui.. aprender mais para frente
		document.getElementById('titulo_modal').innerHTML = 'Erro na inclusao do registro'
		document.getElementById('modal_titulo_div').className = "modal-header text-danger" 
		document.getElementById('modal_conteudo').innerHTML = "Erro na gravação, verifique se todos campos estão preenchidos.."
		document.getElementById('modal_btn').innerHTML = "Voltar e corrigir"
		document.getElementById('modal_btn').className = "btn btn-danger"
		$('#modal_dialog').modal('show')

	}
	


}

function carregaListaDespesas( despesas = Array()){

	if(despesas.length == 0){

	despesas = bd.recuperarTodosRegistros()
	}


	let listaDespesas = document.getElementById('listaDespesas')
	listaDespesas.innerHTML=''

	//agora preciso percorrer o array e formar minha tabela .. 
	despesas.forEach(function(d){ //forEach do array pedi uma função de callback
		//criando a linha.. é preciso passar p variavel para referenciar
		let linha = listaDespesas.insertRow()
		//criar as colunas
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
		switch (d.tipo) {  // trocando o número pelo descrição
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
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		let btn = document.createElement("button")
		btn.className='btn btn-danger'
		btn.innerHTML='<i class="fas fa-times"></i>'
		btn.onclick =   // remover a despesa
		linha.insertCell(4).append(btn)





	})




}



function pesquisarDespesa(){

	//recuperando os valores da tela
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	//montando o objeto despesa .. 
	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
	//mandando o objeto despesa para filtrar na classe db e pegando o que bater
	let despesas = bd.pesquisar(despesa)

	
	this.carregaListaDespesas(despesas)



}