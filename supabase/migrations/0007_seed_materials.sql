-- Gerado por scripts/materials-to-sql.mjs a partir de content/materials-legacy.ts — não editar à mão.
-- Os 8 materiais que já estavam no site, publicados e sem arquivo
-- (o PDF/planilha de cada um é enviado pelo admin).

insert into public.materials
  (slug, type, title, tagline, headline, description_md, cover_image_url, cover_image_alt,
   image_url, meta_description, faq, status, sort_order, published_at)
values
(
  $vispe$checklist-reforma-tributaria$vispe$,
  $vispe$Checklist$vispe$,
  $vispe$Checklist de transição para a Reforma Tributária$vispe$,
  $vispe$Roteiro prático e estratégico para proteger seu caixa e garantir a conformidade.$vispe$,
  $vispe$Roteiro prático e estratégico para proteger seu caixa e garantir a conformidade na Reforma Tributária$vispe$,
  $vispe$Entender a teoria da nova legislação não garante que sua empresa continuará lucrativa. O desafio real é preparar seus sistemas, rever preços, adaptar o fluxo financeiro ao Split Payment e escolher o regime tributário certo antes dos prazos fatais. O Checklist de Transição resolve isso.

## O que você vai encontrar

- **Auditoria do Ano-Teste**: Como validar emissão de IBS/CBS e cadastro mestre no ERP
- **Prazos Legais Críticos**: Matriz de tomada de decisão para o Simples Híbrido
- **Modelagem de Caixa & Split Payment**: Preparação financeira para a retenção na fonte da CBS
- **Ajustes em Contratos e Precificação**: Como repassar a nova carga B2B/B2C sem perder margem
- **Sistemas, Compliance & KPIs**: Checklist de virada de chave para equipe fiscal e TI

## Desenhado para ser o seu guia operacional contínuo, não uma leitura teórica

Cada pilar do guia traz checklists acionáveis com etapas passo a passo organizadas em ordem cronológica. A transição tributária não acontece do dia para a noite, requer ajustes contínuos de sistemas, contratos e modelagem financeira para manter sua empresa saudável e capitalizada.

- **Auditoria de Cadastro & ERP**: Frequência: Mensal / Trimestral · Prioridade: Alta · Foco da ação: Eliminação de erros de IBS/CBS e NCM
- **Opção pelo Simples Híbrido**: Frequência: Prazo Fixo (Setembro) · Prioridade: Crítica (Legal) · Foco da ação: Simulação de competitividade B2B
- **Impacto do Split Payment no Caixa**: Frequência: Mensal · Prioridade: Crítica · Foco da ação: Projeção de retenção imediata em PIX/Cartão
- **Repaginação de Contratos Longos**: Frequência: Semestral · Prioridade: Média · Foco da ação: Inclusão de cláusulas de IBS, CBS e IS$vispe$,
  $vispe$/media/materials/checklist-reforma-tributaria-cover-842.webp$vispe$,
  $vispe$Capa: Checklist de transição para a Reforma Tributária$vispe$,
  $vispe$/media/materials/checklist-reforma-tributaria-mockup-1200.webp$vispe$,
  $vispe$Entender a teoria da nova legislação não garante que sua empresa continuará lucrativa. O desafio real é preparar seus sistemas, rever preços, adaptar o fluxo financeiro ao Split Payment e escolher o regime tributário certo antes dos prazos fatais. O Checklist de Transição resolve isso.$vispe$,
  $vispe$[{"question":"Este checklist é indicado para qual porte de empresa?","answer":"O material foi desenhado especificamente para CEOs, CFOs, diretores e gestores fiscais de Pequenas e Médias Empresas (PMEs) dos segmentos de Indústria, Comércio, Serviços, E-commerce e Tecnologia. Se a sua empresa emite notas fiscais e precisa se adequar às novas regras de IBS/CBS, este guia é essencial."},{"question":"Minha contabilidade externa já não cuida da Reforma Tributária?","answer":"A contabilidade externa cuida do cumprimento das obrigações fiscais. No entanto, decisões estratégicas sobre margem de lucro, precificação de produtos, alteração de contratos B2B e impacto do Split Payment no caixa são de responsabilidade da gestão interna e da controladoria do negócio."},{"question":"Por que a decisão do Simples Híbrido precisa ser tomada até setembro?","answer":"A legislação exige que a opção pelo modelo Híbrido (no qual a empresa recolhe o IBS/CBS por fora para transferir créditos integrais a clientes B2B) seja formalizada com antecedência. A escolha é irretratável e exige simulação numérica prévia para não destruir sua margem."},{"question":"O e-book é realmente gratuito? Terei que pagar algo depois?","answer":"Sim, 100% gratuito. A Vispe Capital disponibiliza este manual operacional em PDF como parte do nosso compromisso de entregar inteligência financeira e planejamento tributário estratégico para PMEs brasileiras."},{"question":"Como a Vispe Capital pode ajudar minha empresa além do e-book?","answer":"Atuamos na modelagem financeira para a Reforma Tributária, simulação do Simples Híbrido vs. Regular, reestruturação de controladoria e CFO as a Service. Ajudamos seu negócio a antecipar cenários e blindar a lucratividade durante toda a transição."}]$vispe$::jsonb,
  'published',
  10,
  now()
),
(
  $vispe$dre-caixa$vispe$,
  $vispe$Planilha$vispe$,
  $vispe$Demonstrativo de Resultados do Exercício (DRE)$vispe$,
  $vispe$Execute a análise dos dados agora!$vispe$,
  $vispe$Descubra para onde seu dinheiro realmente vai com a Planilha Prática de DRE CAIXA$vispe$,
  $vispe$Vender muito no papel não paga as contas do fim do mês. O segredo de uma empresa saudável é controlar a entrada e saída efetiva de dinheiro no momento exato em que ocorrem. A DRE CAIXA organiza suas finanças pelo Princípio de Caixa, revelando a sobra real e eliminando o sangramento financeiro oculto.

## O que você vai encontrar

- **Estrutura Pronta pelo Princípio de Caixa**: Acompanhe o dinheiro real que entrou e saiu mês a mês
- **Totalizadores Automatizados**: Fórmulas pré-configuradas para Receita Líquida, Lucro Bruto, Margem de Contribuição e EBITDA
- **Separação Rígida de Gastos**: Classificação transparente entre Custos Diretos, Despesas de Vendas/Marketing e G&A
- **Ajustes de CAPEX & Passivos**: Visão clara de amortização de empréstimos, dividendos e investimentos patrimoniais
- **Indicadores de Saúde Financeira**: Cálculo instantâneo da Margem de Caixa Operacional e Caixa Final

## Desenhada para uso diário e tomada de decisão rápida, sem complicações

O modelo é 100% editável e personalizável para a realidade do seu negócio. Basta renomear as linhas de acordo com suas receitas e despesas, preencher os lançamentos mensais e deixar que os totalizadores automáticos façam o cálculo das suas margens em tempo real.

- **Receita Líquida Real**: Frequência: Mensal · Prioridade: Alta · Objetivo na planilha: Entradas operacionais deduzidas de impostos diretos e descontos
- **Margem de Contribuição**: Frequência: Mensal · Prioridade: Alta · Objetivo na planilha: Mede quanto sobrou para cobrir a estrutura fixa após custos e vendas
- **EBITDA Operacional**: Frequência: Mensal · Prioridade: Alta · Objetivo na planilha: Mede a capacidade de geração de caixa das operações principais
- **Fluxo de Caixa Operacional**: Frequência: Semanal / Mensal · Prioridade: Crítica · Objetivo na planilha: Resultado após despesas financeiras, CAPEX e dívidas
- **Caixa Final & Margem Final**: Frequência: Semanal / Mensal · Prioridade: Crítica · Objetivo na planilha: Saldo líquido real disponível para investimento ou distribuição$vispe$,
  $vispe$/media/materials/dre-caixa-cover-842.webp$vispe$,
  $vispe$Capa: Demonstrativo de Resultados do Exercício (DRE)$vispe$,
  $vispe$/media/materials/dre-caixa-mockup-1200.webp$vispe$,
  $vispe$Vender muito no papel não paga as contas do fim do mês. O segredo de uma empresa saudável é controlar a entrada e saída efetiva de dinheiro no momento exato em que ocorrem. A DRE CAIXA organiza suas finanças pelo Princípio de Caixa, revelando a sobra real e eliminando o sangramento financeiro oculto.$vispe$,
  $vispe$[{"question":"Qual a diferença entre DRE Contábil e DRE CAIXA?","answer":"A DRE Contábil funciona por regime de competência (data em que a venda foi realizada ou a nota emitida). A DRE CAIXA opera por regime de caixa, considerando estritamente o dinheiro que efetivamente entrou na conta ou foi pago no mês, refletindo a sobra real da tesouraria."},{"question":"Preciso ter conhecimentos avançados de Excel para usar a planilha?","answer":"Não. A planilha conta com explicações passo a passo em cada linha, estrutura visual clara e fórmulas pré-programadas. Você só precisa preencher os dados do seu negócio e adaptar as categorias."},{"question":"A planilha serve para o meu tipo de empresa?","answer":"Sim. O modelo é versátil e atende empresas de Serviços, Comércio, E-commerce, Tecnologia e Pequenas Indústrias. Como o plano de contas é customizável, você adapta os nomes à sua realidade."},{"question":"O material é realmente gratuito? Terei que pagar algo depois?","answer":"Sim, 100% gratuito. A Vispe Capital disponibiliza este modelo pré-programado em Excel para apoiar empreendedores na estruturação de uma controladoria profissional e previsível."},{"question":"Como a Vispe Capital pode ajudar minha empresa além do modelo DRE?","answer":"Atuamos na reestruturação de controladoria, parametrização de ERPs, planejamento orçamentário e gestão de CFO as a Service para PMEs que desejam aumentar a lucratividade e o valuation do negócio."}]$vispe$::jsonb,
  'published',
  20,
  now()
),
(
  $vispe$como-aumentar-o-valor-da-empresa$vispe$,
  $vispe$Guia prático$vispe$,
  $vispe$Como aumentar o valor da sua empresa$vispe$,
  $vispe$Guia prático para PMEs.$vispe$,
  null,
  '',
  $vispe$/media/materials/como-aumentar-o-valor-da-empresa-cover-842.webp$vispe$,
  $vispe$Capa: Como aumentar o valor da sua empresa$vispe$,
  null,
  null,
  null,
  'published',
  30,
  now()
),
(
  $vispe$devo-tomar-divida$vispe$,
  $vispe$Planilha$vispe$,
  $vispe$Devo tomar dívida?$vispe$,
  $vispe$Otimize seu controle financeiro!$vispe$,
  null,
  '',
  $vispe$/media/materials/devo-tomar-divida-cover-842.webp$vispe$,
  $vispe$Capa: Devo tomar dívida?$vispe$,
  null,
  null,
  null,
  'published',
  40,
  now()
),
(
  $vispe$caixa-preta-do-equity$vispe$,
  $vispe$E-book$vispe$,
  $vispe$A caixa preta do Equity$vispe$,
  $vispe$Tenha acesso às principais estratégias de Equity e M&A.$vispe$,
  null,
  '',
  $vispe$/media/materials/caixa-preta-do-equity-cover-842.webp$vispe$,
  $vispe$Capa: A caixa preta do Equity$vispe$,
  null,
  null,
  null,
  'published',
  50,
  now()
),
(
  $vispe$cemiterio-de-empresas$vispe$,
  $vispe$E-book$vispe$,
  $vispe$O cemitério de empresas$vispe$,
  $vispe$Leia se você não quer que a sua empresa esteja aqui.$vispe$,
  null,
  '',
  $vispe$/media/materials/cemiterio-de-empresas-cover-842.webp$vispe$,
  $vispe$Capa: O cemitério de empresas$vispe$,
  null,
  null,
  null,
  'published',
  60,
  now()
),
(
  $vispe$arquitetura-do-lucro-real$vispe$,
  $vispe$E-book$vispe$,
  $vispe$A Arquitetura do Lucro Real$vispe$,
  $vispe$O mapa completo para uma gestão por margem que funciona.$vispe$,
  $vispe$O mapa completo para uma gestão por margem que funciona$vispe$,
  $vispe$Saber que o DRE contábil não serve para decidir não é o problema. O problema é saber onde o caixa está sangrando primeiro, como separar custos de despesas e como transformar sua DRE num motor de Equity. A Arquitetura do Lucro Real resolve isso.

## O que você vai encontrar

- **Cascata Gerencial de 20 passos**
- **Diagnóstico de DRE Contábil vs. Gerencial**
- **Separação de Custos, Vendas e G&A**
- **Cálculo real de EBITDA e Valuation**
- **Reconciliação com o Fluxo de Caixa Final**
- **Protocolo de leitura em 5 minutos**

## Desenhado para uso contínuo, não como leitura única

Cada capítulo traz uma visão clara de diagnóstico para acompanhar o progresso e uma estrutura passo a passo com checklists para aplicar à sua rotina. As prioridades financeiras não são feitas em linha reta — você pode ajustar seu DRE gerencial conforme o momento e o porte do seu negócio.

A distinção entre margem econômica e saldo de tesouraria é o aspecto mais importante: algumas métricas avaliam a eficiência das vendas, enquanto outras exigem revisão de caixa para manter a empresa saudável e capitalizada.

- **Margem Bruta (CPV/CMV)**: Frequência: Mensal · Prioridade: Alta
- **Linha de Contribuição & CAC**: Frequência: Trimestral / Mensal · Prioridade: Alta
- **Margem EBITDA Operacional**: Frequência: Mensal · Prioridade: Alta
- **Resultado Financeiro & Taxas**: Frequência: Mensal · Prioridade: Média
- **Variável de Caixa Final (CAPEX)**: Frequência: Semanal / Mensal · Prioridade: Crítica$vispe$,
  $vispe$/media/materials/arquitetura-do-lucro-real-cover-842.webp$vispe$,
  $vispe$Capa: A Arquitetura do Lucro Real$vispe$,
  $vispe$/media/materials/arquitetura-do-lucro-real-mockup-1200.webp$vispe$,
  $vispe$Saber que o DRE contábil não serve para decidir não é o problema. O problema é saber onde o caixa está sangrando primeiro, como separar custos de despesas e como transformar sua DRE num motor de Equity. A Arquitetura do Lucro Real resolve isso.$vispe$,
  $vispe$[{"question":"Este e-book é indicado para qual porte ou segmento de empresa?","answer":"O material foi desenvolvido especificamente para fundadores, diretores e gestores financeiros de PMEs (Pequenas e Médias Empresas) de qualquer segmento — indústrias, comércio, e-commerce, tecnologia (SaaS) ou empresas de serviços. Se a sua operação possui faturamento ativo e você busca clareza sobre suas margens e controle do caixa, este guia é para você."},{"question":"Por que o DRE que recebo do meu contador não serve para a gestão do dia a dia?","answer":"O DRE Contábil Tradicional cumpre uma obrigação técnica perante a Receita Federal (foco fiscal e tributário). Ele agrupa custos e despesas em blocos genéricos e opera por regime de competência pura, ocultando a geração real de caixa, o custo de aquisição de clientes (CAC) e o EBITDA da operação. O DRE Gerencial reorganiza esses dados para revelar onde a empresa ganha ou perde margem na prática."},{"question":"O e-book é realmente gratuito? Terei que pagar algo depois?","answer":"Sim, 100% gratuito. A Vispe Capital disponibiliza este manual prático em PDF como parte do nosso compromisso de democratizar a controladoria de alta performance e a cultura de Equity para PMEs no Brasil. Você não precisa cadastrar cartão de crédito para acessar."},{"question":"Preciso trocar de software de gestão (ERP) para aplicar a DRE Gerencial?","answer":"Não. O DRE Gerencial é uma estrutura metodológica de análise, e não um software específico. O e-book ensina a lógica de parametrização e o plano de contas gerencial que você pode aplicar no seu ERP atual, em planilhas ou em ferramentas de Business Intelligence (BI)."},{"question":"O que é o “Protocolo de 5 Minutos” abordado no livro?","answer":"É um método de escaneamento executivo desenvolvido pela Vispe para que o CEO/CFO consiga diagnosticar a saúde financeira do negócio no início do mês sem perder horas analisando planilhas. Ele foca em 5 indicadores-chave de margem percentual que revelam instantaneamente qualquer vazamento de caixa."},{"question":"Como receberei o e-book após preencher o formulário?","answer":"O acesso é imediato. Assim que você preencher o formulário, enviaremos o link de download direto para o seu e-mail cadastrado em formato PDF otimizado para leitura em computador, tablet ou e-reader."},{"question":"Como a Vispe Capital pode ajudar minha empresa além do e-book?","answer":"Além de materiais educativos, a Vispe Capital atua na reestruturação de controladoria, parametrização financeira e gestão estratégica de margem (CFO as a Service) para empresas que buscam gerar previsibilidade de caixa e multiplicar seu valor de mercado (Valuation/Equity). Você pode agendar uma sessão de diagnóstico direto com nossos especialistas após o download do e-book."}]$vispe$::jsonb,
  'published',
  70,
  now()
),
(
  $vispe$checklist-preparacao-ma$vispe$,
  $vispe$Checklist$vispe$,
  $vispe$Checklist de preparação para M&A$vispe$,
  $vispe$Venda sua empresa pelo preço máximo!$vispe$,
  $vispe$O guia definitivo para preparar sua empresa, maximizar o Valuation e atrair os melhores compradores$vispe$,
  $vispe$Preparar uma empresa para Fusões e Aquisições (M&A) é como treinar um atleta para uma final de campeonato: a vitória é decidida muito antes de entrar em campo. Um negócio bem preparado reduz riscos de Due Diligence, acelera a negociação e impede que descontos severos destruam o valor da sua transação. A Vispe Capital estruturou o roteiro definitivo de “arrumação da casa”.

## O que você vai encontrar

- **Governança e Estrutura Jurídica**: Auditoria de acordos de sócios (drag/tag along), marcas e contratos-chave
- **Cálculo do EBITDA Normalizado**: Como expurgar despesas pessoais e não recorrentes para defender seu Valuation
- **Capital de Giro & Projeções**: Definição do alvo de NCG e construção da história de crescimento (Equity Story)
- **Risco Operacional & Pessoas**: Redução da dependência de sócios e mapeamento de passivos trabalhistas
- **Dicas Práticas Imediatas**: Guia direto para o empresário pensar como comprador e montar seu “Conselho de Guerra”

## O roteiro para transformar sua empresa em um ativo altamente líquido

O checklist foi desenhado para ser executado em etapas estratégicas antes do primeiro contato com fundos de investimento ou compradores estratégicos. Organizar dados contábeis, societários e trabalhistas previamente evita a perda de tempo e o insucesso do processo de venda.

- **Governança & Contratos Societários**: Frequência: Etapa Inicial · Prioridade: Crítica · Objetivo no processo de M&A: Mapear drag along, tag along, certidões e marcas em nome da empresa
- **EBITDA Normalizado & DRE**: Frequência: Mensal / Histórico · Prioridade: Alta · Objetivo no processo de M&A: Eliminar despesas pessoais de sócios e defender a margem real negociada
- **Business Plan & Projeções (3-5 anos)**: Frequência: Anual · Prioridade: Alta · Objetivo no processo de M&A: Consolidar a tese de crescimento e retorno financeiro para o investidor
- **Mapeamento de Passivos Trabalhistas**: Frequência: Trimestral · Prioridade: Média · Objetivo no processo de M&A: Eliminar riscos ocultos e acordos verbais com equipe e fornecedores$vispe$,
  $vispe$/media/materials/checklist-preparacao-ma-cover-842.webp$vispe$,
  $vispe$Capa: Checklist de preparação para M&A$vispe$,
  $vispe$/media/materials/checklist-preparacao-ma-mockup-1200.webp$vispe$,
  $vispe$Preparar uma empresa para Fusões e Aquisições (M&A) é como treinar um atleta para uma final de campeonato: a vitória é decidida muito antes de entrar em campo. Um negócio bem preparado reduz riscos de Due Diligence, acelera a negociação e impede que descontos severos destruam o valor da sua transação. A Vispe Capital estruturou o roteiro definitivo de “arrumação da casa”.$vispe$,
  $vispe$[{"question":"O que é Vendor Readiness e por que é fundamental em M&A?","answer":"Vendor Readiness é a preparação prévia do vendedor antes de ir ao mercado. Consiste na auditoria interna de finanças, contratos e governança para identificar e corrigir falhas com antecedência, evitando que o comprador exija descontos expressivos no valuation durante a Due Diligence."},{"question":"O que é EBITDA Normalizado e por que ele é central na venda?","answer":"É o EBITDA operacional limpo de despesas e receitas não recorrentes (como despesas pessoais dos sócios ou venda pontual de um imóvel). Como o preço final da transação costuma ser um múltiplo do EBITDA, quanto mais organizado e defendível for esse número, maior o valor de venda."},{"question":"Quando devo começar a preparar minha empresa para uma venda?","answer":"O ideal é iniciar o processo de “arrumação da casa” de 12 a 24 meses antes do momento desejado para a venda. Isso garante tempo suficiente para normalizar balanços, profissionalizar a equipe e construir uma história de crescimento sólida."},{"question":"O e-book é gratuito? Terei custos posteriores?","answer":"Sim, 100% gratuito. A Vispe Capital disponibiliza este guia como parte do compromisso com a cultura de Equity e preparação executiva no Brasil."},{"question":"Como a Vispe Capital assessora meu processo de M&A?","answer":"Atuamos como seu Advisor financeiro e estratégico, conduzindo a avaliação de Valuation, preparação do Data Room, prospecção de compradores elegíveis, condução de Due Diligence e negociação final dos termos da transação."}]$vispe$::jsonb,
  'published',
  80,
  now()
)
on conflict (slug) do nothing;
