# 📄 Gerador de Orçamento | AW TECHNOLOGY

Aplicação web demonstrativa para **criação e gerenciamento de orçamentos comerciais**, com cálculo automático de valores, armazenamento de registros no navegador e geração de propostas comerciais em PDF.

Desenvolvido com **HTML5, CSS3 e JavaScript**, utilizando a biblioteca **jsPDF** e o plugin **AutoTable** para geração de documentos.

O projeto demonstra como uma ferramenta digital pode simplificar a elaboração de orçamentos, organizar serviços e apresentar propostas comerciais de maneira prática e profissional.

---

## 🌐 Demonstração Online

🔗 https://gerador-orcamento-two.vercel.app/

---

## 🖼️ Demonstração Visual

<img width="1345" height="766" alt="gerador-orcamento" src="https://github.com/user-attachments/assets/5df7bf52-e1cc-4b82-a470-6ed7d37755b6" />


---

## 🚀 Funcionalidades

- ✅ Cadastro de cliente para elaboração do orçamento.
- ✅ Adição de múltiplos produtos e serviços.
- ✅ Definição de quantidades e valores unitários.
- ✅ Cálculo automático de subtotais e valor total.
- ✅ Campo para observações adicionais.
- ✅ Geração de propostas comerciais em PDF.
- ✅ Salvamento de orçamentos no navegador.
- ✅ Histórico de orçamentos salvos.
- ✅ Consulta e abertura de orçamentos registrados.
- ✅ Exclusão de orçamentos do histórico.
- ✅ Limite de até 50 registros armazenados localmente.
- ✅ Interface responsiva e adaptada a diferentes dispositivos.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Aplicação |
|---|---|
| HTML5 | Estrutura da aplicação |
| CSS3 | Identidade visual, layout e responsividade |
| JavaScript (Vanilla) | Lógica, cálculos e gerenciamento dos orçamentos |
| jsPDF | Geração de documentos PDF |
| jsPDF-AutoTable | Criação de tabelas nos documentos PDF |
| LocalStorage | Armazenamento local dos orçamentos |

---

## 💾 Armazenamento dos Dados

O projeto utiliza o **LocalStorage** do navegador para armazenar os orçamentos cadastrados.

Isso permite:

- Salvar registros sem necessidade de servidor.
- Consultar os orçamentos posteriormente.
- Abrir registros para visualizar seus dados.
- Excluir registros armazenados.

**Importante:** os dados permanecem no navegador e dispositivo utilizados. Não existe sincronização entre dispositivos ou armazenamento em servidor.

A limpeza dos dados do navegador pode apagar os registros salvos.

---

## 📂 Estrutura do Projeto

```text
gerador-orcamento/
│
├── index.html       # Estrutura da aplicação
├── style.css        # Estilos e identidade visual
├── script.js        # Lógica, cálculos e funcionalidades
└── README.md        # Documentação do projeto
```

---

## ▶️ Como Executar Localmente

### 1. Clone o repositório

```bash
git clone https://github.com/awaldige/gerador-orcamento.git
```

### 2. Acesse a pasta

```bash
cd gerador-orcamento
```

### 3. Execute a aplicação

Abra o arquivo `index.html` em um navegador moderno.

Também é possível utilizar a extensão Live Server do Visual Studio Code.

**Observação:** é necessária conexão com a internet para carregar as bibliotecas jsPDF e jsPDF-AutoTable disponibilizadas por CDN.

---

## 📌 Características e Limitações

- Aplicação demonstrativa desenvolvida para estudo e portfólio.
- Não utiliza backend ou banco de dados.
- Não possui autenticação de usuários.
- Os registros são armazenados localmente no navegador.
- Não realiza pagamentos ou emissão de documentos fiscais.
- A geração de PDF é executada diretamente no navegador.

---

## 👨‍💻 Autor

**André Waldige — AW TECHNOLOGY**

Desenvolvedor de soluções digitais, sistemas web e ferramentas personalizadas.

🔗 GitHub: https://github.com/awaldige

🌐 Portfólio: https://andre-waldige.vercel.app/

---

⭐ Projeto desenvolvido para estudo, demonstração de funcionalidades e apresentação de soluções digitais no portfólio AW TECHNOLOGY.
