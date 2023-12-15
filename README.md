# 20232BSET03P2
Inteli - Engenharia de Software | Avaliação 2023-2B P2

# Descrição das vulnerabilidades identificadas e as medidas adotadas para corrigir cada uma delas:

- Sanitização e validação dos dados de entrada para evitar SQL Injection.
  
O código original haviam strings diretamente nas consultas SQL, o que pode permitir ataques de SQL Injection. A medida adotada foi utilizar placeholders e parâmetros, evitando o uso direto de dados nas consultas.

- Correção na lógica de votação para que verifique se o registro do animal existe antes de adicionar um voto.
  
A rota não verificava se o registro do animal existe antes de adicionar um voto. Para corrigir foi adicionado verificações garantindo que o registro do animal exista antes de realizar a atualização de votos.

- Implementação e tratamento de erros de maneira adequada, sem vazar detalhes de implementação.
  
O erro estava retornando direto da request o que pode expor detalhes no caso de falhas, utilizei um tratamento mais generico, evitando a exposição de detalhes.
