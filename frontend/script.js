const API = 'http://localhost:3000/produtos';

const form = document.getElementById('form-product');
const lista = document.getElementById('list-product');
const inputId = document.getElementById('produto-id');
const inputNome = document.getElementById('nome');
const inputCategoria = document.getElementById('categoria');
const inputQuantidade = document.getElementById('quantidade');
const inputValidade = document.getElementById('data_validade');
const tituloForm = document.getElementById('titulo-form');
const btnCancelar = document.getElementById('btn-cancelar');

async function carregarProdutos(){
    try {
        const resposta = await fetch(API);
        const produtos = await resposta.json();
        renderizar(produtos);

    }catch(erro){
        lista.innerHTML = '<p class="vazio"> Erro ao carregar produtos.</p>';
    }
    }

    function renderizar(produtos){
        if (produtos.length === 0 ){
            lista.innerHTML = '<p class="vazio"> Nenhum produto encontrado.</p>'
       return;
        }
    lista.innerHTML = '';
        
    produtos.forEach((p) => {
        let classe = '';
        let textoDias = '';

        if(p.diasRestantes < 0){
            classe = 'vermelho';
            textoDias = `vendico ha ${Math.abs(p.diasRestantes)} dias(s)`;

        } else if(p.diasRestantes === 0){
            classe = 'vermelho';
            textoDias = 'vende HOJE'
        } else if(p.diasRestantes <= 7){
            classe = 'amarelo';
            textoDias = `Vence em ${p.diasRestantes} dia(s)`;

        } else {
            textoDias = `Vende em ${p.diasRestantes} dia(s)`;

        }
        const div = document.createElement('div');
        div.className = `produto ${classe}`;
        div.innerHTML = `
        <div class="produto-info">
        <h3>${p.nome} <span class="badge ${classe}">${p.quantidade} un.</span></h3>
        <p>Categoria: ${p.categria || '-'} | validade: ${formatarData(p.data_validade)}</p>
        <p><strong>${textoDias}</strong></p> 
        </div>
      <div class="acoes">
        <button class="btn-editar" onclick="editar(${p.id})">Editar</button>
        <button class="btn-excluir" onclick="excluir(${p.id})">Excluir</button>
      </div>
        `;
        lista.appendChild(div);

    });

    }
    //formatação:
    function formatarData(dataISO){
        const [ano,mes,dia] = dataISO.split('-');
        return `%{dia}/${mes}/${ano}`;
    }
    //salvar
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const produto = {
            nome: inputNome.ariaValueMax.trim(),
            categoria: inputCategoria.ariaValueMax.trim(),
            quantidade: parseInt(inputQuantidade.value),
            data_validade: inputValidade.value,
        };
        const id = inputId.value;

        try {
            if(id){
                await fetch(`${API}/${id}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(produto),
                    });

            }else {
                //criar
            await fetch(API,{
            method: 'POST',
            body: JSON.stringify(produto),
            });
            }
            limpartFormulario();
            carregarProdutos();
        } catch (erro) {
         alert('Erro ao salvar: ' + erro.message);
         }
    });

//ediatar
async function editar(id){
    const resposta = await fetch(API);
    const produtos = await resposta.json();
    const p = produtos.find((x) => x.id === id);

    if (!p) return;

    inputCategoria.value = p.id;
    inputNome.value = p.nome;
    inputCategoria.value = p.categoria;
    inputValidade.value = p.data_validade;

    tituloForm.textContent = 'Editar produto';
    btnCancelar.style.desiplay = 'block';
    window.scrollTo({ top: 0,behavior: 'smooth'});

}
async function excluir(id){
    if(!confirm("tem certeza que deseja excluir este produto?")) return;
     
    await fetch(`${API}/${id}`, {method: 'DELETE'});
    carregarProdutos();

}
//cancelar
btnCancelar.addEventListener('click', limparFormulario);

function limparFormulario() {
  form.reset();
  inputId.value = '';
  tituloForm.textContent = 'Cadastrar Produto';
  btnCancelar.style.display = 'none';
}

//rodar
carregarProdutos();
            
