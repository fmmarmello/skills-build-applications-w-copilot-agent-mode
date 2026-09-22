---
mode: 'agent'
model: GPT-5.6-Luna
description: 'Atualizar a app Django Octofit Tracker para usar MongoDB, expor a API REST e suportar todas as entidades da aplicação.'
---

Atualize a app Django Octofit Tracker existente. Todos os arquivos do projeto Django estão no diretório `octofit-tracker/backend/octofit_tracker`.

## Atualizações da App Django

1. Atualize `settings.py` para:
   - configurar a conexão com o MongoDB usando Djongo e o banco de dados `octofit_db`;
   - manter `octofit_tracker`, `rest_framework`, `corsheaders` e `djongo` configurados quando aplicável;
   - configurar o middleware e as opções de CORS necessárias para a API;
   - preservar as configurações existentes que não estiverem relacionadas a esta atualização.

2. Atualize `models.py`, `serializers.py`, `urls.py`, `views.py`, `tests.py` e `admin.py` para suportar as coleções e endpoints de:
   - usuários;
   - equipes;
   - atividades;
   - placar de líderes;
   - treinos e sugestões de treino.

3. Garanta que os modelos, serializers, views e rotas tenham contratos consistentes entre si, usem o ORM do Django e permitam operações REST apropriadas para cada coleção. Preserve validações importantes, relacionamentos, ordenação e unicidade dos dados.

4. Registre os modelos relevantes no Django Admin e adicione testes para os modelos, serializers e endpoints principais, incluindo a resposta da raiz da API.

5. Certifique-se de que `/` aponta para a API e que uma view ou rota chamada `api_root` está presente em `urls.py`, apresentando os endpoints disponíveis.

## Restrições de execução

- Trabalhe a partir do diretório raiz do repositório e não mude de diretórios ao executar comandos.
- Use o ambiente virtual existente em `octofit-tracker/backend/venv`.
- Use o ORM do Django para criar, consultar, atualizar e remover dados; não use scripts diretos do MongoDB para criar a estrutura ou os dados da aplicação.
- Não remova funcionalidades existentes sem necessidade.
- Execute as migrações e os testes Django após as alterações e corrija os problemas introduzidos por esta atualização.
